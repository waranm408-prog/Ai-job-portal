import api from './axios';

// Dashboard Statistics
export const getDashboardStats = async () => {
  const response = await api.get('/api/admin/dashboard');
  return response.data;
};

// User Management
export const getUsers = async (params?: { 
  page?: number; 
  limit?: number; 
  role?: string; 
  search?: string;
}) => {
  const response = await api.get('/api/admin/users', { params });
  return response.data;
};

export const updateUser = async (userId: string, data: {
  name?: string;
  email?: string;
  role?: string;
  is_admin?: boolean;
}) => {
  const response = await api.put(`/api/admin/users/${userId}`, data);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/api/admin/users/${userId}`);
  return response.data;
};

// Job Management
export const getAdminJobs = async (params?: { 
  page?: number; 
  limit?: number; 
  status?: string; 
  search?: string;
}) => {
  const response = await api.get('/api/admin/jobs', { params });
  return response.data;
};

export const deleteJob = async (jobId: string) => {
  const response = await api.delete(`/api/admin/jobs/${jobId}`);
  return response.data;
};

export const updateJobStatus = async (jobId: string, status: string) => {
  const response = await api.put(`/api/admin/jobs/${jobId}/status`, { status });
  return response.data;
};

// Activity Feed
export const getActivity = async (limit?: number) => {
  const response = await api.get('/api/admin/activity', { params: { limit } });
  return response.data;
};
