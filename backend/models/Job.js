import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  resume: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['new', 'under_review', 'interviewed', 'rejected', 'accepted'],
    default: 'new'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const jobSchema = new mongoose.Schema({
  // Basic job information
  title: {
    type: String,
    required: true,
    index: true
  },
  company: {
    type: String,
    required: true,
    index: true
  },
  department: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  workMode: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid'],
    default: 'On-site'
  },
  salary: {
    type: String,
    default: ''
  },
  
  // Job descriptions
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    default: ''
  },
  
  // HR who posted this job
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Job status
  status: {
    type: String,
    enum: ['active', 'paused', 'closed'],
    default: 'active',
    index: true
  },
  
  // Applications
  applications: [ApplicationSchema],
  
  // Metadata
  views: {
    type: Number,
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for searching jobs
jobSchema.index({ title: 'text', company: 'text', description: 'text', location: 'text' });

// Index for finding active jobs
jobSchema.index({ status: 1, createdAt: -1 });

// Method to increment view count
jobSchema.methods.incrementView = function() {
  this.views += 1;
  return this.save();
};

const Job = mongoose.model('Job', jobSchema);

export default Job;
