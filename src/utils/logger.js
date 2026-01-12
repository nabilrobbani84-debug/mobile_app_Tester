// File: src/utils/logger.js
/**
 * Modiva - Logger Utility
 * Centralized logging with different levels
 * @module utils/logger
 */

// Log levels
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

// Current log level based on environment
const getCurrentLogLevel = () => {
  const env = process.env.NODE_ENV || 'development';
  const debug = process.env.REACT_APP_DEBUG === 'true';
  
  if (env === 'production' && !debug) {
    return LogLevel.ERROR;
  } else if (env === 'test') {
    return LogLevel.NONE;
  } else {
    return LogLevel.DEBUG;
  }
};

const currentLogLevel = getCurrentLogLevel();

/**
 * Logger class
 */
export class Logger {
  /**
   * Log debug message
   */
  static debug(message, ...args) {
    if (currentLogLevel <= LogLevel.DEBUG) {
      console.log(`🔍 [DEBUG] ${message}`, ...args);
    }
  }
  
  /**
   * Log info message
   */
  static info(message, ...args) {
    if (currentLogLevel <= LogLevel.INFO) {
      console.info(`ℹ️ [INFO] ${message}`, ...args);
    }
  }
  
  /**
   * Log warning message
   */
  static warn(message, ...args) {
    if (currentLogLevel <= LogLevel.WARN) {
      console.warn(`⚠️ [WARN] ${message}`, ...args);
    }
  }

  /**
   * Log success message
   */
  static success(message, ...args) {
    if (currentLogLevel <= LogLevel.INFO) {
      console.log(`✅ [SUCCESS] ${message}`, ...args);
    }
  }
  
  /**
   * Log error message
   */
  static error(message, ...args) {
    if (currentLogLevel <= LogLevel.ERROR) {
      console.error(`❌ [ERROR] ${message}`, ...args);
    }
  }
  
  /**
   * Log API request
   */
  static apiRequest(method, url, data = {}) {
    if (currentLogLevel <= LogLevel.DEBUG) {
      console.groupCollapsed(`🌐 [API] ${method} ${url}`);
      console.log('Request Data:', data);
      console.groupEnd();
    }
  }
  
  /**
   * Log API response
   */
  static apiResponse(response, duration) {
    if (currentLogLevel <= LogLevel.DEBUG) {
      console.groupCollapsed(`✅ [API] Response (${duration}ms)`);
      console.log('Response:', response);
      console.groupEnd();
    }
  }
  
  /**
   * Log API error
   */
  static apiError(error, context = '') {
    if (currentLogLevel <= LogLevel.ERROR) {
      console.groupCollapsed(`🚨 [API ERROR] ${context}`);
      console.error('Error Details:', error);
      console.groupEnd();
    }
  }
  
  /**
   * Performance timing
   */
  static time(label) {
    if (currentLogLevel <= LogLevel.DEBUG) {
      console.time(label);
    }
  }
  
  static timeEnd(label) {
    if (currentLogLevel <= LogLevel.DEBUG) {
      console.timeEnd(label);
    }
  }
}

export default Logger;