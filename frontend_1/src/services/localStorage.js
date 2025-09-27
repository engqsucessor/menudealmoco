// Local storage utilities for Menu Deal Moço
// Handles persistent data storage in the browser

const STORAGE_KEYS = {
  SEARCH_HISTORY: 'menudealmoco_search_history',
  USER_PREFERENCES: 'menudealmoco_user_preferences',
  FAVORITE_RESTAURANTS: 'menudealmoco_favorites',
  RECENT_SEARCHES: 'menudealmoco_recent_searches',
  USER_REVIEWS: 'menudealmoco_user_reviews'
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

// Export storage keys for direct access if needed
export { STORAGE_KEYS };

// Export main storage utility
export default storage;