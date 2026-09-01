import express from 'express';
import multer from 'multer';
import path from 'path';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { authenticateToken as auth } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'application-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'));
    }
  }
});

// GET /api/jobs - Get all active jobs (for users)
router.get('/', async (req, res) => {
  try {
    const { search, location, type } = req.query;
    const filter = { status: 'active' };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (type) {
      filter.type = type;
    }

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    const jobsResponse = jobs.map(job => ({
      _id: job._id,
      title: job.title,
      company: job.company,
      department: job.department,
      location: job.location,
      type: job.type,
      workMode: job.workMode,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements,
      status: job.status,
      applications: job.applications?.length || 0,
      views: job.views,
      createdAt: job.createdAt
    }));

    res.json({ success: true, jobs: jobsResponse });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
  }
});

// GET /api/jobs/:id - Get specific job details
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email company');
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Increment view count
    await job.incrementView();

    res.json({ success: true, job });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch job details' });
  }
});

// POST /api/jobs/apply - Apply for a job
router.post('/apply', auth, upload.single('resume'), async (req, res) => {
  try {
    const { jobId, name, email, coverLetter } = req.body;
    const userId = req.user.userId || req.user.id;

    if (!jobId || !name || !email) {
      return res.status(400).json({ message: 'Job ID, name, and email are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Add application
    job.applications.push({
      userId: userId,
      name,
      email,
      resume: req.file.path.replace(/\\/g, '/'),
      coverLetter: coverLetter || '',
      status: 'new',
      appliedAt: new Date()
    });

    await job.save();

    // Create notification for user
    await Notification.create({
      userId: userId,
      type: 'job_application',
      title: 'Application Submitted',
      message: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
      relatedId: job._id
    });

    res.json({ message: 'Application submitted successfully', success: true });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/jobs/stats/overview - Get job statistics for dashboard
router.get('/stats/overview', async (req, res) => {
  try {
    // Total active jobs
    const totalJobs = await Job.countDocuments({ status: 'active' });

    // Remote jobs (check workMode field)
    const remoteJobs = await Job.countDocuments({ 
      status: 'active',
      workMode: 'Remote'
    });

    // Recent jobs (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentJobs = await Job.countDocuments({
      status: 'active',
      createdAt: { $gte: oneWeekAgo }
    });

    // Top companies by job count
    const topCompaniesAgg = await Job.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$company', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { company: '$_id', count: 1, _id: 0 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalJobs,
        remoteJobs,
        recentJobs,
        topCompanies: topCompaniesAgg
      }
    });
  } catch (error) {
    console.error('Error fetching job statistics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

// GET /api/jobs/search - Search jobs (for dashboard recommendations)
router.get('/search', async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    
    const filter = { status: 'active' };
    
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const jobsResponse = jobs.map(job => ({
      id: job._id.toString(),
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary || 'Not disclosed',
      logo: null,
      skills: [],
      createdAt: job.createdAt
    }));

    res.json({ success: true, jobs: jobsResponse });
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({ success: false, message: 'Failed to search jobs' });
  }
});

export default router;
