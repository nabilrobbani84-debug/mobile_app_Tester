/**
 * Modiva - API Interceptors
 * Request, response, and error interceptors
 * @module services/api/interceptors
 */
import { StorageKeys } from '../../config/storage.config.js';
import { HttpStatus, ApiErrorMessages } from '../../config/api.config.js';
import { AppConfig } from '../../config/app.config.js';
import { Logger } from '../../utils/logger.js';
/**
 * API Interceptors
 */
export const APIInterceptors = {
    /**
     * Add authentication token to request
     * @param {object} config - Request config
     * @returns {object} - Modified config
     */
    addAuthToken(config) {
        const token = localStorage.getItem(StorageKeys.auth.token);
        
        if (token && !config.headers?.['Authorization']) {
            config.headers = {
                ...config.headers,
                'Authorization': `Bearer ${token}`
            };
        }
        
        return config;
    },
    /**
     * Add common headers
     * @param {object} config - Request config
     * @returns {object} - Modified config
     */
    addCommonHeaders(config) {
        config.headers = {
            ...config.headers,
            'X-App-Name': AppConfig.app.name,
            'X-App-Version': AppConfig.app.version,
            'X-Platform': 'web',
            'X-Device-Id': APIInterceptors.getDeviceId()
        };
        
        return config;
    },
    /**
     * Log request
     * @param {object} config - Request config
     * @returns {object} - Config
     */
    logRequest(config) {
        if (AppConfig.logging.logApi) {
            Logger.debug('🔄 API Request:', {
                method: config.method,
                url: config.url,
                data: config.data,
                headers: config.headers
            });
        }
        
        return config;
    },
    /**
     * Handle response
     * @param {object} response - Response object
     * @returns {object} - Response
     */
    handleResponse(response) {
        // Transform response if needed
        if (response.data && typeof response.data === 'object') {
            // Add metadata
            response.data._metadata = {
                status: response.status,
                timestamp: new Date().toISOString()
            };
        }
        
        return response;
    },
    /**
     * Log response
     * @param {object} response - Response object
     * @returns {object} - Response
     */
    logResponse(response) {
        if (AppConfig.logging.logApi) {
            Logger.debug('✅ API Response:', {
                status: response.status,
                data: response.data
            });
        }
        
        return response;
    },
    /**
     * Handle error
     * @param {Error} error - Error object
     * @returns {Error} - Error
     */
    handleError(error) {
        // Add user-friendly message
        if (error.status) {
            error.userMessage = ApiErrorMessages[error.status] || ApiErrorMessages.UNKNOWN_ERROR;
        } else if (error.isTimeout) {
            error.userMessage = ApiErrorMessages.TIMEOUT_ERROR;
        } else if (!navigator.onLine) {
            error.userMessage = ApiErrorMessages.NETWORK_ERROR;
        } else {
            error.userMessage = ApiErrorMessages.UNKNOWN_ERROR;
        }
        
        return error;
    },
    /**
     * Handle unauthorized (401) responses
     * @param {Error} error - Error object
     * @returns {Error} - Error
     */
    handleUnauthorized(error) {
        if (error.status === HttpStatus.UNAUTHORIZED) {
            Logger.warn('⚠️ Unauthorized - clearing auth and redirecting to login');
            
            // Clear authentication
            localStorage.removeItem(StorageKeys.auth.token);
            localStorage.removeItem(StorageKeys.auth.refreshToken);
            localStorage.removeItem(StorageKeys.auth.tokenExpiry);
            
            // Redirect to login (will be handled by router)
            setTimeout(() => {
                if (typeof window !== 'undefined') {
                    // Router.navigate('/login');
                    window.location.href = '/login';
                }
            }, 100);
        }
        
        return error;
    },
    /**
     * Log error
     * @param {Error} error - Error object
     * @returns {Error} - Error
     */
    logError(error) {
        if (AppConfig.logging.logErrors) {
            Logger.error('❌ API Error:', {
                status: error.status,
                message: error.message,
                userMessage: error.userMessage,
                data: error.data
            });
        }
        
        return error;
    },
    /**
     * Get or create device ID
     * @returns {string} - Device ID
     */
    getDeviceId() {
        const key = 'modiva_device_id';
        let deviceId = localStorage.getItem(key);
        
        if (!deviceId) {
            deviceId = APIInterceptors.generateDeviceId();
            localStorage.setItem(key, deviceId);
        }
        
        return deviceId;
    },
    /**
     * Generate device ID
     * @returns {string} - Generated ID
     */
    generateDeviceId() {
        return 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    /**
     * Retry interceptor
     * @param {Error} error - Error object
     * @param {object} config - Request config
     * @returns {Promise} - Retry promise
     */
    async retry(error, config) {
        const retryConfig = AppConfig.performance.apiRetry;
        
        // Check if should retry
        if (!retryConfig.retryableStatuses.includes(error.status)) {
            throw error;
        }
        
        // Check retry count
        config._retryCount = config._retryCount || 0;
        if (config._retryCount >= retryConfig.maxAttempts) {
            throw error;
        }
        
        // Increment retry count
        config._retryCount++;
        
        // Calculate delay
        let delay = retryConfig.delay;
        if (retryConfig.backoff === 'exponential') {
            delay = delay * Math.pow(2, config._retryCount - 1);
        }
        
        Logger.info(`🔄 Retrying request (attempt ${config._retryCount}/${retryConfig.maxAttempts})...`);
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry request
        return config;
    }
};
/**
 * Request Interceptor Manager
 */
export class RequestInterceptorManager {
    constructor() {
        this.interceptors = [];
    }
    /**
     * Use interceptor
     * @param {Function} onFulfilled - Fulfilled handler
     * @param {Function} onRejected - Rejected handler
     * @returns {number} - Interceptor ID
     */
    use(onFulfilled, onRejected) {
        this.interceptors.push({
            fulfilled: onFulfilled,
            rejected: onRejected
        });
        return this.interceptors.length - 1;
    }
    /**
     * Eject interceptor
     * @param {number} id - Interceptor ID
     */
    eject(id) {
        if (this.interceptors[id]) {
            this.interceptors[id] = null;
        }
    }
    /**
     * Apply interceptors
     * @param {object} config - Request config
     * @returns {Promise<object>} - Modified config
     */
    async apply(config) {
        let chain = Promise.resolve(config);
        this.interceptors.forEach(interceptor => {
            if (interceptor !== null) {
                chain = chain.then(interceptor.fulfilled, interceptor.rejected);
            }
        });
        return chain;
    }
}
/**
 * Response Interceptor Manager
 */
export class ResponseInterceptorManager {
    constructor() {
        this.interceptors = [];
    }
    /**
     * Use interceptor
     * @param {Function} onFulfilled - Fulfilled handler
     * @param {Function} onRejected - Rejected handler
     * @returns {number} - Interceptor ID
     */
    use(onFulfilled, onRejected) {
        this.interceptors.push({
            fulfilled: onFulfilled,
            rejected: onRejected
        });
        return this.interceptors.length - 1;
    }
    /**
     * Eject interceptor
     * @param {number} id - Interceptor ID
     */
    eject(id) {
        if (this.interceptors[id]) {
            this.interceptors[id] = null;
        }
    }
    /**
     * Apply interceptors
     * @param {object} response - Response object
     * @returns {Promise<object>} - Modified response
     */
    async apply(response) {
        let chain = Promise.resolve(response);
        this.interceptors.forEach(interceptor => {
            if (interceptor !== null) {
                chain = chain.then(interceptor.fulfilled, interceptor.rejected);
            }
        });
        return chain;
    }
}
export default APIInterceptors;