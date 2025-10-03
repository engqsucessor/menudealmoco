import axios from 'axios';
import { API_BASE_URL } from '../constants/apiConfig';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds JWT token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const reviewerApplicationsApi = {
  // Apply to become a reviewer
  apply: async (motivation, experience = '') => {
    const { data } = await api.post('/reviewer-applications', {
      motivation,
      experience,
    });
    return data;
  },

  // Get my application status
  getMyApplication: async () => {
    try {
      const { data } = await api.get('/reviewer-applications/my');
      return data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // No application found
      }
      throw error;
    }
  },

  // Get all applications (admin only)
  getAllApplications: async (status = 'all') => {
    const { data } = await api.get('/reviewer-applications', {
      params: { status_filter: status },
    });
    return data;
  },

  // Review an application (admin only)
  reviewApplication: async (applicationId, status, adminNotes = '') => {
    const { data } = await api.post(`/reviewer-applications/${applicationId}/review`, {
      status,
      adminNotes,
    });
    return data;
  },

  // Get application statistics (admin only)
  getStats: async () => {
    const { data } = await api.get('/reviewer-applications/stats');
    return data;
  },
};
