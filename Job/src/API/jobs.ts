import api from './axios';

export interface Job {
  _id: string;
  id?: string; // For backward compatibility
  title: string;
  company: string;
  department?: string;
  location: string;
  salary?: string;
  type: string;
  workMode?: string;
  description: string;
  requirements?: string;
  status: string;
  applications: number;
  views: number;
  createdAt: string;
}

export interface JobSearchResponse {
  success: boolean;
  jobs: Job[];
  message?: string;
}

export interface JobDetailResponse {
  success: boolean;
  job: Job;
}

const jobAPI = {
  // Get all jobs (with optional filters)
  searchJobs: (params?: { query?: string; location?: string; type?: string }) =>
    api.get<JobSearchResponse>('/api/jobs', {
      params: {
        search: params?.query || '',
        location: params?.location || '',
        type: params?.type || '',
      },
    }),

  // Get specific job
  getJob: (id: string) => api.get<JobDetailResponse>(`/api/jobs/${id}`),

  // Apply for job (with file upload)
  applyJob: (_jobId: string, formData: FormData) => 
    api.post(`/api/jobs/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export default jobAPI;
