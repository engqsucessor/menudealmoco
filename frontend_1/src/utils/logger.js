/**
 * Production-safe logger
 * Disables console logs in production, keeps them in development
 */

const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    } else {
      // In production, only log errors (you might want to send to error tracking service)
      console.error(...args);
    }
  },

  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};

// For quick replacement: export console-like interface
export default logger;
