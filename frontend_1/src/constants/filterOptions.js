// filterOptions.js - Centralized filter options for UI components
// This file contains all filter dropdown options, checkboxes, and UI configurations
// used across FilterPanel, SearchResults, and other filter-related components

/**
 * Price range options for filter dropdowns
 * Each option includes a value, label, and descriptive subtitle
 * @type {Array<{value: string, label: string, subtitle: string}>}
 */
export const PRICE_RANGE_OPTIONS = [
  { value: '6-8', label: '€6-8', subtitle: 'Budget deals' },
  { value: '8-10', label: '€8-10', subtitle: 'Standard' },
  { value: '10-12', label: '€10-12', subtitle: 'Good value' },
  { value: '12-15', label: '€12-15', subtitle: 'Premium' },
  { value: '15+', label: '€15+', subtitle: 'High-end' }
];

/**
 * Distance filter options
 * Provides preset distance ranges for proximity-based filtering
 * @type {Array<{value: string, label: string, subtitle: string}>}
 */
export const DISTANCE_OPTIONS = [
  { value: '0.5', label: '500m', subtitle: 'Walking distance' },
  { value: '1', label: '1km', subtitle: 'Short walk' },
  { value: '2', label: '2km', subtitle: 'Bike/drive' },
  { value: '5', label: '5km', subtitle: 'Driving distance' },
  { value: 'any', label: 'Any', subtitle: 'No limit' }
];

/**
 * Food type options for cuisine filtering
 * Array of cuisine/food style categories
 * @type {Array<string>}
 */
export const FOOD_TYPE_OPTIONS = [
  'Traditional Portuguese',
  'Modern/Contemporary',
  'Seafood specialist',
  'Meat-focused',
  'Vegetarian-friendly',
  'International'
];

/**
 * What's included options (menu features)
 * Items that can be included in the lunch menu
 * @type {Array<{key: string, label: string, icon: string}>}
 */
export const INCLUDES_OPTIONS = [
  { key: 'coffee', label: 'Coffee included', icon: '☕' },
  { key: 'dessert', label: 'Dessert included', icon: '🍰' },
  { key: 'wine', label: 'Wine available', icon: '🍷' },
  { key: 'bread', label: 'Bread/soup included', icon: '🍞' }
];

/**
 * Practical filter options (restaurant features)
 * Convenience and service-related features
 * @type {Array<{key: string, label: string, icon: string}>}
 */
export const PRACTICAL_OPTIONS = [
  { key: 'openNow', label: 'Open now', icon: '🕐' },
  { key: 'takesCards', label: 'Takes credit cards', icon: '💳' },
  { key: 'quickService', label: 'Quick service', icon: '⚡' },
  { key: 'groupFriendly', label: 'Group-friendly', icon: '👥' },
  { key: 'hasParking', label: 'Has parking', icon: '🚗' }
];

/**
 * Sort options for search results
 * Defines available sorting methods for restaurant listings
 * @type {Array<{value: string, label: string}>}
 */
export const SORT_OPTIONS = [
  { value: 'rating', label: 'Rating (Highest First)' },
  { value: 'price-low', label: 'Price (Low to High)' },
  { value: 'price-high', label: 'Price (High to Low)' },
  { value: 'distance', label: 'Distance (Nearest)' },
  { value: 'name', label: 'Name (A-Z)' }
];

/**
 * Google rating filter options
 * Minimum Google rating thresholds
 * @type {Array<{value: string, label: string}>}
 */
export const GOOGLE_RATING_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '4.5', label: '4.5+' },
  { value: '4.0', label: '4.0+' },
  { value: '3.5', label: '3.5+' }
];

/**
 * Last updated filter options
 * Data freshness filters for menu information
 * @type {Array<{value: string, label: string}>}
 */
export const LAST_UPDATED_OPTIONS = [
  { value: '', label: 'Anytime' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' }
];

/**
 * Helper function to get option label by value
 * @param {Array} options - Array of option objects
 * @param {string} value - The value to search for
 * @returns {string} The label or the value if not found
 */
export const getOptionLabel = (options, value) => {
  const option = options.find(opt => opt.value === value);
  return option ? option.label : value;
};

/**
 * Helper function to check if a filter option is selected
 * @param {string} currentValue - Current filter value
 * @param {string} optionValue - Option value to check
 * @returns {boolean} True if the option is selected
 */
export const isOptionSelected = (currentValue, optionValue) => {
  return currentValue === optionValue;
};

/**
 * Helper function to get all option keys from includes or practical options
 * @param {Array<{key: string}>} options - Array of option objects with key property
 * @returns {Array<string>} Array of option keys
 */
export const getOptionKeys = (options) => {
  return options.map(opt => opt.key);
};
