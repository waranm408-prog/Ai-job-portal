import axios from './axios';

export interface DashboardStats {
  activeJobs: number;
  totalApplications: number;
  pendingReview: number;
  interviewsScheduled: number;
  newJobsThisWeek: number;
}

export interface Activity {
  type: string;
  message: string;
  timestamp: string;
  icon: string;
}

export interface JobPosting {
  _id: string;
  title: string;
  department?: string;
  location: string;
  type: string;
  status: string;
  applications: number;
  postedDate: string;
  description?: string;
  requirements?: string;
  salary?: string;
}

export interface Application {
  _id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  resume?: string;
  coverLetter?: string;
  status: string;
  appliedAt: string;
  userId?: string;
}

export interface AnalyticsData {
  totalJobs: number;
  totalApplications: number;
  applicationsByStatus: {
    new: number;
    underReview: number;
    interviewed: number;
    rejected: number;
  };
  jobPerformance: Array<{
    title: string;
    views: number;
    applications: number;
    status: string;
  }>;
  averageTimeToHire: string;
  applicationRate: string;
  offerAcceptanceRate: string;
}

export interface CreateJobData {
  title: string;
  company?: string;
  department?: string;
  location: string;
  type: string;
  workMode?: string;
  salary?: string;
  description: string;
  requirements?: string;
}

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axios.get('/api/hr/dashboard/stats');
  return response.data;
};

// Get recent activity
export const getRecentActivity = async (): Promise<Activity[]> => {
  const response = await axios.get('/api/hr/dashboard/activity');
  return response.data;
};

// Get all HR jobs
export const getHRJobs = async (): Promise<JobPosting[]> => {
  const response = await axios.get('/api/hr/jobs');
  return response.data;
};

// Create new job
export const createJob = async (jobData: CreateJobData): Promise<any> => {
  const response = await axios.post('/api/hr/jobs', jobData);
  return response.data;
};

// Update job
export const updateJob = async (jobId: string, jobData: Partial<CreateJobData>): Promise<any> => {
  const response = await axios.put(`/api/hr/jobs/${jobId}`, jobData);
  return response.data;
};

// Delete job
export const deleteJob = async (jobId: string): Promise<any> => {
  const response = await axios.delete(`/api/hr/jobs/${jobId}`);
  return response.data;
};

// Get all applications
export const getApplications = async (jobId?: string, status?: string): Promise<Application[]> => {
  const params: any = {};
  if (jobId) params.jobId = jobId;
  if (status) params.status = status;
  
  const response = await axios.get('/api/hr/applications', { params });
  return response.data;
};

// Update application status
export const updateApplicationStatus = async (
  jobId: string,
  applicationId: string,
  status: string
): Promise<any> => {
  const response = await axios.put(`/api/hr/applications/${jobId}/${applicationId}`, { status });
  return response.data;
};

// Get analytics data
export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await axios.get('/api/hr/analytics');
  return response.data;
};
