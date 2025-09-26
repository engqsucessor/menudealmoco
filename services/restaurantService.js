/**
 * Restaurant Service - Mock Backend API for Menu Deal Moço
 * Simulates restaurant search, filtering, and details functionality
 */

import { mockRestaurants } from './data/mockRestaurants.js';

// Simulate network delay
const simulateDelay = (min = 300, max = 1000) => {
  return new Promise(resolve =>
    setTimeout(resolve, Math.random() * (max - min) + min)
  );
};

// Simulate random API failures (disabled for testing)
const simulateFailure = () => {
  // Disabled for testing
  // if (Math.random() < 0.05) {
  //   throw new Error('Network error: Failed to fetch restaurants');
  // }
};

// Local storage keys
const STORAGE_KEYS = {
  RESTAURANTS: 'menudealmoco_restaurants',
  FAVORITES: 'menudealmoco_favorites',
  RECENT_SEARCHES: 'menudealmoco_recent_searches'
};

// Initialize local storage with mock data
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.RESTAURANTS)) {
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(mockRestaurants));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES)) {
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify([]));
  }
};

// Get restaurants from storage
const getRestaurantsFromStorage = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESTAURANTS) || '[]');
};

// Save restaurants to storage
const saveRestaurantsToStorage = (restaurants) => {
  localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
};

// Distance calculation (Haversine formula)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Check if restaurant is currently open
const isRestaurantOpen = (restaurant) => {
  const now = new Date();
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const todayHours = restaurant.businessHours[getDayOfWeek(now.getDay())];

  if (!todayHours || todayHours === 'closed') {
    return false;
  }

  // Parse hours like "12:00-15:00,19:00-22:30"
  const timeSlots = todayHours.split(',');
  return timeSlots.some(slot => {
    const [start, end] = slot.split('-');
    const startTime = parseInt(start.replace(':', ''));
    const endTime = parseInt(end.replace(':', ''));
    return currentTime >= startTime && currentTime <= endTime;
  });
};

// Get day of week string
const getDayOfWeek = (dayIndex) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[dayIndex];
};

// Save search to recent searches
const saveRecentSearch = (searchParams) => {
  const recentSearches = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES) || '[]');
  const searchString = JSON.stringify(searchParams);

  // Remove if already exists and add to front
  const filtered = recentSearches.filter(search => JSON.stringify(search) !== searchString);
  filtered.unshift(searchParams);

  // Keep only last 10 searches
  const trimmed = filtered.slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(trimmed));
};

/**
 * Restaurant Service API
 */
export const restaurantService = {
  /**
   * Search restaurants with filters
   * @param {Object} searchParams - Search and filter parameters
   * @returns {Promise<Object>} Search results with restaurants and metadata
   */
  async searchRestaurants(searchParams = {}) {
    await simulateDelay();
    simulateFailure();

    const {
      query = '',
      location = null,
      userLocation = null,
      maxDistance = 50, // km
      priceRange = 'any',
      minPrice = 6,
      maxPrice = 25,
      foodTypes = [],
      features = {},
      practicalFilters = {},
      sortBy = 'rating', // rating, price, distance, name
      sortOrder = 'desc', // asc, desc
      page = 1,
      limit = 20,
      openNow = false,
      minRating = 0,
      minGoogleRating = '',
      minZomatoRating = '',
      hasMenuReviews = false,
      lastUpdatedDays = ''
    } = searchParams;

    let restaurants = getRestaurantsFromStorage();

    // Save search parameters
    saveRecentSearch(searchParams);

    // Filter by search query (name, description, address)
    if (query) {
      const searchLower = query.toLowerCase();
      restaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchLower) ||
        restaurant.description.toLowerCase().includes(searchLower) ||
        restaurant.address.toLowerCase().includes(searchLower) ||
        restaurant.district.toLowerCase().includes(searchLower) ||
        restaurant.city.toLowerCase().includes(searchLower)
      );
    }

    // Filter by location (city or specific coordinates)
    if (location) {
      if (typeof location === 'string') {
        const locationLower = location.toLowerCase();
        restaurants = restaurants.filter(restaurant =>
          restaurant.city.toLowerCase().includes(locationLower) ||
          restaurant.district.toLowerCase().includes(locationLower) ||
          restaurant.address.toLowerCase().includes(locationLower)
        );
      }
    }

    // Filter by distance if user location is provided
    if (userLocation && userLocation.lat && userLocation.lng) {
      restaurants = restaurants.map(restaurant => ({
        ...restaurant,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          restaurant.coordinates.lat,
          restaurant.coordinates.lng
        )
      })).filter(restaurant => restaurant.distance <= maxDistance);
    }

    // Filter by price range using new radio button system
    if (priceRange && priceRange !== 'any') {
      restaurants = restaurants.filter(restaurant => {
        switch (priceRange) {
          case 'budget': return restaurant.menuPrice >= 6 && restaurant.menuPrice <= 8;
          case 'standard': return restaurant.menuPrice > 8 && restaurant.menuPrice <= 10;
          case 'good': return restaurant.menuPrice > 10 && restaurant.menuPrice <= 12;
          case 'premium': return restaurant.menuPrice > 12 && restaurant.menuPrice <= 15;
          case 'high-end': return restaurant.menuPrice > 15;
          default: return true;
        }
      });
    } else {
      // Fallback to minPrice/maxPrice if no priceRange is set
      restaurants = restaurants.filter(restaurant =>
        restaurant.menuPrice >= minPrice && restaurant.menuPrice <= maxPrice
      );
    }

    // Filter by food types
    if (foodTypes.length > 0) {
      restaurants = restaurants.filter(restaurant =>
        foodTypes.includes(restaurant.foodType)
      );
    }

    // Filter by unified average rating (new rating slider)
    if (minRating > 0) {
      restaurants = restaurants.filter(restaurant => {
        const googleRating = restaurant.googleRating || 0;
        const zomatoRating = restaurant.zomatoRating || 0;
        const overallRating = restaurant.overallRating || 0;

        // Calculate average rating, handling cases where some sources are missing
        let averageRating;
        if (googleRating > 0 && zomatoRating > 0) {
          // Both Google and Zomato ratings available - use average
          averageRating = (googleRating + zomatoRating) / 2;
        } else if (googleRating > 0) {
          // Only Google rating available
          averageRating = googleRating;
        } else if (zomatoRating > 0) {
          // Only Zomato rating available
          averageRating = zomatoRating;
        } else if (overallRating > 0) {
          // Fall back to overall rating if individual ratings not available
          averageRating = overallRating;
        } else {
          // No ratings available - exclude from results when filtering
          return false;
        }

        return averageRating >= minRating;
      });
    }

    // Filter by Google rating (backward compatibility)
    if (minGoogleRating && minGoogleRating !== '') {
      const minGoogleRatingFloat = parseFloat(minGoogleRating);
      restaurants = restaurants.filter(restaurant => {
        const googleRating = restaurant.googleRating || restaurant.overallRating || 0;
        return googleRating >= minGoogleRatingFloat;
      });
    }

    // Filter by Zomato rating (backward compatibility)
    if (minZomatoRating && minZomatoRating !== '') {
      const minZomatoRatingFloat = parseFloat(minZomatoRating);
      restaurants = restaurants.filter(restaurant => {
        const zomatoRating = restaurant.zomatoRating || restaurant.overallRating || 0;
        return zomatoRating >= minZomatoRatingFloat;
      });
    }

    // Filter by data freshness (last updated days)
    if (lastUpdatedDays && lastUpdatedDays !== '') {
      const daysAgo = parseInt(lastUpdatedDays);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      
      restaurants = restaurants.filter(restaurant => {
        const lastUpdated = new Date(restaurant.lastUpdated);
        return lastUpdated >= cutoffDate;
      });
    }

    // Filter by menu reviews
    if (hasMenuReviews) {
      restaurants = restaurants.filter(restaurant =>
        restaurant.totalReviews > 0
      );
    }

    // Filter by features (what's included)
    if (features.coffeeIncluded !== undefined) {
      restaurants = restaurants.filter(restaurant =>
        restaurant.features.coffeeIncluded === features.coffeeIncluded
      );
    }
    if (features.dessertIncluded !== undefined) {
      restaurants = restaurants.filter(restaurant =>
        restaurant.features.dessertIncluded === features.dessertIncluded
      );
    }
    if (features.wineAvailable !== undefined) {
      restaurants = restaurants.filter(restaurant =>
        restaurant.features.wineAvailable === features.wineAvailable
      );
    }
    if (features.breadSoupIncluded !== undefined) {
      restaurants = restaurants.filter(restaurant =>
        restaurant.features.breadSoupIncluded === features.breadSoupIncluded
      );
    }
    if (features.vegetarianOptions !== undefined) {
      restaurants = restaurants.filter(restaurant =>
        restaurant.features.vegetarianOptions === features.vegetarianOptions
      );
    }

    // Filter by practical filters
    if (practicalFilters.takesCards !== undefined) {
      restaurants = restaurants.filter(restaurant =>
        restaurant.practicalInfo.takesCards === practicalFilters.takesCards
      );
    }
    if (practicalFilters.hasParking !== undefined) {
      restaurants = restaurants.filter(restaurant =>
        restaurant.practicalInfo.hasParking === practicalFilters.hasParking
      );
    }
    if (practicalFilters.quickService !== undefined) {
      restaurants = restaurants.filter(restaurant =>
        restaurant.practicalInfo.quickService === practicalFilters.quickService
      );
    }
    if (practicalFilters.groupFriendly !== undefined) {
      restaurants = restaurants.filter(restaurant =>
        restaurant.practicalInfo.groupFriendly === practicalFilters.groupFriendly
      );
    }
    if (practicalFilters.nearMetro !== undefined) {
      restaurants = restaurants.filter(restaurant =>
        restaurant.practicalInfo.nearMetro === practicalFilters.nearMetro
      );
    }

    // Filter by open now
    if (openNow) {
      restaurants = restaurants.filter(restaurant => isRestaurantOpen(restaurant));
    }

    // Add computed fields
    restaurants = restaurants.map(restaurant => ({
      ...restaurant,
      isOpenNow: isRestaurantOpen(restaurant),
      priceCategory: getPriceCategory(restaurant.menuPrice),
      averageRating: calculateAverageRating(restaurant)
    }));

    // Sort results
    restaurants.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'rating':
          comparison = a.overallRating - b.overallRating;
          break;
        case 'price':
          comparison = a.menuPrice - b.menuPrice;
          break;
        case 'distance':
          comparison = (a.distance || 0) - (b.distance || 0);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = a.overallRating - b.overallRating;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Pagination
    const total = restaurants.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRestaurants = restaurants.slice(startIndex, endIndex);

    return {
      restaurants: paginatedRestaurants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: endIndex < total,
        hasPrev: page > 1
      },
      filters: {
        applied: {
          query,
          location,
          priceRange,
          minPrice,
          maxPrice,
          foodTypes,
          features,
          practicalFilters,
          openNow,
          minRating,
          minGoogleRating,
          minZomatoRating,
          hasMenuReviews,
          lastUpdatedDays
        },
        available: {
          priceRanges: ['any', 'budget', 'standard', 'good', 'premium', 'high-end'],
          foodTypes: [...new Set(getRestaurantsFromStorage().map(r => r.foodType))],
          cities: [...new Set(getRestaurantsFromStorage().map(r => r.city))]
        }
      }
    };
  },

  /**
   * Get restaurant details by ID
   * @param {string} restaurantId - Restaurant ID
   * @returns {Promise<Object>} Restaurant details
   */
  async getRestaurantById(restaurantId) {
    await simulateDelay();
    simulateFailure();

    const restaurants = getRestaurantsFromStorage();
    const restaurant = restaurants.find(r => r.id === restaurantId);

    if (!restaurant) {
      throw new Error(`Restaurant with ID ${restaurantId} not found`);
    }

    return {
      ...restaurant,
      isOpenNow: isRestaurantOpen(restaurant),
      priceCategory: getPriceCategory(restaurant.menuPrice),
      similarRestaurants: await this.getSimilarRestaurants(restaurantId)
    };
  },

  /**
   * Get similar restaurants
   * @param {string} restaurantId - Reference restaurant ID
   * @param {number} limit - Number of similar restaurants to return
   * @returns {Promise<Array>} Similar restaurants
   */
  async getSimilarRestaurants(restaurantId, limit = 4) {
    await simulateDelay(100, 300);

    const restaurants = getRestaurantsFromStorage();
    const restaurant = restaurants.find(r => r.id === restaurantId);

    if (!restaurant) {
      return [];
    }

    // Find similar restaurants based on food type, price range, and city
    const similar = restaurants
      .filter(r => r.id !== restaurantId)
      .map(r => ({
        ...r,
        similarity: calculateSimilarity(restaurant, r)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return similar;
  },

  /**
   * Get featured/popular restaurants
   * @param {number} limit - Number of restaurants to return
   * @returns {Promise<Array>} Featured restaurants
   */
  async getFeaturedRestaurants(limit = 6) {
    await simulateDelay();
    simulateFailure();

    const restaurants = getRestaurantsFromStorage();

    // Get highly rated restaurants with many reviews
    const featured = restaurants
      .filter(r => r.overallRating >= 4.0 && r.totalReviews >= 50)
      .sort((a, b) => (b.overallRating * b.totalReviews) - (a.overallRating * a.totalReviews))
      .slice(0, limit);

    return featured.map(restaurant => ({
      ...restaurant,
      isOpenNow: isRestaurantOpen(restaurant),
      priceCategory: getPriceCategory(restaurant.menuPrice)
    }));
  },

  /**
   * Get recent searches
   * @returns {Promise<Array>} Recent search parameters
   */
  async getRecentSearches() {
    await simulateDelay(50, 200);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES) || '[]');
  },

  /**
   * Get user favorites
   * @returns {Promise<Array>} Favorite restaurant IDs
   */
  async getFavorites() {
    await simulateDelay(100, 300);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
  },

  /**
   * Add restaurant to favorites
   * @param {string} restaurantId - Restaurant ID
   * @returns {Promise<boolean>} Success status
   */
  async addToFavorites(restaurantId) {
    await simulateDelay(200, 400);
    simulateFailure();

    const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    if (!favorites.includes(restaurantId)) {
      favorites.push(restaurantId);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
    return true;
  },

  /**
   * Remove restaurant from favorites
   * @param {string} restaurantId - Restaurant ID
   * @returns {Promise<boolean>} Success status
   */
  async removeFromFavorites(restaurantId) {
    await simulateDelay(200, 400);
    simulateFailure();

    const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    const filtered = favorites.filter(id => id !== restaurantId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
    return true;
  },

  /**
   * Get restaurants by IDs (for favorites)
   * @param {Array<string>} restaurantIds - Array of restaurant IDs
   * @returns {Promise<Array>} Restaurants
   */
  async getRestaurantsByIds(restaurantIds) {
    await simulateDelay();

    const restaurants = getRestaurantsFromStorage();
    const found = restaurants.filter(r => restaurantIds.includes(r.id));

    return found.map(restaurant => ({
      ...restaurant,
      isOpenNow: isRestaurantOpen(restaurant),
      priceCategory: getPriceCategory(restaurant.menuPrice)
    }));
  }
};

// Helper functions
const getPriceCategory = (price) => {
  if (price <= 8) return 'budget';
  if (price <= 10) return 'standard';
  if (price <= 12) return 'good';
  if (price <= 15) return 'premium';
  return 'high-end';
};

const calculateSimilarity = (restaurant1, restaurant2) => {
  let score = 0;

  // Same food type = +3 points
  if (restaurant1.foodType === restaurant2.foodType) score += 3;

  // Similar price range = +2 points
  const priceDiff = Math.abs(restaurant1.menuPrice - restaurant2.menuPrice);
  if (priceDiff <= 2) score += 2;
  else if (priceDiff <= 4) score += 1;

  // Same city = +2 points
  if (restaurant1.city === restaurant2.city) score += 2;

  // Similar rating = +1 point
  const ratingDiff = Math.abs(restaurant1.overallRating - restaurant2.overallRating);
  if (ratingDiff <= 0.5) score += 1;

  return score;
};

// Calculate average rating from Google and Zomato ratings
const calculateAverageRating = (restaurant) => {
  const googleRating = restaurant.googleRating || 0;
  const zomatoRating = restaurant.zomatoRating || 0;
  const overallRating = restaurant.overallRating || 0;

  if (googleRating > 0 && zomatoRating > 0) {
    // Both Google and Zomato ratings available - use average
    return Math.round(((googleRating + zomatoRating) / 2) * 10) / 10;
  } else if (googleRating > 0) {
    // Only Google rating available
    return googleRating;
  } else if (zomatoRating > 0) {
    // Only Zomato rating available
    return zomatoRating;
  } else {
    // Fall back to overall rating
    return overallRating;
  }
};

// Named export already defined above