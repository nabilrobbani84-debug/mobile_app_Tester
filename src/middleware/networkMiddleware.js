// src/middleware/networkMiddleware.js
// Network connectivity and request handling middleware
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
// Network state
let isConnected = true;
let connectionType = 'unknown';
let networkListeners = [];
/**
 * Initialize network monitoring
 * Call this in app initialization
 */
export const initNetworkMonitoring = () => {
  const unsubscribe = NetInfo.addEventListener((state) => {
    const wasConnected = isConnected;
    
    isConnected = state.isConnected ?? false;
    connectionType = state.type;
    console.log('Network state changed:', {
      isConnected,
      type: connectionType,
      isInternetReachable: state.isInternetReachable,
    });
    // Notify listeners
    networkListeners.forEach((listener) => {
      listener({
        isConnected,
        connectionType,
        wasConnected,
        isInternetReachable: state.isInternetReachable,
      });
    });
  });
  return unsubscribe;
};
/**
 * Add network state change listener
 * @param {function} listener - Callback function
 * @returns {function} Unsubscribe function
 */
export const addNetworkListener = (listener) => {
  networkListeners.push(listener);
  
  return () => {
    networkListeners = networkListeners.filter((l) => l !== listener);
  };
};
/**
 * Get current network state
 * @returns {Promise<object>} Network state
 */
export const getNetworkState = async () => {
  try {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected,
      type: state.type,
      isInternetReachable: state.isInternetReachable,
      details: state.details,
    };
  } catch (error) {
    console.error('Error getting network state:', error);
    return {
      isConnected: false,
      type: 'unknown',
      isInternetReachable: false,
      details: null,
    };
  }
};
/**
 * Check if device is online
 * @returns {boolean}
 */
export const isOnline = () => isConnected;
/**
 * Get current connection type
 * @returns {string}
 */
export const getConnectionType = () => connectionType;
/**
 * Check if connection is wifi
 * @returns {boolean}
 */
export const isWifi = () => connectionType === 'wifi';
/**
 * Check if connection is cellular
 * @returns {boolean}
 */
export const isCellular = () => connectionType === 'cellular';
/**
 * Network request middleware for axios
 * Checks connectivity before making requests
 */
export const networkRequestInterceptor = async (config) => {
  // Check network connectivity
  if (!isConnected) {
    console.log('No network connection, request blocked');
    
    // Return custom error
    const error = new Error('Tidak ada koneksi internet');
    error.code = 'NETWORK_ERROR';
    error.isNetworkError = true;
    
    return Promise.reject(error);
  }
  // Add request timestamp for timeout tracking
  config.metadata = {
    ...config.metadata,
    startTime: Date.now(),
  };
  return config;
};
/**
 * Network response middleware for axios
 * Tracks response times and handles network errors
 */
export const networkResponseInterceptor = {
  onSuccess: (response) => {
    // Calculate response time
    const startTime = response.config?.metadata?.startTime;
    if (startTime) {
      const responseTime = Date.now() - startTime;
      console.log(`Request completed in ${responseTime}ms:`, response.config.url);
      // Track slow requests
      if (responseTime > 5000) {
        console.warn('Slow request detected:', {
          url: response.config.url,
          time: responseTime,
        });
      }
    }
    return response;
  },
  onError: (error) => {
    // Handle network-specific errors
    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      console.error('Network error occurred:', error.message);
      
      error.isNetworkError = true;
      error.userMessage = 'Gagal terhubung ke server. Periksa koneksi internet Anda.';
    }
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      error.isTimeout = true;
      error.userMessage = 'Permintaan timeout. Silakan coba lagi.';
    }
    return Promise.reject(error);
  },
};
/**
 * Retry configuration for failed requests
 */
export const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return (
      error.isNetworkError ||
      error.isTimeout ||
      (error.response && error.response.status >= 500)
    );
  },
};
/**
 * Retry failed request with exponential backoff
 * @param {function} requestFn - Request function to retry
 * @param {object} options - Retry options
 * @returns {Promise} Request result
 */
export const retryRequest = async (requestFn, options = {}) => {
  const {
    maxRetries = retryConfig.maxRetries,
    retryDelay = retryConfig.retryDelay,
    retryCondition = retryConfig.retryCondition,
  } = options;
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      // Check if should retry
      if (attempt < maxRetries && retryCondition(error)) {
        // Exponential backoff
        const delay = retryDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} in ${delay}ms`);
        
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        break;
      }
    }
  }
  throw lastError;
};
/**
 * Queue for offline requests
 * Stores requests to be sent when connection is restored
 */
const offlineQueue = [];
/**
 * Add request to offline queue
 * @param {object} request - Request configuration
 */
export const queueOfflineRequest = (request) => {
  offlineQueue.push({
    ...request,
    queuedAt: Date.now(),
  });
  
  console.log('Request queued for offline:', request.url);
  console.log('Queue size:', offlineQueue.length);
};
/**
 * Get offline queue
 * @returns {array} Queued requests
 */
export const getOfflineQueue = () => [...offlineQueue];
/**
 * Clear offline queue
 */
export const clearOfflineQueue = () => {
  offlineQueue.length = 0;
};
/**
 * Process offline queue when connection is restored
 * @param {function} sendRequest - Function to send requests
 * @returns {Promise<array>} Results of processed requests
 */
export const processOfflineQueue = async (sendRequest) => {
  if (offlineQueue.length === 0) {
    return [];
  }
  console.log(`Processing ${offlineQueue.length} queued requests`);
  const results = [];
  
  while (offlineQueue.length > 0) {
    const request = offlineQueue.shift();
    
    try {
      const result = await sendRequest(request);
      results.push({ success: true, request, result });
    } catch (error) {
      results.push({ success: false, request, error });
      
      // Re-queue if still offline
      if (error.isNetworkError) {
        offlineQueue.unshift(request);
        break;
      }
    }
  }
  return results;
};
/**
 * Check if request should be queued offline
 * @param {object} config - Request configuration
 * @returns {boolean}
 */
export const shouldQueueOffline = (config) => {
  // Queue POST, PUT, PATCH requests that are important
  const queueableMethods = ['post', 'put', 'patch'];
  const method = config.method?.toLowerCase();
  
  // Check if method is queueable
  if (!queueableMethods.includes(method)) {
    return false;
  }
  // Check if explicitly marked as offline-capable
  if (config.offlineQueue === true) {
    return true;
  }
  // Queue report submissions
  if (config.url?.includes('/report')) {
    return true;
  }
  return false;
};
/**
 * Get connection quality indicator
 * @returns {string} Connection quality: 'excellent', 'good', 'fair', 'poor'
 */
export const getConnectionQuality = async () => {
  const state = await getNetworkState();
  if (!state.isConnected) {
    return 'offline';
  }
  if (state.type === 'wifi') {
    return 'excellent';
  }
  if (state.type === 'cellular') {
    const details = state.details;
    
    if (Platform.OS === 'android' && details?.cellularGeneration) {
      switch (details.cellularGeneration) {
        case '4g':
          return 'good';
        case '3g':
          return 'fair';
        case '2g':
          return 'poor';
        default:
          return 'fair';
      }
    }
    
    return 'good';
  }
  return 'fair';
};
/**
 * Network-aware request wrapper
 * Handles offline mode and request queuing
 */
export const networkAwareRequest = async (requestFn, config = {}) => {
  const networkState = await getNetworkState();
  if (!networkState.isConnected) {
    // Check if request can be queued
    if (shouldQueueOffline(config)) {
      queueOfflineRequest(config);
      
      return {
        queued: true,
        message: 'Permintaan akan dikirim saat online',
      };
    }
    throw {
      isNetworkError: true,
      code: 'OFFLINE',
      message: 'Tidak ada koneksi internet',
      userMessage: 'Anda sedang offline. Periksa koneksi internet Anda.',
    };
  }
  return requestFn();
};
export default {
  initNetworkMonitoring,
  addNetworkListener,
  getNetworkState,
  isOnline,
  getConnectionType,
  isWifi,
  isCellular,
  networkRequestInterceptor,
  networkResponseInterceptor,
  retryConfig,
  retryRequest,
  queueOfflineRequest,
  getOfflineQueue,
  clearOfflineQueue,
  processOfflineQueue,
  shouldQueueOffline,
  getConnectionQuality,
  networkAwareRequest,
};
