// filterConfig.js - Centralized filter configuration and defaults

// Price range configurations
export const PRICE_RANGES = {
  'budget': { min: 6, max: 8, label: 'Budget (€6-8)' },
  'standard': { min: 8, max: 10, label: 'Standard (€8-10)' },
  'good': { min: 10, max: 12, label: 'Good (€10-12)' },
  'premium': { min: 12, max: 15, label: 'Premium (€12-15)' },
  'high-end': { min: 15, max: 25, label: 'High-end (€15-25)' },
  'any': { min: 1, max: 100, label: 'Any Price' }
};

// Default filter values
export const DEFAULT_FILTERS = {
  query: '',
  location: '',
  userLocation: null,
  maxDistance: 50,
  priceRange: 'any',
  minPrice: PRICE_RANGES.any.min,
  maxPrice: PRICE_RANGES.any.max,
  foodTypes: [],
  features: {},
  practicalFilters: {},
  openNow: false,
  sortBy: 'rating',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
  minGoogleRating: 0,
  overallRating: 0,
  hasMenuReviews: false,
  lastUpdatedDays: '',
  showOnlyFavorites: false
};

// Helper function to create initial filters with optional overrides
export const createInitialFilters = (overrides = {}) => ({
  ...DEFAULT_FILTERS,
  ...overrides
});

// Helper function to clear all filters
export const createClearedFilters = (currentFilters = {}) => ({
  ...currentFilters,
  query: '',
  location: '',
  priceRange: 'any',
  minPrice: PRICE_RANGES.any.min,
  maxPrice: PRICE_RANGES.any.max,
  foodTypes: [],
  features: {},
  practicalFilters: {},
  openNow: false,
  sortBy: 'rating',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
  minGoogleRating: 0,
  overallRating: 0,
  hasMenuReviews: false,
  lastUpdatedDays: '',
  showOnlyFavorites: false
});

// Helper function to get price range by key
export const getPriceRange = (key) => PRICE_RANGES[key] || PRICE_RANGES.any;

// Helper function to check if current filters are at default state
export const isDefaultPriceRange = (priceRange) => priceRange === 'any';

// Helper function to prepare filters for API (removes price filters when not needed)
export const prepareFiltersForAPI = (filters) => {
  const apiFilters = { ...filters };
  
  // Remove price filters if priceRange is 'any'
  if (isDefaultPriceRange(apiFilters.priceRange)) {
    delete apiFilters.minPrice;
    delete apiFilters.maxPrice;
  }
  
  return apiFilters;
};

// Data freshness options
export const DATA_FRESHNESS_OPTIONS = [
  { value: '', label: 'Anytime' },
  { value: '7', label: 'Last Week' },
  { value: '30', label: 'Last Month' },
  { value: '90', label: 'Last 3 Months' }
];

// Food type options
export const FOOD_TYPE_OPTIONS = [
  'Traditional Portuguese',
  'Modern/Contemporary',
  'Seafood specialist',
  'Meat-focused',
  'Vegetarian-friendly',
  'International'
];

// Feature labels
export const FEATURE_LABELS = {
  coffeeIncluded: 'Coffee Included',
  dessertIncluded: 'Dessert Included',
  wineAvailable: 'Wine Available',
  breadSoupIncluded: 'Couvert Included'
  // TODO: Add vegetarianOptions when backend mapping is implemented
  // vegetarianOptions: 'Vegetarian Options'
};

// Slider configurations
export const SLIDER_CONFIG = {
  price: {
    min: PRICE_RANGES.any.min,
    max: PRICE_RANGES.any.max,
    step: 0.5,
    label: 'Your budget (per meal)'
  },
  rating: {
    min: 0,
    max: 5,
    step: 0.1
  }
};