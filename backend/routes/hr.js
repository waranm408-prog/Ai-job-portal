import express from 'express';
import { authenticateToken as auth } from '../middleware/auth.js';
import Job from '../models/Job.js';

const router = express.Router();

// Middleware to check if user is HR
const isHR = (req, res, next) => {
  console.log('isHR middleware - User object:', req.user);
  console.log('isHR middleware - Role:', req.user?.role);
  
  if (req.user.role !== 'hr') {
    return res.status(403).json({ 
      message: 'Access denied. HR role required.',
      currentRole: req.user.role,
      userId: req.user.userId || req.user.id
    });
  }
  next();
};

// Get HR dashboard stats
router.get('/dashboard/stats', auth, isHR, async (req, res) => {
  try {
    const hrId = req.user.id || req.user.userId;

    // Get active jobs count
    const activeJobs = await Job.countDocuments({ 
      postedBy: hrId,
      status: 'active'
    });

    // Get total applications count
    const jobs = await Job.find({ postedBy: hrId });
    const totalApplications = jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);

    // Get pending review count (applications without status or with 'pending' status)
    let pendingReview = 0;
    jobs.forEach(job => {
      if (job.applications) {
        pendingReview += job.applications.filter(app => 
          !app.status || app.status === 'pending' || app.status === 'new'
        ).length;
      }
    });

    // Get interviews scheduled (applications with 'interviewed' status)
    let interviewsScheduled = 0;
    jobs.forEach(job => {
      if (job.applications) {
        interviewsScheduled += job.applications.filter(app => 
          app.status === 'interviewed'
        ).length;
      }
    });

    // Calculate weekly changes
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newJobsThisWeek = await Job.countDocuments({
      postedBy: hrId,
      createdAt: { $gte: oneWeekAgo }
    });

    res.json({
      activeJobs,
      totalApplications,
      pendingReview,
      interviewsScheduled,
      newJobsThisWeek
    });
  } catch (error) {
    console.error('Error fetching HR dashboard stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recent activity
router.get('/dashboard/activity', auth, isHR, async (req, res) => {
  try {
    const hrId = req.user.id || req.user.userId;
    const activities = [];

    // Get recent jobs and applications
    const recentJobs = await Job.find({ postedBy: hrId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('applications.userId', 'name email');

    recentJobs.forEach(job => {
      // Add job creation activity
      activities.push({
        type: 'job_created',
        message: `Job posting "${job.title}" published`,
        timestamp: job.createdAt,
        icon: '✅'
      });

      // Add recent applications
      if (job.applications && job.applications.length > 0) {
        job.applications.slice(0, 3).forEach(app => {
          activities.push({
            type: 'new_application',
            message: `New application for ${job.title}`,
            timestamp: app.appliedAt || job.createdAt,
            icon: '👤'
          });
        });
      }
    });

    // Sort by timestamp and limit to 10
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const recentActivities = activities.slice(0, 10);

    res.json(recentActivities);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all jobs posted by HR
router.get('/jobs', auth, isHR, async (req, res) => {
  try {
    const hrId = req.user.id || req.user.userId;
    const jobs = await Job.find({ postedBy: hrId })
      .sort({ createdAt: -1 });

    const jobsWithDetails = jobs.map(job => ({
      _id: job._id,
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      status: job.status || 'active',
      applications: job.applications?.length || 0,
      postedDate: job.createdAt,
      description: job.description,
      requirements: job.requirements,
      salary: job.salary
    }));

    res.json(jobsWithDetails);
  } catch (error) {
    console.error('Error fetching HR jobs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new job posting
router.post('/jobs', auth, isHR, async (req, res) => {
  try {
    const hrId = req.user.userId || req.user.id;
    const { title, department, location, type, salary, description, requirements, company } = req.body;

    const newJob = new Job({
      title,
      company: company || 'Your Company',
      department,
      location,
      type,
      salary,
      description,
      requirements,
      postedBy: hrId,
      status: 'active',
      applications: []
    });

    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully', job: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update job posting
router.put('/jobs/:jobId', auth, isHR, async (req, res) => {
  try {
    const hrId = req.user.id || req.user.userId;
    const { jobId } = req.params;

    const job = await Job.findOne({ _id: jobId, postedBy: hrId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const { title, department, location, type, salary, description, requirements, status } = req.body;
    
    if (title) job.title = title;
    if (department) job.department = department;
    if (location) job.location = location;
    if (type) job.type = type;
    if (salary) job.salary = salary;
    if (description) job.description = description;
    if (requirements) job.requirements = requirements;
    if (status) job.status = status;

    await job.save();
    res.json({ message: 'Job updated successfully', job });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete job posting
router.delete('/jobs/:jobId', auth, isHR, async (req, res) => {
  try {
    const hrId = req.user.id || req.user.userId;
    const { jobId } = req.params;

    const job = await Job.findOneAndDelete({ _id: jobId, postedBy: hrId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all applications for HR's jobs
router.get('/applications', auth, isHR, async (req, res) => {
  try {
    const hrId = req.user.id || req.user.userId;
    const { jobId, status } = req.query;

    let query = { postedBy: hrId };
    if (jobId) query._id = jobId;

    const jobs = await Job.find(query)
      .populate('applications.userId', 'name email phone');

    const allApplications = [];
    jobs.forEach(job => {
      if (job.applications && job.applications.length > 0) {
        job.applications.forEach(app => {
          if (!status || app.status === status) {
            allApplications.push({
              _id: app._id,
              jobId: job._id,
              jobTitle: job.title,
              candidateName: app.userId?.name || app.name || 'Unknown',
              candidateEmail: app.userId?.email || app.email || 'N/A',
              resume: app.resume,
              coverLetter: app.coverLetter,
              status: app.status || 'new',
              appliedAt: app.appliedAt,
              userId: app.userId?._id
            });
          }
        });
      }
    });

    // Sort by application date (newest first)
    allApplications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    res.json(allApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update application status
router.put('/applications/:jobId/:applicationId', auth, isHR, async (req, res) => {
  try {
    const hrId = req.user.id || req.user.userId;
    const { jobId, applicationId } = req.params;
    const { status } = req.body;

    const job = await Job.findOne({ _id: jobId, postedBy: hrId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const application = job.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await job.save();

    res.json({ message: 'Application status updated', application });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get analytics data
// Get analytics data
router.get('/analytics', auth, isHR, async (req, res) => {
  try {
    const hrId = req.user.id || req.user.userId;
    const jobs = await Job.find({ postedBy: hrId }).populate('applications.userId', 'name email');

    // Calculate metrics
    const totalJobs = jobs.length;
    const totalApplications = jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
    
    // Applications by status
    const applicationsByStatus = {
      new: 0,
      underReview: 0,
      interviewed: 0,
      rejected: 0,
      accepted: 0
    };

    // Track application dates for time calculations
    const applicationDates = [];

    jobs.forEach(job => {
      if (job.applications) {
        job.applications.forEach(app => {
          const status = app.status || 'new';
          if (status === 'new') applicationsByStatus.new++;
          else if (status === 'under_review') applicationsByStatus.underReview++;
          else if (status === 'interviewed') applicationsByStatus.interviewed++;
          else if (status === 'rejected') applicationsByStatus.rejected++;
          else if (status === 'accepted') applicationsByStatus.accepted++;
          
          // Track application dates
          if (app.appliedAt) {
            applicationDates.push(new Date(app.appliedAt));
          }
        });
      }
    });

    // Calculate average time to hire (days from first app to now)
    let averageTimeToHire = 'N/A';
    if (applicationDates.length > 0) {
      const oldestApp = Math.min(...applicationDates.map(d => d.getTime()));
      const daysSinceOldest = Math.floor((Date.now() - oldestApp) / (1000 * 60 * 60 * 24));
      averageTimeToHire = daysSinceOldest > 0 ? `${daysSinceOldest} days` : 'Less than 1 day';
    }

    // Calculate application rate (applications per job)
    const applicationRate = totalJobs > 0 
      ? `${(totalApplications / totalJobs).toFixed(1)} per job`
      : '0 per job';

    // Calculate offer acceptance rate (accepted / (accepted + rejected))
    const totalResponded = applicationsByStatus.accepted + applicationsByStatus.rejected;
    const offerAcceptanceRate = totalResponded > 0
      ? `${Math.round((applicationsByStatus.accepted / totalResponded) * 100)}%`
      : 'N/A';

    // Job performance with real data
    const jobPerformance = jobs.map(job => ({
      _id: job._id,
      title: job.title,
      views: job.views || 0, // Use actual views count
      applications: job.applications?.length || 0,
      status: job.status || 'active',
      createdAt: job.createdAt,
      // Application details for this job
      applicants: job.applications?.map(app => ({
        name: app.userId?.name || app.name || 'Unknown',
        email: app.userId?.email || app.email || 'N/A',
        appliedAt: app.appliedAt,
        status: app.status || 'new'
      })) || []
    }));

    // Sort by applications count (highest first)
    jobPerformance.sort((a, b) => b.applications - a.applications);

    res.json({
      totalJobs,
      totalApplications,
      applicationsByStatus,
      jobPerformance,
      averageTimeToHire,
      applicationRate,
      offerAcceptanceRate,
      // Additional insights
      insights: {
        mostPopularJob: jobPerformance[0]?.title || 'N/A',
        totalViews: jobs.reduce((sum, job) => sum + (job.views || 0), 0),
        conversionRate: jobs.reduce((sum, job) => sum + (job.views || 0), 0) > 0
          ? `${((totalApplications / jobs.reduce((sum, job) => sum + (job.views || 0), 0)) * 100).toFixed(1)}%`
          : '0%'
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
