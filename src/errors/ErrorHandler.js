// src/errors/ErrorHandler.js
// Global error handling utilities
import { Alert, Platform } from 'react-native';
import {
  AppError,
  ValidationError,
  AuthenticationError,
  NetworkError,
  APIError,
  StorageError,
  ImageError,
  ERROR_CODES,
} from './AppError';
import { error as logError, warn as logWarn } from '../middleware/loggingMiddleware';
// Error handlers registry
const errorHandlers = new Map();
// Global error callback
let globalErrorCallback = null;
/**
 * Set global error callback
 * @param {function} callback - Error callback function
 */
export const setGlobalErrorCallback = (callback) => {
  globalErrorCallback = callback;
};
/**
 * Register custom error handler for specific error type
 * @param {string} errorCode - Error code to handle
 * @param {function} handler - Handler function
 */
export const registerErrorHandler = (errorCode, handler) => {
  errorHandlers.set(errorCode, handler);
};
/**
 * Remove error handler
 * @param {string} errorCode - Error code
 */
export const removeErrorHandler = (errorCode) => {
  errorHandlers.delete(errorCode);
};
/**
 * Handle error with appropriate action
 * @param {Error} error - Error to handle
 * @param {object} options - Handler options
 * @returns {object} Handled error result
 */
export const handleError = (error, options = {}) => {
  const {
    showAlert = true,
    logToConsole = true,
    rethrow = false,
    context = 'Unknown',
    onError = null,
  } = options;
  // Normalize error to AppError
  const normalizedError = normalizeError(error);
  // Log error
  if (logToConsole) {
    logError('ErrorHandler', `[${context}] ${normalizedError.message}`, {
      code: normalizedError.code,
      details: normalizedError.details,
      stack: normalizedError.stack,
    });
  }
  // Check for registered handler
  if (errorHandlers.has(normalizedError.code)) {
    const handler = errorHandlers.get(normalizedError.code);
    try {
      const result = handler(normalizedError);
      if (result !== false) {
        return { handled: true, error: normalizedError, result };
      }
    } catch (handlerError) {
      logWarn('ErrorHandler', 'Custom handler failed', { error: handlerError });
    }
  }
  // Global callback
  if (globalErrorCallback) {
    globalErrorCallback(normalizedError);
  }
  // Custom callback
  if (onError) {
    onError(normalizedError);
  }
  // Show alert if enabled
  if (showAlert) {
    showErrorAlert(normalizedError);
  }
  // Rethrow if requested
  if (rethrow) {
    throw normalizedError;
  }
  return { handled: true, error: normalizedError };
};
/**
 * Normalize any error to AppError
 * @param {Error|object|string} error - Error to normalize
 * @returns {AppError}
 */
export const normalizeError = (error) => {
  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }
  // String error
  if (typeof error === 'string') {
    return new AppError(error, ERROR_CODES.UNKNOWN_ERROR);
  }
  // Axios error
  if (error.isAxiosError) {
    return APIError.fromAxiosError(error);
  }
  // Network error
  if (error.message === 'Network Error' || error.isNetworkError) {
    return NetworkError.offline();
  }
  // Standard Error object
  if (error instanceof Error) {
    return new AppError(
      error.message,
      error.code || ERROR_CODES.UNKNOWN_ERROR,
      500,
      { originalError: error.name }
    );
  }
  // Object with message
  if (error && typeof error === 'object' && error.message) {
    return new AppError(
      error.message,
      error.code || ERROR_CODES.UNKNOWN_ERROR,
      error.statusCode || 500,
      error.details
    );
  }
  // Unknown error type
  return new AppError(
    'Terjadi kesalahan yang tidak diketahui',
    ERROR_CODES.UNKNOWN_ERROR
  );
};
/**
 * Show error alert dialog
 * @param {AppError} error - Error to display
 * @param {object} options - Alert options
 */
export const showErrorAlert = (error, options = {}) => {
  const {
    title = getErrorTitle(error),
    showRetry = false,
    onRetry = null,
    onDismiss = null,
  } = options;
  const message = error.getUserMessage ? error.getUserMessage() : error.message;
  const buttons = [
    {
      text: 'OK',
      onPress: onDismiss,
    },
  ];
  if (showRetry && onRetry) {
    buttons.unshift({
      text: 'Coba Lagi',
      onPress: onRetry,
    });
  }
  Alert.alert(title, message, buttons, { cancelable: true });
};
/**
 * Get appropriate title for error type
 * @param {AppError} error - Error object
 * @returns {string} Alert title
 */
const getErrorTitle = (error) => {
  if (error instanceof ValidationError) {
    return 'Validasi Gagal';
  }
  if (error instanceof AuthenticationError) {
    return 'Autentikasi Gagal';
  }
  if (error instanceof NetworkError) {
    return 'Kesalahan Jaringan';
  }
  if (error instanceof APIError) {
    return 'Kesalahan Server';
  }
  if (error instanceof StorageError) {
    return 'Kesalahan Penyimpanan';
  }
  if (error instanceof ImageError) {
    return 'Kesalahan Gambar';
  }
  return 'Kesalahan';
};
/**
 * Create error handler with predefined options
 * @param {object} defaultOptions - Default handler options
 * @returns {function} Handler function
 */
export const createErrorHandler = (defaultOptions = {}) => {
  return (error, options = {}) => {
    return handleError(error, { ...defaultOptions, ...options });
  };
};
/**
 * Async function wrapper with error handling
 * @param {function} asyncFn - Async function to wrap
 * @param {object} options - Error handler options
 * @returns {function} Wrapped function
 */
export const withErrorHandling = (asyncFn, options = {}) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      handleError(error, options);
      return null;
    }
  };
};
/**
 * Try-catch wrapper with error handling
 * @param {function} fn - Function to execute
 * @param {object} options - Error handler options
 * @returns {any} Function result or null on error
 */
export const tryCatch = (fn, options = {}) => {
  try {
    const result = fn();
    
    // Handle promises
    if (result instanceof Promise) {
      return result.catch((error) => {
        handleError(error, options);
        return null;
      });
    }
    
    return result;
  } catch (error) {
    handleError(error, options);
    return null;
  }
};
/**
 * Error boundary error handler for React
 * @param {Error} error - Error caught by boundary
 * @param {object} errorInfo - React error info
 */
export const handleBoundaryError = (error, errorInfo) => {
  const normalizedError = normalizeError(error);
  
  logError('ErrorBoundary', 'Component Error', {
    error: normalizedError.toJSON(),
    componentStack: errorInfo?.componentStack,
  });
  // Could report to crash analytics here
  // crashlytics().recordError(normalizedError);
  return normalizedError;
};
/**
 * Promise rejection handler
 * @param {Error} error - Rejection error
 * @param {Promise} promise - Rejected promise
 */
export const handleUnhandledRejection = (error, promise) => {
  logWarn('ErrorHandler', 'Unhandled Promise Rejection', {
    error: normalizeError(error).toJSON(),
  });
};
/**
 * Setup global error handlers
 */
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections
  if (Platform.OS !== 'web') {
    // React Native specific
    const originalHandler = global.ErrorUtils?.getGlobalHandler();
    
    global.ErrorUtils?.setGlobalHandler((error, isFatal) => {
      logError('GlobalHandler', isFatal ? 'Fatal Error' : 'Error', {
        error: normalizeError(error).toJSON(),
        isFatal,
      });
      // Call original handler
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
  }
  // Setup default handlers for common errors
  registerErrorHandler(ERROR_CODES.SESSION_EXPIRED, (error) => {
    // Will be handled by auth middleware
    return false;
  });
  registerErrorHandler(ERROR_CODES.OFFLINE, (error) => {
    showErrorAlert(error, {
      title: 'Tidak Ada Koneksi',
      showRetry: true,
    });
    return true;
  });
};
/**
 * Extract error message safely
 * @param {any} error - Error object
 * @returns {string} Error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'Terjadi kesalahan';
  
  if (typeof error === 'string') return error;
  
  if (error.getUserMessage) return error.getUserMessage();
  
  if (error.message) return error.message;
  
  if (error.error) return error.error;
  
  return 'Terjadi kesalahan';
};
/**
 * Check if error is of specific type
 * @param {Error} error - Error to check
 * @param {string} errorCode - Error code to match
 * @returns {boolean}
 */
export const isErrorType = (error, errorCode) => {
  const normalized = normalizeError(error);
  return normalized.code === errorCode;
};
/**
 * Check if error is retryable
 * @param {Error} error - Error to check
 * @returns {boolean}
 */
export const isRetryableError = (error) => {
  const normalized = normalizeError(error);
  
  const retryableCodes = [
    ERROR_CODES.NETWORK_ERROR,
    ERROR_CODES.OFFLINE,
    ERROR_CODES.TIMEOUT,
    ERROR_CODES.SERVER_ERROR,
  ];
  return retryableCodes.includes(normalized.code) ||
    (normalized.statusCode >= 500 && normalized.statusCode < 600);
};
export default {
  setGlobalErrorCallback,
  registerErrorHandler,
  removeErrorHandler,
  handleError,
  normalizeError,
  showErrorAlert,
  createErrorHandler,
  withErrorHandling,
  tryCatch,
  handleBoundaryError,
  handleUnhandledRejection,
  setupGlobalErrorHandlers,
  getErrorMessage,
  isErrorType,
  isRetryableError,
};
