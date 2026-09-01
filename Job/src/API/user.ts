import api from './axios';

export interface Education {
  id?: number;
  degree: string;
  institution: string;
  year: string;
  grade: string;
}

export interface Experience {
  id?: number;
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  github: string;
  linkedin: string;
  portfolio: string;
  skills: string[];
  educations: Education[];
  experiences: Experience[];
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  success: boolean;
  user: UserProfile;
  message?: string;
}

export interface StatsResponse {
  success: boolean;
  stats: {
    profileCompletion: number;
    totalSkills: number;
    totalEducation: number;
    totalExperience: number;
    memberSince: string;
    lastUpdated: string;
  };
}

const userAPI = {
  getProfile: (email: string) =>
    api.get<ProfileResponse>('/api/user/profile', { params: { email } }),

  updateProfile: (data: {
    email: string;
    name?: string;
    phone?: string;
    location?: string;
    bio?: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
    skills?: string[];
    educations?: Education[];
    experiences?: Experience[];
    profileImage?: string;
  }) => api.put<ProfileResponse>('/api/user/profile', data),

  getStats: (email: string) =>
    api.get<StatsResponse>('/api/user/stats', { params: { email } }),

  deleteAccount: (email: string, password: string) =>
    api.delete('/api/user/profile', { data: { email, password } }),
};

export default userAPI;
