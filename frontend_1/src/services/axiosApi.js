import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds JWT token to every request
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

// Response interceptor - handles token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        sessionStorage.setItem('access_token', data.access_token);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        sessionStorage.clear();
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    sessionStorage.setItem('access_token', data.access_token);
    sessionStorage.setItem('refresh_token', data.refresh_token);
    return data.user;
  },

  signup: async (name, email, password) => {
    const { data } = await api.post('/auth/signup', { name, email, password });
    sessionStorage.setItem('access_token', data.access_token);
    sessionStorage.setItem('refresh_token', data.refresh_token);
    return data.user;
  },

  logout: () => {
    sessionStorage.clear();
  },

  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  updateDisplayName: async (displayName) => {
    const { data } = await api.put('/auth/update-display-name', { displayName });
    return data;
  },
};

// Restaurants API
export const restaurantsApi = {
  getAll: async (filters = {}) => {
    const { data } = await api.get('/restaurants', { params: filters });
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/restaurants/${id}`);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/restaurants/${id}`);
    return data;
  },

  submit: async (restaurantData) => {
    const { data } = await api.post('/restaurants/submit', restaurantData);
    return data;
  },

  getSubmissions: async (status = 'all') => {
    const params = status !== 'all' ? { status } : {};
    const { data } = await api.get('/restaurants/submissions', { params });
    return data;
  },

  reviewSubmission: async (submissionId, action, comment) => {
    const { data } = await api.post(`/restaurants/submissions/${submissionId}/review`, {
      action,
      comment,
    });
    return data;
  },
};

// Reviews API
export const reviewsApi = {
  getForRestaurant: async (restaurantId) => {
    const { data } = await api.get(`/restaurants/${restaurantId}/reviews`);
    return data;
  },

  add: async (restaurantId, rating, comment) => {
    const { data } = await api.post(`/restaurants/${restaurantId}/reviews`, {
      rating,
      comment,
    });
    return data;
  },

  vote: async (reviewId, voteType) => {
    const { data } = await api.post(`/reviews/${reviewId}/vote`, {
      vote_type: voteType,
    });
    return data;
  },
};

// Edit Suggestions API
export const editSuggestionsApi = {
  submit: async (restaurantId, changes, reason = '') => {
    const { data } = await api.post(`/restaurants/${restaurantId}/edit-suggestions`, {
      changes,
      reason,
    });
    return data;
  },

  getForRestaurant: async (restaurantId, status = 'all') => {
    const params = status !== 'all' ? { status } : {};
    const { data } = await api.get(`/restaurants/${restaurantId}/edit-suggestions`, { params });
    return data;
  },

  vote: async (suggestionId, voteType) => {
    const { data } = await api.post(`/edit-suggestions/${suggestionId}/vote`, {
      vote_type: voteType,
    });
    return data;
  },

  approve: async (suggestionId) => {
    const { data } = await api.post(`/edit-suggestions/${suggestionId}/approve`);
    return data;
  },

  reject: async (suggestionId, reason = '') => {
    const { data } = await api.post(`/edit-suggestions/${suggestionId}/reject`, { reason });
    return data;
  },

  getAll: async (status = 'all') => {
    const params = status !== 'all' ? { status } : {};
    const { data } = await api.get('/edit-suggestions/all', { params });
    return data;
  },
};

// Reports API
export const reportsApi = {
  reportReview: async (reviewId, restaurantId, reason) => {
    const { data } = await api.post('/reports/reviews', {
      review_id: reviewId,
      restaurant_id: restaurantId,
      reason,
    });
    return data;
  },

  getReportedReviews: async () => {
    const { data } = await api.get('/reports/reviews');
    return data;
  },

  resolveReport: async (reportId, action) => {
    const { data } = await api.post(`/reports/${reportId}/resolve`, { action });
    return data;
  },
};

export default api;