import express from 'express';
import { authenticateToken as auth } from '../middleware/auth.js';
import User from '../models/User.js';
import Job from '../models/Job.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ 
      message: 'Access denied. Admin privileges required.',
      currentRole: req.user.role,
      isAdmin: req.user.is_admin
    });
  }
  next();
};

// GET /api/admin/dashboard - Get admin dashboard statistics
router.get('/dashboard', auth, isAdmin, async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalHR = await User.countDocuments({ role: 'hr' });
    const totalCandidates = await User.countDocuments({ role: 'user' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });

    // Total applications across all jobs
    const jobs = await Job.find();
    const totalApplications = jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);

    // Recent users (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: oneWeekAgo } });

    // Recent jobs (last 7 days)
    const recentJobs = await Job.countDocuments({ createdAt: { $gte: oneWeekAgo } });

    // Growth trends (month over month)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const usersLastMonth = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });
    const jobsLastMonth = await Job.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          hr: totalHR,
          candidates: totalCandidates,
          recent: recentUsers,
          growth: usersLastMonth
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          recent: recentJobs,
          growth: jobsLastMonth
        },
        applications: {
          total: totalApplications
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// GET /api/admin/users - Get all users with pagination
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/users/:userId - Update user
router.put('/users/:userId', auth, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, role, is_admin } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof is_admin === 'boolean') user.is_admin = is_admin;

    await user.save();

    res.json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/admin/users/:userId - Delete user
router.delete('/users/:userId', auth, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (userId === req.user.id || userId === req.user.userId) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Also delete jobs posted by this user if they're HR
    if (user.role === 'hr') {
      await Job.deleteMany({ postedBy: userId });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/jobs - Get all jobs
router.get('/jobs', auth, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/admin/jobs/:jobId - Delete job
router.delete('/jobs/:jobId', auth, isAdmin, async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/jobs/:jobId/status - Update job status
router.put('/jobs/:jobId/status', auth, isAdmin, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    job.status = status;
    await job.save();

    res.json({ success: true, message: 'Job status updated', job });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/activity - Get recent activity
router.get('/activity', auth, isAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    // Get recent users
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent jobs
    const recentJobs = await Job.find()
      .select('title company createdAt postedBy')
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const activities = [];

    // Add user registrations
    recentUsers.forEach(user => {
      activities.push({
        type: 'user_registered',
        description: `New ${user.role === 'hr' ? 'HR' : 'user'} registered: ${user.name}`,
        timestamp: user.createdAt,
        icon: '👤'
      });
    });

    // Add job postings
    recentJobs.forEach(job => {
      activities.push({
        type: 'job_posted',
        description: `New job posted: ${job.title} at ${job.company}`,
        timestamp: job.createdAt,
        icon: '💼'
      });
    });

    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      activities: activities.slice(0, limit)
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
