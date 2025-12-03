/**
 * Modiva - API Configuration
 * API endpoints and HTTP configuration
 * @module config/api
 */
import { AppConfig } from './app.config.js';

/*
 * Base API URL
 */
export const API_BASE_URL = AppConfig.environment.apiUrl;

/*
 * API Version
 */
export const API_VERSION = 'v1';

/*
 * Use Mock API flag
 */
export const USE_MOCK_API = AppConfig.environment.useMockApi;

/*
 * API Endpoints Configuration
 */
export const ApiEndpoints = {
    // ============================================
    // AUTHENTICATION ENDPOINTS
    // ============================================
    auth: {
        // Student login
        loginSiswa: {
            method: 'POST',
            url: '/auth/login/siswa',
            timeout: 10000,
            requiresAuth: false
        },
        // Teacher login
        loginGuru: {
            method: 'POST',
            url: '/auth/login/guru',
            timeout: 10000,
            requiresAuth: false
        },
        // Admin login
        loginAdmin: {
            method: 'POST',
            url: '/auth/login/admin',
            timeout: 10000,
            requiresAuth: false
        },
        // Logout
        logout: {
            method: 'POST',
            url: '/auth/logout',
            timeout: 5000,
            requiresAuth: true
        },
        // Refresh token
        refreshToken: {
            method: 'POST',
            url: '/auth/refresh',
            timeout: 5000,
            requiresAuth: true
        },
        // Verify token
        verifyToken: {
            method: 'GET',
            url: '/auth/verify',
            timeout: 5000,
            requiresAuth: true
        },
        // Password reset request
        resetPassword: {
            method: 'POST',
            url: '/auth/reset-password',
            timeout: 10000,
            requiresAuth: false
        },
        // Change password
        changePassword: {
            method: 'PUT',
            url: '/auth/change-password',
            timeout: 10000,
            requiresAuth: true
        }
    },
    // ============================================
    // USER/PROFILE ENDPOINTS
    // ============================================
    user: {
        // Get current user profile
        getProfile: {
            method: 'GET',
            url: '/user/profile',
            timeout: 10000,
            requiresAuth: true
        },
        // Update profile
        updateProfile: {
            method: 'PUT',
            url: '/user/profile',
            timeout: 15000,
            requiresAuth: true
        },
        // Upload profile picture
        uploadAvatar: {
            method: 'POST',
            url: '/user/avatar',
            timeout: 30000,
            requiresAuth: true,
            contentType: 'multipart/form-data'
        },
        // Get user statistics
        getStatistics: {
            method: 'GET',
            url: '/user/statistics',
            timeout: 10000,
            requiresAuth: true
        },
        // Get user settings
        getSettings: {
            method: 'GET',
            url: '/user/settings',
            timeout: 5000,
            requiresAuth: true
        },
        // Update settings
        updateSettings: {
            method: 'PUT',
            url: '/user/settings',
            timeout: 5000,
            requiresAuth: true
        }
    },
    // ============================================
    // REPORT ENDPOINTS
    // ============================================
    reports: {
        // Submit new report
        submit: {
            method: 'POST',
            url: '/report/submit',
            timeout: 30000,
            requiresAuth: true,
            contentType: 'multipart/form-data'
        },
        // Get all reports
        getAll: {
            method: 'GET',
            url: '/reports',
            timeout: 10000,
            requiresAuth: true
        },
        // Get report by ID
        getById: {
            method: 'GET',
            url: '/reports/:id',
            timeout: 10000,
            requiresAuth: true
        },
        // Update report
        update: {
            method: 'PUT',
            url: '/reports/:id',
            timeout: 15000,
            requiresAuth: true
        },
        // Delete report
        delete: {
            method: 'DELETE',
            url: '/reports/:id',
            timeout: 10000,
            requiresAuth: true
        },
        // Get reports by date range
        getByDateRange: {
            method: 'GET',
            url: '/reports/range',
            timeout: 10000,
            requiresAuth: true
        },
        // Get report statistics
        getStatistics: {
            method: 'GET',
            url: '/reports/statistics',
            timeout: 10000,
            requiresAuth: true
        }
    },
    // ============================================
    // HEMOGLOBIN (HB) ENDPOINTS
    // ============================================
    hemoglobin: {
        // Get HB trends
        getTrends: {
            method: 'GET',
            url: '/hb/trends',
            timeout: 10000,
            requiresAuth: true
        },
        // Get HB by period
        getByPeriod: {
            method: 'GET',
            url: '/hb/period',
            timeout: 10000,
            requiresAuth: true
        },
        // Get latest HB value
        getLatest: {
            method: 'GET',
            url: '/hb/latest',
            timeout: 5000,
            requiresAuth: true
        },
        // Get HB statistics
        getStatistics: {
            method: 'GET',
            url: '/hb/statistics',
            timeout: 10000,
            requiresAuth: true
        },
        // Get HB history
        getHistory: {
            method: 'GET',
            url: '/hb/history',
            timeout: 10000,
            requiresAuth: true
        }
    },
    // ============================================
    // VITAMIN CONSUMPTION ENDPOINTS
    // ============================================
    vitamin: {
        // Get consumption data
        getConsumption: {
            method: 'GET',
            url: '/vitamin/consumption',
            timeout: 10000,
            requiresAuth: true
        },
        // Get consumption by period
        getByPeriod: {
            method: 'GET',
            url: '/vitamin/consumption/period',
            timeout: 10000,
            requiresAuth: true
        },
        // Get consumption statistics
        getStatistics: {
            method: 'GET',
            url: '/vitamin/statistics',
            timeout: 10000,
            requiresAuth: true
        },
        // Get target progress
        getTargetProgress: {
            method: 'GET',
            url: '/vitamin/target-progress',
            timeout: 5000,
            requiresAuth: true
        }
    },
    // ============================================
    // NOTIFICATION ENDPOINTS
    // ============================================
    notifications: {
        // Get all notifications
        getAll: {
            method: 'GET',
            url: '/notifications',
            timeout: 10000,
            requiresAuth: true
        },
        // Get unread notifications
        getUnread: {
            method: 'GET',
            url: '/notifications/unread',
            timeout: 5000,
            requiresAuth: true
        },
        // Mark as read
        markAsRead: {
            method: 'PUT',
            url: '/notifications/:id/read',
            timeout: 5000,
            requiresAuth: true
        },
        // Mark all as read
        markAllAsRead: {
            method: 'PUT',
            url: '/notifications/read-all',
            timeout: 5000,
            requiresAuth: true
        },
        // Delete notification
        delete: {
            method: 'DELETE',
            url: '/notifications/:id',
            timeout: 5000,
            requiresAuth: true
        },
        // Delete all notifications
        deleteAll: {
            method: 'DELETE',
            url: '/notifications/all',
            timeout: 5000,
            requiresAuth: true
        },
        // Update notification settings
        updateSettings: {
            method: 'PUT',
            url: '/notifications/settings',
            timeout: 5000,
            requiresAuth: true
        }
    },
    // ============================================
    // HEALTH TIPS ENDPOINTS
    // ============================================
    healthTips: {
        // Get all health tips
        getAll: {
            method: 'GET',
            url: '/health-tips',
            timeout: 10000,
            requiresAuth: false
        },
        // Get health tip by ID
        getById: {
            method: 'GET',
            url: '/health-tips/:id',
            timeout: 10000,
            requiresAuth: false
        },
        // Get health tip by category
        getByCategory: {
            method: 'GET',
            url: '/health-tips/category/:category',
            timeout: 10000,
            requiresAuth: false
        },
        // Get featured health tips
        getFeatured: {
            method: 'GET',
            url: '/health-tips/featured',
            timeout: 10000,
            requiresAuth: false
        }
    },
    // ============================================
    // SCHOOL ENDPOINTS
    // ============================================
    school: {
        // Get school info
        getInfo: {
            method: 'GET',
            url: '/school/:schoolId',
            timeout: 10000,
            requiresAuth: true
        },
        // Get school statistics
        getStatistics: {
            method: 'GET',
            url: '/school/:schoolId/statistics',
            timeout: 10000,
            requiresAuth: true
        },
        // Get school students
        getStudents: {
            method: 'GET',
            url: '/school/:schoolId/students',
            timeout: 10000,
            requiresAuth: true
        }
    },
    // ============================================
    // FILE UPLOAD ENDPOINTS
    // ============================================
    upload: {
        // Upload image
        image: {
            method: 'POST',
            url: '/upload/image',
            timeout: 30000,
            requiresAuth: true,
            contentType: 'multipart/form-data'
        },
        // Upload document
        document: {
            method: 'POST',
            url: '/upload/document',
            timeout: 60000,
            requiresAuth: true,
            contentType: 'multipart/form-data'
        }
    },
    // ============================================
    // ANALYTICS ENDPOINTS
    // ============================================
    analytics: {
        // Track event
        trackEvent: {
            method: 'POST',
            url: '/analytics/event',
            timeout: 5000,
            requiresAuth: true
        },
        // Get user analytics
        getUserAnalytics: {
            method: 'GET',
            url: '/analytics/user',
            timeout: 10000,
            requiresAuth: true
        }
    }
};

/**
 * HTTP Status Codes
 */
export const HttpStatus = {
    // Success
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    // Redirection
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    NOT_MODIFIED: 304,
    // Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    PAYLOAD_TOO_LARGE: 413,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    // Server Errors
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
};

/**
 * HTTP Headers Configuration
 */
export const HttpHeaders = {
    // Default headers
    default: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    // Auth headers
    auth: (token) => ({
        'Authorization': `Bearer ${token}`
    }),
    // Multipart headers
    multipart: {
        'Content-Type': 'multipart/form-data'
    },
    // Custom headers
    custom: {
        'X-App-Name': 'Modiva',
        'X-App-Version': AppConfig.app.version,
        'X-Platform': 'web'
    }
};

/**
 * API Request Configuration
 */
export const ApiRequestConfig = {
    // Default timeout
    timeout: 10000,
    // Retry configuration
    retry: {
        maxAttempts: AppConfig.performance.apiRetry.maxAttempts,
        delay: AppConfig.performance.apiRetry.delay,
        backoff: AppConfig.performance.apiRetry.backoff,
        retryableStatuses: [408, 429, 500, 502, 503, 504]
    },
    // Cache configuration
    cache: {
        enabled: true,
        duration: AppConfig.performance.cacheDuration,
        exclude: ['POST', 'PUT', 'DELETE', 'PATCH']
    },
    // Request transformation
    transformRequest: true,
    transformResponse: true,
    // Validation
    validateStatus: (status) => status >= 200 && status < 300
};

/**
 * API Error Messages
 */
export const ApiErrorMessages = {
    [HttpStatus.BAD_REQUEST]: 'Permintaan tidak valid',
    [HttpStatus.UNAUTHORIZED]: 'Sesi telah berakhir. Silakan login kembali',
    [HttpStatus.FORBIDDEN]: 'Anda tidak memiliki akses ke sumber daya ini',
    [HttpStatus.NOT_FOUND]: 'Data tidak ditemukan',
    [HttpStatus.METHOD_NOT_ALLOWED]: 'Metode tidak diizinkan',
    [HttpStatus.CONFLICT]: 'Data konflik dengan data yang ada',
    [HttpStatus.PAYLOAD_TOO_LARGE]: 'Ukuran file terlalu besar',
    [HttpStatus.UNPROCESSABLE_ENTITY]: 'Data tidak dapat diproses',
    [HttpStatus.TOO_MANY_REQUESTS]: 'Terlalu banyak permintaan. Coba lagi nanti',
    [HttpStatus.INTERNAL_SERVER_ERROR]: 'Terjadi kesalahan server',
    [HttpStatus.SERVICE_UNAVAILABLE]: 'Layanan tidak tersedia saat ini',
    [HttpStatus.GATEWAY_TIMEOUT]: 'Waktu permintaan habis',
    // Network errors
    NETWORK_ERROR: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda',
    TIMEOUT_ERROR: 'Permintaan memakan waktu terlalu lama',
    UNKNOWN_ERROR: 'Terjadi kesalahan tidak terduga'
};

/**
 * Mock API Delay (for development)
 */
export const MOCK_API_DELAY = 1000; // 1 second

/*
 * Helper function to build endpoint URL
 * @param {string} endpoint - Endpoint path
 * @param {object} params - URL parameters
 * @returns {string} - Full URL
 */
export function buildEndpointUrl(endpoint, params = {}) {
    let url = `${API_BASE_URL}${endpoint}`;
    // Replace URL parameters
    Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, params[key]);
    });
    return url;
}

/**
 * Helper function to build query string
 * @param {object} params - Query parameters
 * @returns {string} - Query string
 */
export function buildQueryString(params = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
            queryParams.append(key, params[key]);
        }
    });
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
}

// Freeze configuration
Object.freeze(ApiEndpoints);
Object.freeze(HttpStatus);
Object.freeze(HttpHeaders.default);
Object.freeze(HttpHeaders.multipart);
Object.freeze(HttpHeaders.custom);
Object.freeze(ApiRequestConfig);
Object.freeze(ApiErrorMessages);

export default ApiEndpoints;