import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * Common technical and soft skills database
 */
const COMMON_SKILLS = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
  // Frontend
  'React', 'Angular', 'Vue', 'Next.js', 'Nuxt.js', 'HTML', 'CSS', 'SASS', 'TailwindCSS', 'Bootstrap', 'Material-UI',
  // Backend
  'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'Laravel', 'Rails',
  // Databases
  'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Cassandra', 'SQL', 'NoSQL', 'Firebase',
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Git', 'GitHub', 'GitLab',
  // Tools
  'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum', 'JIRA', 'Linux', 'Webpack', 'Babel',
  // Soft Skills
  'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management', 'Critical Thinking'
];

/**
 * Extract skills from text
 */
function extractSkills(text) {
  const textLower = text.toLowerCase();
  const foundSkills = COMMON_SKILLS.filter(skill => 
    textLower.includes(skill.toLowerCase())
  );
  return [...new Set(foundSkills)]; // Remove duplicates
}

/**
 * Extract keywords from text (simple implementation)
 */
function extractKeywords(text) {
  // Remove common words
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did'];
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
  
  // Count frequency
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // Sort by frequency and get top keywords
  return Object.keys(frequency)
    .sort((a, b) => frequency[b] - frequency[a])
    .slice(0, 30);
}

/**
 * Calculate keyword match percentage
 */
function calculateKeywordMatch(resumeKeywords, jobKeywords) {
  if (jobKeywords.length === 0) return 0;
  
  const matches = resumeKeywords.filter(keyword => 
    jobKeywords.includes(keyword)
  );
  
  return Math.round((matches.length / jobKeywords.length) * 100);
}

/**
 * Calculate basic ATS score (without AI)
 */
function calculateBasicScore(resumeText, jobDescription) {
  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobDescription);
  const resumeKeywords = extractKeywords(resumeText);
  const jobKeywords = extractKeywords(jobDescription);
  
  // Skills match (50%)
  const matchedSkills = resumeSkills.filter(skill => 
    jobSkills.some(js => js.toLowerCase() === skill.toLowerCase())
  );
  const skillScore = jobSkills.length > 0 
    ? (matchedSkills.length / jobSkills.length) * 50 
    : 0;
  
  // Keyword match (30%)
  const keywordScore = calculateKeywordMatch(resumeKeywords, jobKeywords) * 0.3;
  
  // Length and formatting bonus (20%)
  const lengthScore = resumeText.length > 500 && resumeText.length < 5000 ? 20 : 10;
  
  const totalScore = Math.min(Math.round(skillScore + keywordScore + lengthScore), 100);
  
  const missingSkills = jobSkills.filter(js => 
    !matchedSkills.some(ms => ms.toLowerCase() === js.toLowerCase())
  );
  
  return {
    score: totalScore,
    matchedSkills,
    missingSkills,
    details: {
      skillMatch: Math.round((matchedSkills.length / (jobSkills.length || 1)) * 100),
      keywordMatch: calculateKeywordMatch(resumeKeywords, jobKeywords),
      formattingScore: lengthScore
    }
  };
}

/**
 * Analyze resume with Gemini AI
 */
async function analyzeWithGemini(resumeText, jobDescription) {
  if (!genAI) {
    throw new Error('Gemini API key not configured');
  }
  
  // Normalize overriding model via `GEMINI_MODEL` env var. Use a safe default
  // model name for the v1beta API if the env var is empty or whitespace.
  const envModel = process.env.GEMINI_MODEL;
  const requestedModel = envModel && envModel.trim() ? envModel.trim() : 'gemini-3.6-flash';

  // Build the prompt once
  const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following resume against the job description and provide a detailed assessment.

RESUME:
${resumeText.substring(0, 3000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 1500)}

Please provide a JSON response with the following structure:
{
  "atsScore": <number 0-100>,
  "matchedSkills": [<array of skills found in both resume and job>],
  "missingSkills": [<array of important skills in job but missing from resume>],
  "strengths": [<3 key strengths of the resume>],
  "weaknesses": [<3 areas for improvement>],
  "recommendations": [
    {"priority": "High", "recommendation": "<specific actionable advice>"},
    {"priority": "Medium", "recommendation": "<specific actionable advice>"}
  ],
  "keywordDensity": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>"
}

Be specific, actionable, and honest in your assessment.`;

  // Try requested model first, then fallback to a safe default. Ensure we
  // never include undefined values in the candidate list.
  let lastError;
  const triedModels = new Set();
  const tryModels = [];
  if (requestedModel) tryModels.push(requestedModel);
  if (!tryModels.includes('gemini-pro')) tryModels.push('gemini-pro');

  for (const modelName of tryModels) {
    if (triedModels.has(modelName)) continue;
    triedModels.add(modelName);

    try {
      console.log(`Attempting Gemini model: ${modelName ?? 'unknown'}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // If we get here, parsing failed for this model's response.
      lastError = new Error('Could not parse AI response');
      console.error(`Gemini AI: response parse failed for model ${modelName}`);
    } catch (error) {
      lastError = error;
      console.error(`Gemini AI error for model ${modelName}:`, error && error.message ? error.message : error);

      // If it's a 404 model-not-found, continue to next candidate; otherwise rethrow.
      if (error && (error.status === 404 || (error.message && error.message.includes('not found')))) {
        console.warn(`Model ${modelName} not available, trying next fallback if any.`);
        continue;
      }

      // Non-model-not-found errors: rethrow to be handled by caller.
      throw error;
    }
  }

  // If all attempts failed, throw the last captured error.
  console.error('All Gemini model attempts failed');
  throw lastError || new Error('Gemini analysis failed');
}

/**
 * Generate fallback recommendations
 */
function generateFallbackRecommendations(basicScore) {
  const recommendations = [];
  
  if (basicScore.missingSkills.length > 0) {
    recommendations.push({
      priority: 'High',
      recommendation: `Add these key skills to your resume: ${basicScore.missingSkills.slice(0, 5).join(', ')}`
    });
  }
  
  if (basicScore.details.keywordMatch < 60) {
    recommendations.push({
      priority: 'High',
      recommendation: 'Increase keyword density by incorporating more terms from the job description naturally throughout your resume'
    });
  }
  
  if (basicScore.score < 70) {
    recommendations.push({
      priority: 'High',
      recommendation: 'Tailor your resume more specifically to this job posting by highlighting relevant experience and skills'
    });
  }
  
  recommendations.push({
    priority: 'Medium',
    recommendation: 'Use standard section headings like "Professional Experience", "Education", "Skills", and "Certifications"'
  });
  
  recommendations.push({
    priority: 'Medium',
    recommendation: 'Quantify your achievements with specific numbers, percentages, and measurable results'
  });
  
  return recommendations;
}

/**
 * Main analysis function
 */
export async function analyzeResume(resumeText, jobDescription) {
  try {
    // Always calculate basic score first
    const basicScore = calculateBasicScore(resumeText, jobDescription);
    
    // Try to use AI for enhanced analysis
    if (genAI) {
      try {
        console.log('Using Gemini AI for analysis...');
        const aiAnalysis = await analyzeWithGemini(resumeText, jobDescription);
        
        return {
          score: aiAnalysis.atsScore || basicScore.score,
          matchedSkills: aiAnalysis.matchedSkills || basicScore.matchedSkills,
          missingSkills: aiAnalysis.missingSkills || basicScore.missingSkills,
          strengths: aiAnalysis.strengths || ['Good technical skills', 'Relevant experience', 'Clear formatting'],
          weaknesses: aiAnalysis.weaknesses || ['Limited keyword optimization', 'Missing some key skills', 'Could add more quantifiable achievements'],
          recommendations: aiAnalysis.recommendations || generateFallbackRecommendations(basicScore),
          keywordDensity: aiAnalysis.keywordDensity || basicScore.details.keywordMatch,
          summary: aiAnalysis.summary || `Your resume scores ${basicScore.score}/100 for this position. ${basicScore.matchedSkills.length} key skills matched.`,
          details: {
            skillMatch: basicScore.details.skillMatch,
            keywordMatch: basicScore.details.keywordMatch,
            formattingScore: basicScore.details.formattingScore
          },
          analyzedAt: new Date().toISOString(),
          aiPowered: true
        };
      } catch (aiError) {
        console.error('AI analysis failed, using basic scoring:', aiError);
      }
    }
    
    // Fallback to basic analysis
    console.log('Using basic scoring algorithm...');
    return {
      score: basicScore.score,
      matchedSkills: basicScore.matchedSkills,
      missingSkills: basicScore.missingSkills,
      strengths: ['Technical skills match', 'Relevant background', 'Proper formatting'],
      weaknesses: ['Could improve keyword usage', 'Add more achievements', 'Tailor content more'],
      recommendations: generateFallbackRecommendations(basicScore),
      keywordDensity: basicScore.details.keywordMatch,
      summary: `Your resume scores ${basicScore.score}/100 for this position. Consider adding the missing skills and keywords to improve your match.`,
      details: basicScore.details,
      analyzedAt: new Date().toISOString(),
      aiPowered: false
    };
    
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze resume: ' + error.message);
  }
}

export default { analyzeResume };
