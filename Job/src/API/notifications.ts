import api from './axios';

export interface Notification {
  id: string;
  type: 'job_application' | 'new_job_match' | 'application_status' | 'system';
  title: string;
  message: string;
  jobId?: string;
  jobTitle?: string;
  company?: string;
  isRead: boolean;
  createdAt: string;
  timeAgo: string;
}

export interface NotificationsResponse {
  success: boolean;
  notifications: Notification[];
  unreadCount: number;
}

const notificationAPI = {
  getNotifications: (email?: string) => {
    const params = email ? { email } : {};
    return api.get<NotificationsResponse>('/api/notifications', { params });
  },

  markAsRead: (id: string) =>
    api.put(`/api/notifications/${id}/read`),

  markAllAsRead: (email?: string) => {
    const params = email ? { email } : {};
    return api.put('/api/notifications/read-all', {}, { params });
  },

  deleteNotification: (id: string) =>
    api.delete(`/api/notifications/${id}`),

  createNotification: (data: {
    userEmail: string;
    type: string;
    title: string;
    message: string;
    jobId?: string;
    jobTitle?: string;
    company?: string;
    sendEmail?: boolean;
  }) => api.post('/api/notifications/create', data),
};

export default notificationAPI;
