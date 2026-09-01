import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Job from '../models/Job.js';

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * POST /api/aimatch/calculate
 * Calculate AI match scores between user resume and jobs
 * Body: { resumeText, skills, experience }
 */
router.post('/calculate', async (req, res) => {
  try {
    const { resumeText, skills = [], experience = '' } = req.body;

    if (!resumeText && skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide resume text or skills for matching'
      });
    }

    // Get all jobs from database
    const jobs = await Job.find().limit(20).sort({ createdAt: -1 });

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No jobs available for matching'
      });
    }

    // Calculate match scores using Gemini AI
    const jobMatches = [];

    for (const job of jobs) {
      try {
        const matchScore = await calculateMatchScore(
          resumeText,
          skills,
          experience,
          job
        );

        jobMatches.push({
          id: job.jobId,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          salary: job.salary,
          description: job.description,
          fullDescription: job.fullDescription,
          applyUrl: job.applyUrl,
          posted: job.posted,
          logo: job.logo,
          experience: job.experience,
          skills: job.skills,
          isRemote: job.isRemote,
          benefits: job.benefits,
          qualifications: job.qualifications,
          responsibilities: job.responsibilities,
          matchScore: matchScore.score,
          matchReasons: matchScore.reasons,
          missingSkills: matchScore.missingSkills
        });
      } catch (error) {
        console.error(`Error calculating match for job ${job.jobId}:`, error.message);
        // Continue with next job
      }
    }

    // Sort by match score (highest first)
    jobMatches.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      count: jobMatches.length,
      matches: jobMatches,
      summary: {
        totalJobs: jobMatches.length,
        highMatches: jobMatches.filter(j => j.matchScore >= 80).length,
        goodMatches: jobMatches.filter(j => j.matchScore >= 60 && j.matchScore < 80).length,
        fairMatches: jobMatches.filter(j => j.matchScore < 60).length
      }
    });

  } catch (error) {
    console.error('AI Match Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate job matches',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Calculate match score using Gemini AI
 */
async function calculateMatchScore(resumeText, userSkills, userExperience, job) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `
You are an expert job matching AI. Analyze the match between a candidate's profile and a job posting.

CANDIDATE PROFILE:
Resume/Skills: ${resumeText || userSkills.join(', ')}
Experience: ${userExperience}

JOB POSTING:
Title: ${job.title}
Company: ${job.company}
Required Skills: ${job.skills.join(', ')}
Experience Required: ${job.experience}
Description: ${job.description}
Qualifications: ${job.qualifications.join(', ')}

TASK:
1. Calculate a match score from 0-100 based on:
   - Skills overlap (40% weight)
   - Experience match (30% weight)
   - Qualifications match (20% weight)
   - Overall profile fit (10% weight)

2. Provide 2-3 key reasons for the match score
3. List 2-3 missing skills the candidate should develop

Respond in this exact JSON format:
{
  "score": <number between 0-100>,
  "reasons": ["reason1", "reason2", "reason3"],
  "missingSkills": ["skill1", "skill2", "skill3"]
}

Be realistic and accurate. Return only valid JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const matchData = JSON.parse(jsonMatch[0]);
      return {
        score: Math.min(Math.max(matchData.score || 50, 0), 100),
        reasons: matchData.reasons || ['Match calculated based on profile analysis'],
        missingSkills: matchData.missingSkills || []
      };
    }

    // Fallback if Gemini doesn't return proper JSON
    return calculateFallbackScore(userSkills, job);

  } catch (error) {
    console.error('Gemini AI Error:', error.message);
    // Fallback to simple calculation
    return calculateFallbackScore(userSkills, job);
  }
}

/**
 * Fallback match calculation (if Gemini fails)
 */
function calculateFallbackScore(userSkills, job) {
  let score = 50; // Base score
  const reasons = [];
  const missingSkills = [];

  // Calculate skill overlap
  const jobSkills = job.skills.map(s => s.toLowerCase());
  const candidateSkills = userSkills.map(s => s.toLowerCase());

  const matchingSkills = jobSkills.filter(skill => 
    candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs))
  );

  if (matchingSkills.length > 0) {
    const skillMatchPercent = (matchingSkills.length / jobSkills.length) * 100;
    score += Math.min(skillMatchPercent * 0.4, 40);
    reasons.push(`${matchingSkills.length} matching skills found`);
  }

  // Find missing skills
  const missing = jobSkills.filter(skill => !matchingSkills.includes(skill));
  missingSkills.push(...missing.slice(0, 3));

  // Job type bonuses
  if (job.isRemote) {
    score += 5;
    reasons.push('Remote work opportunity');
  }

  if (job.type.toLowerCase().includes('full-time')) {
    score += 3;
  }

  // Add generic reason if needed
  if (reasons.length === 0) {
    reasons.push('Profile shows potential for this role');
  }

  return {
    score: Math.min(Math.round(score), 98),
    reasons: reasons.slice(0, 3),
    missingSkills: missingSkills.length > 0 ? missingSkills : ['Continue building your skills']
  };
}

/**
 * GET /api/aimatch/quick
 * Quick match based on skills only (no resume needed)
 * Query params: skills (comma-separated)
 */
router.get('/quick', async (req, res) => {
  try {
    const { skills = '' } = req.query;

    if (!skills) {
      return res.status(400).json({
        success: false,
        message: 'Please provide skills for matching'
      });
    }

    const userSkills = skills.split(',').map(s => s.trim());

    // Get all active jobs from database
    const jobs = await Job.find({ status: 'active' })
      .limit(20)
      .sort({ createdAt: -1 });

    if (jobs.length === 0) {
      return res.json({
        success: true,
        count: 0,
        matches: [],
        message: 'No jobs available for matching'
      });
    }

    // Calculate simple match scores
    const jobMatches = jobs.map(job => {
      // Extract skills from description and requirements
      const jobText = `${job.description} ${job.requirements}`.toLowerCase();
      const detectedSkills = [];
      
      // Common tech skills to check
      const commonSkills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 
                           'MongoDB', 'SQL', 'AWS', 'Docker', 'Git', 'Angular', 'Vue'];
      
      commonSkills.forEach(skill => {
        if (jobText.includes(skill.toLowerCase())) {
          detectedSkills.push(skill);
        }
      });

      const matchData = calculateFallbackScore(userSkills, {
        ...job.toObject(),
        skills: detectedSkills.length > 0 ? detectedSkills : ['General Skills']
      });

      // Calculate time ago
      const now = new Date();
      const past = new Date(job.createdAt);
      const diffDays = Math.floor((now.getTime() - past.getTime()) / 86400000);
      let posted = 'Today';
      if (diffDays === 1) posted = '1 day ago';
      else if (diffDays < 7) posted = `${diffDays} days ago`;
      else if (diffDays < 30) posted = `${Math.floor(diffDays / 7)} weeks ago`;
      else posted = `${Math.floor(diffDays / 30)} months ago`;

      return {
        id: job._id.toString(),
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salary: job.salary || 'Not disclosed',
        description: job.description.substring(0, 200) + '...',
        fullDescription: job.description,
        applyUrl: `/jobs/${job._id}`,
        posted,
        logo: null,
        skills: detectedSkills.length > 0 ? detectedSkills : ['General Skills'],
        isRemote: job.type?.toLowerCase().includes('remote') || false,
        experience: 'See job description',
        benefits: [],
        qualifications: job.requirements ? [job.requirements.substring(0, 100)] : [],
        responsibilities: [job.description.substring(0, 100)],
        matchScore: matchData.score,
        matchReasons: matchData.reasons,
        missingSkills: matchData.missingSkills
      };
    });

    // Sort by score
    jobMatches.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      count: jobMatches.length,
      matches: jobMatches
    });

  } catch (error) {
    console.error('Quick Match Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate matches'
    });
  }
});

export default router;
