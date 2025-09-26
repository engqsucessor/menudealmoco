/**
 * Utility Functions for Menu Deal Moço Services
 * Common helpers and utilities used across all services
 */

/**
 * Simulate network delay with configurable range
 * @param {number} min - Minimum delay in milliseconds
 * @param {number} max - Maximum delay in milliseconds
 * @returns {Promise} Resolves after random delay
 */
export const simulateDelay = (min = 300, max = 1000) => {
  return new Promise(resolve =>
    setTimeout(resolve, Math.random() * (max - min) + min)
  );
};

/**
 * Simulate API failures with configurable probability
 * @param {number} failureRate - Failure rate between 0 and 1
 * @param {string} errorMessage - Custom error message
 * @throws {Error} Random network error
 */
export const simulateFailure = (failureRate = 0.05, errorMessage = 'Network error: Service temporarily unavailable') => {
  if (Math.random() < failureRate) {
    throw new Error(errorMessage);
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - First latitude
 * @param {number} lng1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lng2 - Second longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
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

/**
 * Generate unique ID with optional prefix
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Portuguese phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone number is valid
 */
export const isValidPortuguesePhone = (phone) => {
  // Portuguese phone numbers: +351 followed by 9 digits
  const phoneRegex = /^(\+351\s?)?[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Format price in euros
 * @param {number} price - Price value
 * @param {boolean} showSymbol - Whether to show € symbol
 * @returns {string} Formatted price
 */
export const formatPrice = (price, showSymbol = true) => {
  const formatted = parseFloat(price).toFixed(2);
  return showSymbol ? `€${formatted}` : formatted;
};

/**
 * Format distance with appropriate unit
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${Math.round(distance * 10) / 10}km`;
};

/**
 * Get price category based on price value
 * @param {number} price - Menu price
 * @returns {string} Price category
 */
export const getPriceCategory = (price) => {
  if (price <= 8) return 'budget';
  if (price <= 10) return 'standard';
  if (price <= 12) return 'good';
  if (price <= 15) return 'premium';
  return 'high-end';
};

/**
 * Get price category label in Portuguese
 * @param {string} category - Price category
 * @returns {string} Portuguese label
 */
export const getPriceCategoryLabel = (category) => {
  const labels = {
    'budget': 'Económico',
    'standard': 'Padrão',
    'good': 'Bom Valor',
    'premium': 'Premium',
    'high-end': 'Luxo'
  };
  return labels[category] || category;
};

/**
 * Check if restaurant is currently open
 * @param {Object} restaurant - Restaurant object with business hours
 * @returns {boolean} True if restaurant is open
 */
export const isRestaurantOpen = (restaurant) => {
  const now = new Date();
  const dayOfWeek = getDayOfWeek(now.getDay());
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const todayHours = restaurant.businessHours[dayOfWeek];

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

/**
 * Get day of week string from day index
 * @param {number} dayIndex - Day index (0 = Sunday)
 * @returns {string} Day name
 */
export const getDayOfWeek = (dayIndex) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[dayIndex];
};

/**
 * Format business hours for display
 * @param {Object} businessHours - Business hours object
 * @returns {Object} Formatted hours
 */
export const formatBusinessHours = (businessHours) => {
  const dayLabels = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const formatted = {};
  Object.entries(businessHours).forEach(([day, hours]) => {
    formatted[dayLabels[day]] = hours === 'closed' ? 'Fechado' : hours;
  });

  return formatted;
};

/**
 * Sanitize and filter text content
 * @param {string} text - Text to filter
 * @returns {string} Filtered text
 */
export const filterContent = (text) => {
  if (!text) return text;

  // Remove potentially harmful content
  const inappropriateWords = ['spam', 'fake', 'advertisement', 'scam'];
  let filtered = text;

  inappropriateWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '***');
  });

  // Remove excessive whitespace
  filtered = filtered.replace(/\s+/g, ' ').trim();

  return filtered;
};

/**
 * Calculate average rating from ratings object
 * @param {Array} reviews - Array of review objects
 * @returns {Object} Average ratings
 */
export const calculateAverageRatings = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return {
      overall: 0,
      valueForMoney: 0,
      foodQuality: 0,
      portionSize: 0,
      serviceSpeed: 0
    };
  }

  const totals = reviews.reduce((acc, review) => {
    acc.overall += review.rating.overall;
    acc.valueForMoney += review.rating.valueForMoney;
    acc.foodQuality += review.rating.foodQuality;
    acc.portionSize += review.rating.portionSize;
    acc.serviceSpeed += review.rating.serviceSpeed;
    return acc;
  }, {
    overall: 0,
    valueForMoney: 0,
    foodQuality: 0,
    portionSize: 0,
    serviceSpeed: 0
  });

  const count = reviews.length;
  return {
    overall: Math.round((totals.overall / count) * 10) / 10,
    valueForMoney: Math.round((totals.valueForMoney / count) * 10) / 10,
    foodQuality: Math.round((totals.foodQuality / count) * 10) / 10,
    portionSize: Math.round((totals.portionSize / count) * 10) / 10,
    serviceSpeed: Math.round((totals.serviceSpeed / count) * 10) / 10
  };
};

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    Object.keys(obj).forEach(key => {
      clonedObj[key] = deepClone(obj[key]);
    });
    return clonedObj;
  }
};

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted date
 */
export const formatDate = (date, locale = 'pt-PT') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
};

/**
 * Format relative time (e.g., "2 days ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now - dateObj;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} minuto${diffInMinutes === 1 ? '' : 's'}`;
  } else if (diffInHours < 24) {
    return `há ${diffInHours} hora${diffInHours === 1 ? '' : 's'}`;
  } else if (diffInDays < 30) {
    return `há ${diffInDays} dia${diffInDays === 1 ? '' : 's'}`;
  } else {
    return formatDate(dateObj);
  }
};

/**
 * Local storage wrapper with error handling
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Failed to get item from localStorage:', error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Failed to set item in localStorage:', error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove item from localStorage:', error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  }
};

/**
 * Validation helpers
 */
export const validators = {
  required: (value) => {
    return value !== null && value !== undefined && value !== '';
  },

  minLength: (value, min) => {
    return typeof value === 'string' && value.length >= min;
  },

  maxLength: (value, max) => {
    return typeof value === 'string' && value.length <= max;
  },

  email: (value) => {
    return isValidEmail(value);
  },

  phone: (value) => {
    return isValidPortuguesePhone(value);
  },

  number: (value, min = null, max = null) => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  },

  coordinates: (lat, lng) => {
    return validators.number(lat, -90, 90) && validators.number(lng, -180, 180);
  }
};

/**
 * Error handling utilities
 */
export const errorHandler = {
  /**
   * Handle service errors with user-friendly messages
   * @param {Error} error - Error object
   * @returns {Object} Error response
   */
  handleServiceError: (error) => {
    if (error.message.includes('Network error')) {
      return {
        type: 'network',
        message: 'Problema de conexão. Tente novamente.',
        technical: error.message
      };
    }

    if (error.message.includes('Validation failed')) {
      return {
        type: 'validation',
        message: 'Dados inválidos fornecidos.',
        technical: error.message
      };
    }

    if (error.message.includes('not found')) {
      return {
        type: 'notFound',
        message: 'Informação não encontrada.',
        technical: error.message
      };
    }

    return {
      type: 'unknown',
      message: 'Ocorreu um erro inesperado. Tente novamente.',
      technical: error.message
    };
  }
};

export default {
  simulateDelay,
  simulateFailure,
  calculateDistance,
  generateId,
  isValidEmail,
  isValidPortuguesePhone,
  formatPrice,
  formatDistance,
  getPriceCategory,
  getPriceCategoryLabel,
  isRestaurantOpen,
  getDayOfWeek,
  formatBusinessHours,
  filterContent,
  calculateAverageRatings,
  debounce,
  throttle,
  deepClone,
  formatDate,
  formatRelativeTime,
  storage,
  validators,
  errorHandler
};