// Local storage utilities for Menu Deal Moço
// Handles persistent data storage in the browser

const STORAGE_KEYS = {
  SEARCH_HISTORY: 'menudealmoco_search_history',
  USER_PREFERENCES: 'menudealmoco_user_preferences',
  FAVORITE_RESTAURANTS: 'menudealmoco_favorites',
  RECENT_SEARCHES: 'menudealmoco_recent_searches',
  USER_REVIEWS: 'menudealmoco_user_reviews',
  // Dynamic keys for restaurant voting
  LOCAL_VOTES: (restaurantId) => `mmd_local_votes_${restaurantId}`,
  USER_VOTES: (email, restaurantId) => `mmd_user_votes_${email}_${restaurantId}`
};

// Generic storage utilities
const storage = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Search history management
export const searchHistory = {
  get() {
    return storage.get(STORAGE_KEYS.SEARCH_HISTORY) || [];
  },

  add(searchQuery) {
    const history = this.get();
    const newSearch = {
      query: searchQuery,
      timestamp: Date.now()
    };

    // Remove duplicate if exists
    const filtered = history.filter(item =>
      item.query.location !== searchQuery.location ||
      JSON.stringify(item.query.filters) !== JSON.stringify(searchQuery.filters)
    );

    // Add to beginning and limit to 10 items
    const updated = [newSearch, ...filtered].slice(0, 10);

    return storage.set(STORAGE_KEYS.SEARCH_HISTORY, updated);
  },

  clear() {
    return storage.remove(STORAGE_KEYS.SEARCH_HISTORY);
  }
};

// User preferences management
export const userPreferences = {
  get() {
    return storage.get(STORAGE_KEYS.USER_PREFERENCES) || {
      defaultLocation: '',
      preferredPriceRange: 'all',
      preferredFoodType: 'all',
      sortPreference: 'rating',
      enableNotifications: false,
      language: 'pt'
    };
  },

  set(preferences) {
    const current = this.get();
    const updated = { ...current, ...preferences };
    return storage.set(STORAGE_KEYS.USER_PREFERENCES, updated);
  },

  update(key, value) {
    const preferences = this.get();
    preferences[key] = value;
    return this.set(preferences);
  },

  reset() {
    return storage.remove(STORAGE_KEYS.USER_PREFERENCES);
  }
};

// Favorite restaurants management
export const favoriteRestaurants = {
  get() {
    return storage.get(STORAGE_KEYS.FAVORITE_RESTAURANTS) || [];
  },

  getAll() {
    // Alias for get() for consistency
    return this.get();
  },

  add(restaurantId) {
    const favorites = this.get();
    if (!favorites.includes(restaurantId)) {
      favorites.push(restaurantId);
      return storage.set(STORAGE_KEYS.FAVORITE_RESTAURANTS, favorites);
    }
    return true;
  },

  remove(restaurantId) {
    const favorites = this.get();
    const updated = favorites.filter(id => id !== restaurantId);
    return storage.set(STORAGE_KEYS.FAVORITE_RESTAURANTS, updated);
  },

  toggle(restaurantId) {
    const favorites = this.get();
    if (favorites.includes(restaurantId)) {
      this.remove(restaurantId);
      return false; // Now it's not a favorite
    } else {
      this.add(restaurantId);
      return true; // Now it is a favorite
    }
  },

  isFavorite(restaurantId) {
    const favorites = this.get();
    return favorites.includes(restaurantId);
  },

  clear() {
    return storage.remove(STORAGE_KEYS.FAVORITE_RESTAURANTS);
  }
};

// Recent searches for quick access
export const recentSearches = {
  get() {
    return storage.get(STORAGE_KEYS.RECENT_SEARCHES) || [];
  },

  add(location) {
    if (!location) return false;

    const recents = this.get();

    // Remove if already exists
    const filtered = recents.filter(item => item.location !== location);

    // Add to beginning and limit to 5 items
    const updated = [
      { location, timestamp: Date.now() },
      ...filtered
    ].slice(0, 5);

    return storage.set(STORAGE_KEYS.RECENT_SEARCHES, updated);
  },

  clear() {
    return storage.remove(STORAGE_KEYS.RECENT_SEARCHES);
  }
};

// User reviews management (for demo purposes)
export const userReviews = {
  get() {
    return storage.get(STORAGE_KEYS.USER_REVIEWS) || [];
  },

  add(review) {
    const reviews = this.get();
    const newReview = {
      ...review,
      id: Date.now(),
      timestamp: Date.now()
    };

    reviews.push(newReview);
    return storage.set(STORAGE_KEYS.USER_REVIEWS, reviews);
  },

  getByRestaurant(restaurantId) {
    const reviews = this.get();
    return reviews.filter(review => review.restaurantId === restaurantId);
  },

  update(reviewId, updates) {
    const reviews = this.get();
    const index = reviews.findIndex(review => review.id === reviewId);

    if (index !== -1) {
      reviews[index] = { ...reviews[index], ...updates };
      return storage.set(STORAGE_KEYS.USER_REVIEWS, reviews);
    }

    return false;
  },

  remove(reviewId) {
    const reviews = this.get();
    const updated = reviews.filter(review => review.id !== reviewId);
    return storage.set(STORAGE_KEYS.USER_REVIEWS, updated);
  },

  clear() {
    return storage.remove(STORAGE_KEYS.USER_REVIEWS);
  }
};

/**
 * Restaurant voting management
 * Handles local votes (for offline support) and user vote history
 */
export const restaurantVotes = {
  /**
   * Get local votes for a specific restaurant
   * Local votes are used to track pending votes when offline or for immediate UI updates
   * @param {string} restaurantId - The restaurant ID
   * @returns {Object} Object mapping review IDs to vote deltas {upvotes, downvotes}
   */
  getLocalVotes(restaurantId) {
    const key = STORAGE_KEYS.LOCAL_VOTES(restaurantId);
    return storage.get(key) || {};
  },

  /**
   * Save local votes for a specific restaurant
   * @param {string} restaurantId - The restaurant ID
   * @param {Object} votes - Object mapping review IDs to vote deltas
   * @returns {boolean} Success status
   */
  saveLocalVotes(restaurantId, votes) {
    const key = STORAGE_KEYS.LOCAL_VOTES(restaurantId);
    return storage.set(key, votes);
  },

  /**
   * Update local votes for a specific review
   * @param {string} restaurantId - The restaurant ID
   * @param {string} reviewId - The review ID
   * @param {number} upvoteDelta - Change in upvotes (+1, -1, or 0)
   * @param {number} downvoteDelta - Change in downvotes (+1, -1, or 0)
   * @returns {boolean} Success status
   */
  updateLocalVote(restaurantId, reviewId, upvoteDelta, downvoteDelta) {
    const currentVotes = this.getLocalVotes(restaurantId);

    if (!currentVotes[reviewId]) {
      currentVotes[reviewId] = { upvotes: 0, downvotes: 0 };
    }

    currentVotes[reviewId].upvotes += upvoteDelta;
    currentVotes[reviewId].downvotes += downvoteDelta;

    // Remove entry if both are 0
    if (currentVotes[reviewId].upvotes === 0 && currentVotes[reviewId].downvotes === 0) {
      delete currentVotes[reviewId];
    }

    return this.saveLocalVotes(restaurantId, currentVotes);
  },

  /**
   * Clear local votes for a specific restaurant
   * @param {string} restaurantId - The restaurant ID
   * @returns {boolean} Success status
   */
  clearLocalVotes(restaurantId) {
    const key = STORAGE_KEYS.LOCAL_VOTES(restaurantId);
    return storage.remove(key);
  },

  /**
   * Get user's vote history for a specific restaurant
   * Tracks which reviews the user has voted on and how they voted
   * @param {string} email - User's email
   * @param {string} restaurantId - The restaurant ID
   * @returns {Object} Object mapping review IDs to vote types ('up', 'down', or null)
   */
  getUserVoteHistory(email, restaurantId) {
    if (!email) return {};
    const key = STORAGE_KEYS.USER_VOTES(email, restaurantId);
    return storage.get(key) || {};
  },

  /**
   * Save user's vote history for a specific restaurant
   * @param {string} email - User's email
   * @param {string} restaurantId - The restaurant ID
   * @param {Object} votes - Object mapping review IDs to vote types
   * @returns {boolean} Success status
   */
  saveUserVoteHistory(email, restaurantId, votes) {
    if (!email) return false;
    const key = STORAGE_KEYS.USER_VOTES(email, restaurantId);
    return storage.set(key, votes);
  },

  /**
   * Update a single vote in user's vote history
   * @param {string} email - User's email
   * @param {string} restaurantId - The restaurant ID
   * @param {string} reviewId - The review ID
   * @param {string|null} voteType - Vote type ('up', 'down', or null to remove)
   * @returns {boolean} Success status
   */
  updateUserVote(email, restaurantId, reviewId, voteType) {
    if (!email) return false;

    const currentVotes = this.getUserVoteHistory(email, restaurantId);

    if (voteType) {
      currentVotes[reviewId] = voteType;
    } else {
      delete currentVotes[reviewId];
    }

    return this.saveUserVoteHistory(email, restaurantId, currentVotes);
  },

  /**
   * Clear user's vote history for a specific restaurant
   * @param {string} email - User's email
   * @param {string} restaurantId - The restaurant ID
   * @returns {boolean} Success status
   */
  clearUserVoteHistory(email, restaurantId) {
    if (!email) return false;
    const key = STORAGE_KEYS.USER_VOTES(email, restaurantId);
    return storage.remove(key);
  }
};

// Export storage keys for direct access if needed
export { STORAGE_KEYS };

// Export main storage utility
export default storage;