// src/middleware/loggingMiddleware.js
// Logging and debugging middleware
import { Platform } from 'react-native';
// Log levels
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};
// Current log level (configurable)
let currentLogLevel = __DEV__ ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;
// Log storage for debugging
const logHistory = [];
const MAX_LOG_HISTORY = 100;
// Log listeners
const logListeners = [];
/**
 * Set current log level
 * @param {number} level - Log level from LOG_LEVELS
 */
export const setLogLevel = (level) => {
  currentLogLevel = level;
};
/**
 * Get current log level
 * @returns {number}
 */
export const getLogLevel = () => currentLogLevel;
/**
 * Format log message with timestamp and metadata
 * @param {string} level - Log level name
 * @param {string} category - Log category
 * @param {string} message - Log message
 * @param {object} data - Additional data
 * @returns {object} Formatted log entry
 */
const formatLogEntry = (level, category, message, data = null) => {
  const timestamp = new Date().toISOString();
  
  return {
    timestamp,
    level,
    category,
    message,
    data,
    platform: Platform.OS,
  };
};
/**
 * Store log entry in history
 * @param {object} entry - Log entry
 */
const storeLogEntry = (entry) => {
  logHistory.push(entry);
  
  // Trim history if too large
  if (logHistory.length > MAX_LOG_HISTORY) {
    logHistory.shift();
  }
  
  // Notify listeners
  logListeners.forEach((listener) => {
    try {
      listener(entry);
    } catch (error) {
      console.error('Log listener error:', error);
    }
  });
};
/**
 * Add log listener
 * @param {function} listener - Callback function
 * @returns {function} Unsubscribe function
 */
export const addLogListener = (listener) => {
  logListeners.push(listener);
  
  return () => {
    const index = logListeners.indexOf(listener);
    if (index > -1) {
      logListeners.splice(index, 1);
    }
  };
};
/**
 * Get log history
 * @param {object} options - Filter options
 * @returns {array} Log entries
 */
export const getLogHistory = (options = {}) => {
  let logs = [...logHistory];
  
  // Filter by level
  if (options.level !== undefined) {
    const levelIndex = LOG_LEVELS[options.level] ?? options.level;
    logs = logs.filter((log) => LOG_LEVELS[log.level] >= levelIndex);
  }
  
  // Filter by category
  if (options.category) {
    logs = logs.filter((log) => log.category === options.category);
  }
  
  // Filter by time range
  if (options.since) {
    const sinceTime = new Date(options.since).getTime();
    logs = logs.filter((log) => new Date(log.timestamp).getTime() >= sinceTime);
  }
  
  // Limit results
  if (options.limit) {
    logs = logs.slice(-options.limit);
  }
  
  return logs;
};
/**
 * Clear log history
 */
export const clearLogHistory = () => {
  logHistory.length = 0;
};
/**
 * Debug level log
 * @param {string} category - Log category
 * @param {string} message - Log message
 * @param {object} data - Additional data
 */
export const debug = (category, message, data = null) => {
  if (currentLogLevel <= LOG_LEVELS.DEBUG) {
    const entry = formatLogEntry('DEBUG', category, message, data);
    storeLogEntry(entry);
    
    if (__DEV__) {
      console.log(`[DEBUG][${category}]`, message, data || '');
    }
  }
};
/**
 * Info level log
 * @param {string} category - Log category
 * @param {string} message - Log message
 * @param {object} data - Additional data
 */
export const info = (category, message, data = null) => {
  if (currentLogLevel <= LOG_LEVELS.INFO) {
    const entry = formatLogEntry('INFO', category, message, data);
    storeLogEntry(entry);
    
    if (__DEV__) {
      console.info(`[INFO][${category}]`, message, data || '');
    }
  }
};
/**
 * Warning level log
 * @param {string} category - Log category
 * @param {string} message - Log message
 * @param {object} data - Additional data
 */
export const warn = (category, message, data = null) => {
  if (currentLogLevel <= LOG_LEVELS.WARN) {
    const entry = formatLogEntry('WARN', category, message, data);
    storeLogEntry(entry);
    
    console.warn(`[WARN][${category}]`, message, data || '');
  }
};
/**
 * Error level log
 * @param {string} category - Log category
 * @param {string} message - Log message
 * @param {object} data - Additional data
 */
export const error = (category, message, data = null) => {
  if (currentLogLevel <= LOG_LEVELS.ERROR) {
    const entry = formatLogEntry('ERROR', category, message, data);
    storeLogEntry(entry);
    
    console.error(`[ERROR][${category}]`, message, data || '');
    
    // Could send to error tracking service here
    // e.g., Sentry, Crashlytics, etc.
  }
};
// Predefined categories
export const LOG_CATEGORIES = {
  API: 'API',
  AUTH: 'AUTH',
  NAVIGATION: 'NAVIGATION',
  STORAGE: 'STORAGE',
  UI: 'UI',
  NETWORK: 'NETWORK',
  STATE: 'STATE',
  PERFORMANCE: 'PERFORMANCE',
};
/**
 * API request logging middleware for axios
 */
export const apiRequestLogger = (config) => {
  debug(LOG_CATEGORIES.API, 'Request', {
    method: config.method?.toUpperCase(),
    url: config.url,
    params: config.params,
    // Don't log sensitive data
    headers: {
      ...config.headers,
      Authorization: config.headers?.Authorization ? '[REDACTED]' : undefined,
    },
  });
  
  return config;
};
/**
 * API response logging middleware for axios
 */
export const apiResponseLogger = {
  onSuccess: (response) => {
    const duration = response.config?.metadata?.startTime
      ? Date.now() - response.config.metadata.startTime
      : 'unknown';
    debug(LOG_CATEGORIES.API, 'Response', {
      status: response.status,
      url: response.config?.url,
      duration: `${duration}ms`,
      dataSize: JSON.stringify(response.data).length,
    });
    
    return response;
  },
  onError: (error) => {
    error(LOG_CATEGORIES.API, 'Request Error', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });
    
    return Promise.reject(error);
  },
};
/**
 * Navigation event logger
 * @param {object} event - Navigation event
 */
export const logNavigationEvent = (event) => {
  debug(LOG_CATEGORIES.NAVIGATION, 'Navigation', {
    type: event.type,
    routeName: event.data?.state?.routes?.[event.data?.state?.index]?.name,
  });
};
/**
 * State change logger for debugging
 * @param {string} storeName - Store/context name
 * @param {string} action - Action name
 * @param {object} prevState - Previous state
 * @param {object} nextState - New state
 */
export const logStateChange = (storeName, action, prevState, nextState) => {
  debug(LOG_CATEGORIES.STATE, `${storeName}: ${action}`, {
    prevState: __DEV__ ? prevState : '[HIDDEN]',
    nextState: __DEV__ ? nextState : '[HIDDEN]',
  });
};
/**
 * Performance measurement helper
 * @param {string} label - Measurement label
 * @returns {function} End measurement function
 */
export const measurePerformance = (label) => {
  const startTime = Date.now();
  
  return () => {
    const duration = Date.now() - startTime;
    
    debug(LOG_CATEGORIES.PERFORMANCE, label, {
      duration: `${duration}ms`,
    });
    
    if (duration > 1000) {
      warn(LOG_CATEGORIES.PERFORMANCE, `Slow operation: ${label}`, {
        duration: `${duration}ms`,
      });
    }
    
    return duration;
  };
};
/**
 * Create scoped logger for a specific category
 * @param {string} category - Log category
 * @returns {object} Scoped logger
 */
export const createLogger = (category) => ({
  debug: (message, data) => debug(category, message, data),
  info: (message, data) => info(category, message, data),
  warn: (message, data) => warn(category, message, data),
  error: (message, data) => error(category, message, data),
  measure: (label) => measurePerformance(`${category}:${label}`),
});
/**
 * Error boundary logger
 * @param {Error} error - Error object
 * @param {object} errorInfo - React error info
 */
export const logErrorBoundary = (err, errorInfo) => {
  error(LOG_CATEGORIES.UI, 'Error Boundary Caught', {
    error: err.message,
    stack: err.stack,
    componentStack: errorInfo?.componentStack,
  });
};
/**
 * Export logs for debugging
 * @returns {string} JSON string of logs
 */
export const exportLogs = () => {
  return JSON.stringify({
    exported: new Date().toISOString(),
    platform: Platform.OS,
    logs: logHistory,
  }, null, 2);
};
/**
 * Console override for production
 * Can be used to disable or redirect console logs
 */
export const setupProductionLogging = () => {
  if (!__DEV__) {
    // Store original console methods
    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
    };
    // Override console methods
    console.log = (...args) => {
      // Suppress in production or route to logging service
    };
    console.info = (...args) => {
      // Suppress in production
    };
    console.warn = (...args) => {
      // Keep warnings, route to service
      warn('CONSOLE', args.join(' '));
    };
    console.error = (...args) => {
      // Keep errors, route to service
      error('CONSOLE', args.join(' '));
    };
    // Return restore function
    return () => {
      console.log = originalConsole.log;
      console.info = originalConsole.info;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
    };
  }
  return () => {};
};
export default {
  LOG_LEVELS,
  LOG_CATEGORIES,
  setLogLevel,
  getLogLevel,
  debug,
  info,
  warn,
  error,
  addLogListener,
  getLogHistory,
  clearLogHistory,
  apiRequestLogger,
  apiResponseLogger,
  logNavigationEvent,
  logStateChange,
  measurePerformance,
  createLogger,
  logErrorBoundary,
  exportLogs,
  setupProductionLogging,
};