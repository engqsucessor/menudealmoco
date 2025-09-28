const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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

    const queryString = params.toString();
    const endpoint = queryString ? `/restaurants?${queryString}` : '/restaurants';

    return await this.request(endpoint);
  }

  async getRestaurant(id) {
    return await this.request(`/restaurants/${id}`);
  }

  // ===== AUTHENTICATION =====
  async login(email, password) {
    return await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(name, email, password) {
    return await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async updateDisplayName(userEmail, newDisplayName) {
    return await this.request('/auth/update-display-name', {
      method: 'PUT',
      body: JSON.stringify({ displayName: newDisplayName }),
      headers: {
        'X-User-Email': userEmail
      }
    });
  }

  // ===== REVIEWS =====
  async getMenuReviews(restaurantId) {
    return await this.request(`/restaurants/${restaurantId}/reviews`);
  }

  async addMenuReview(restaurantId, userId, rating, comment, displayName) {
    return await this.request(`/restaurants/${restaurantId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
      headers: {
        'X-User-Email': userId,
        'X-Display-Name': displayName
      }
    });
  }

  async voteOnReview(reviewId, restaurantId, userId, voteType) {
    return await this.request(`/reviews/${reviewId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ vote_type: voteType }),
      headers: {
        'X-User-Email': userId
      }
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
}

// Create singleton instance
export const apiService = new ApiService();

// Export individual functions for backward compatibility
export const getRestaurants = (filters) => apiService.getRestaurants(filters);
export const getRestaurant = (id) => apiService.getRestaurant(id);

// Export the main service as mockBackend for compatibility
export { apiService as mockBackend };