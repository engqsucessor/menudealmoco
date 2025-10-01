// apiConfig.js - Centralized API configuration and constants

/**
 * Base URL for all API requests.
 * Uses VITE_API_URL environment variable if available, otherwise defaults to '/api'
 * @type {string}
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * API endpoint paths
 * @type {Object.<string, string>}
 */
export const API_ENDPOINTS = {
  AUTH: '/auth',
  RESTAURANTS: '/restaurants',
  REVIEWS: '/reviews',
  EDIT_SUGGESTIONS: '/edit-suggestions',
  REPORTS: '/reports',
};

/**
 * API default configuration values
 * @type {Object}
 */
export const API_DEFAULTS = {
  /** Request timeout in milliseconds */
  TIMEOUT: 10000,
  /** Number of retry attempts for failed requests */
  RETRY_ATTEMPTS: 3,
  /** Default content type header */
  CONTENT_TYPE: 'application/json',
};

/**
 * HTTP status codes for common API responses
 * @type {Object.<string, number>}
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
