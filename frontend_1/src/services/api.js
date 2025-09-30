const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  constructor() {
    this.token = null;
    this.refreshToken = null;
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  setTokens(accessToken, refreshToken) {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    if (accessToken) {
      sessionStorage.setItem('access_token', accessToken);
    } else {
      sessionStorage.removeItem('access_token');
    }
    if (refreshToken) {
      sessionStorage.setItem('refresh_token', refreshToken);
    } else {
      sessionStorage.removeItem('refresh_token');
    }
  }

  getToken() {
    if (!this.token) {
      this.token = sessionStorage.getItem('access_token');
    }
    return this.token;
  }

  getRefreshToken() {
    if (!this.refreshToken) {
      this.refreshToken = sessionStorage.getItem('refresh_token');
    }
    return this.refreshToken;
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  }

  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      this.clearTokens();
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    this.setTokens(data.access_token, refreshToken);
    return data.access_token;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    // Debug logging
    if (endpoint.includes('edit-suggestions') && options.method === 'POST') {
      console.log('🔐 Edit suggestion request - Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    }

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      let response = await fetch(url, config);

      // Handle 401 (unauthorized) - try to refresh token
      if (response.status === 401 && token && !endpoint.includes('/auth/')) {
        try {
          const newToken = await this.refreshAccessToken();
          // Retry with new token
          config.headers.Authorization = `Bearer ${newToken}`;
          response = await fetch(url, config);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          this.clearTokens();
          window.location.href = '/auth';
          throw new Error('Session expired. Please login again.');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ===== RESTAURANTS =====
  async getRestaurants(filters = {}) {
    const params = new URLSearchParams();

    if (filters.query) params.append('query', filters.query);
    if (filters.location) params.append('location', filters.location);
    if (filters.foodTypes && filters.foodTypes.length > 0) {
      params.append('foodTypes', filters.foodTypes.join(','));
    }
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    const endpoint = queryString ? `/restaurants?${queryString}` : '/restaurants';

    return await this.request(endpoint);
  }

  async getRestaurant(id) {
    return await this.request(`/restaurants/${id}`);
  }

  async deleteRestaurant(id, userEmail) {
    return await this.request(`/restaurants/${id}`, {
      method: 'DELETE',
      headers: {
        'X-User-Email': userEmail
      }
    });
  }

  // ===== AUTHENTICATION =====
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // JWT response format: { access_token, refresh_token, user }
    if (response.access_token && response.refresh_token && response.user) {
      this.setTokens(response.access_token, response.refresh_token);
      return response.user;
    } else {
      throw new Error('Invalid login response format');
    }
  }

  async signup(name, email, password) {
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    // JWT response format: { access_token, refresh_token, user }
    if (response.access_token && response.refresh_token && response.user) {
      this.setTokens(response.access_token, response.refresh_token);
      return response.user;
    } else {
      throw new Error('Invalid signup response format');
    }
  }

  async logout() {
    this.clearTokens();
    // Optionally call backend logout endpoint if it exists
  }

  async updateDisplayName(newDisplayName) {
    return await this.request('/auth/update-display-name', {
      method: 'PUT',
      body: JSON.stringify({ displayName: newDisplayName }),
    });
  }

  // ===== REVIEWS =====
  async getMenuReviews(restaurantId) {
    return await this.request(`/restaurants/${restaurantId}/reviews`);
  }

  async addMenuReview(restaurantId, rating, comment) {
    return await this.request(`/restaurants/${restaurantId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  }

  async voteOnReview(reviewId, restaurantId, userEmail, voteType) {
    return await this.request(`/reviews/${reviewId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ vote_type: voteType }),
    });
  }

  // ===== REPORTS =====
  async reportReview(reviewId, restaurantId, reporterId, reason) {
    return await this.request('/reports/reviews', {
      method: 'POST',
      body: JSON.stringify({ 
        review_id: reviewId,
        restaurant_id: restaurantId,
        reason: reason 
      }),
      headers: {
        'X-User-Email': reporterId
      }
    });
  }

  async getReportedReviews() {
    return await this.request('/reports/reviews');
  }

  async resolveReport(reportId, reviewerId, action) {
    return await this.request(`/reports/${reportId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ action }),
      headers: {
        'X-User-Email': reviewerId
      }
    });
  }

  // ===== RESTAURANT SUBMISSIONS =====
  async submitRestaurant(data, userEmail) {
    return await this.request('/restaurants/submit', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'X-User-Email': userEmail
      }
    });
  }

  async getSubmissions(status = 'all') {
    const params = status !== 'all' ? `?status=${status}` : '';
    return await this.request(`/restaurants/submissions${params}`);
  }

  async reviewSubmission(submissionId, action, comment, reviewerEmail) {
    return await this.request(`/restaurants/submissions/${submissionId}/review`, {
      method: 'POST',
      body: JSON.stringify({ action, comment }),
      headers: {
        'X-User-Email': reviewerEmail
      }
    });
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Export individual functions for backward compatibility
export const getRestaurants = (filters) => apiService.getRestaurants(filters);
export const getRestaurant = (id) => apiService.getRestaurant(id);

// Export the main service as mockBackend for compatibility
export { apiService as mockBackend };