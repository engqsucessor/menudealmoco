/**
 * Menu Deal Moço Services - Main Export File
 * Central export point for all mock backend services
 */

// Import all services
import { restaurantService } from './restaurantService.js';
import { reviewService } from './reviewService.js';
import { submissionService } from './submissionService.js';
import { locationService } from './locationService.js';

// Import data
import { mockRestaurants } from './data/mockRestaurants.js';
import { mockReviews } from './data/mockReviews.js';

// Import utilities
import utils from './utils/index.js';

/**
 * Initialize all services and populate localStorage if needed
 */
export const initializeServices = () => {
  // Initialize localStorage with mock data if not already present
  if (!localStorage.getItem('menudealmoco_restaurants')) {
    localStorage.setItem('menudealmoco_restaurants', JSON.stringify(mockRestaurants));
  }

  if (!localStorage.getItem('menudealmoco_reviews')) {
    localStorage.setItem('menudealmoco_reviews', JSON.stringify(mockReviews));
  }

  // Initialize other storage keys
  const storageKeys = [
    'menudealmoco_user_reviews',
    'menudealmoco_submissions',
    'menudealmoco_pending_submissions',
    'menudealmoco_favorites',
    'menudealmoco_recent_searches',
    'menudealmoco_recent_locations'
  ];

  storageKeys.forEach(key => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify([]));
    }
  });

  console.log('Menu Deal Moço services initialized successfully');
};

/**
 * Clear all service data (useful for testing or reset)
 */
export const clearAllData = () => {
  const keys = Object.keys(localStorage).filter(key => key.startsWith('menudealmoco_'));
  keys.forEach(key => localStorage.removeItem(key));
  console.log('All Menu Deal Moço data cleared');
};

/**
 * Get service status and statistics
 */
export const getServiceStatus = () => {
  const restaurants = JSON.parse(localStorage.getItem('menudealmoco_restaurants') || '[]');
  const reviews = JSON.parse(localStorage.getItem('menudealmoco_reviews') || '[]');
  const userReviews = JSON.parse(localStorage.getItem('menudealmoco_user_reviews') || '[]');
  const submissions = JSON.parse(localStorage.getItem('menudealmoco_submissions') || '[]');
  const favorites = JSON.parse(localStorage.getItem('menudealmoco_favorites') || '[]');

  return {
    status: 'operational',
    version: '1.0.0',
    statistics: {
      totalRestaurants: restaurants.length,
      totalReviews: reviews.length + userReviews.length,
      totalSubmissions: submissions.length,
      totalFavorites: favorites.length,
      lastUpdated: new Date().toISOString()
    },
    services: {
      restaurantService: 'operational',
      reviewService: 'operational',
      submissionService: 'operational',
      locationService: 'operational'
    }
  };
};

// Named exports for individual services
export {
  restaurantService,
  reviewService,
  submissionService,
  locationService,
  utils
};

// Named exports for data
export {
  mockRestaurants,
  mockReviews
};

// Default export object with all services
export default {
  // Services
  restaurantService,
  reviewService,
  submissionService,
  locationService,

  // Data
  mockRestaurants,
  mockReviews,

  // Utilities
  utils,

  // Management functions
  initializeServices,
  clearAllData,
  getServiceStatus
};