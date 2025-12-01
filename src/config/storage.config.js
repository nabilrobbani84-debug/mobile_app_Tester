/**
 * Modiva - Storage Configuration
 * LocalStorage and SessionStorage keys configuration
 * @module config/storage
 */
/**
 * Storage Key Prefix
 * All storage keys will be prefixed with this
 */
export const STORAGE_PREFIX = 'modiva_';
/**
 * Storage Types
 */
export const StorageType = {
    LOCAL: 'localStorage',
    SESSION: 'sessionStorage',
    MEMORY: 'memory'
};
/**
 * Storage Keys Configuration
 */
export const StorageKeys = {
    // ============================================
    // AUTHENTICATION KEYS
    // ============================================
    auth: {
        // Authentication token
        token: `${STORAGE_PREFIX}auth_token`,
        
        // Refresh token
        refreshToken: `${STORAGE_PREFIX}refresh_token`,
        
        // Token expiry time
        tokenExpiry: `${STORAGE_PREFIX}token_expiry`,
        
        // Remember me flag
        rememberMe: `${STORAGE_PREFIX}remember_me`,
        
        // Last login timestamp
        lastLogin: `${STORAGE_PREFIX}last_login`,
        
        // Login attempts
        loginAttempts: `${STORAGE_PREFIX}login_attempts`,
        
        // Session ID
        sessionId: `${STORAGE_PREFIX}session_id`
    },
    // ============================================
    // USER DATA KEYS
    // ============================================
    user: {
        // User profile data
        profile: `${STORAGE_PREFIX}user_profile`,
        
        // User ID
        id: `${STORAGE_PREFIX}user_id`,
        
        // User role
        role: `${STORAGE_PREFIX}user_role`,
        
        // User preferences
        preferences: `${STORAGE_PREFIX}user_preferences`,
        
        // User settings
        settings: `${STORAGE_PREFIX}user_settings`,
        
        // User avatar URL
        avatar: `${STORAGE_PREFIX}user_avatar`,
        
        // User statistics
        statistics: `${STORAGE_PREFIX}user_statistics`,
        
        // User activity log
        activityLog: `${STORAGE_PREFIX}user_activity_log`
    },
    // ============================================
    // REPORTS DATA KEYS
    // ============================================
    reports: {
        // All reports cache
        all: `${STORAGE_PREFIX}reports_all`,
        
        // Reports by date
        byDate: `${STORAGE_PREFIX}reports_by_date`,
        
        // Draft reports
        drafts: `${STORAGE_PREFIX}reports_drafts`,
        
        // Reports filters
        filters: `${STORAGE_PREFIX}reports_filters`,
        
        // Last report timestamp
        lastReport: `${STORAGE_PREFIX}last_report`,
        
        // Reports statistics
        statistics: `${STORAGE_PREFIX}reports_statistics`,
        
        // Reports cache timestamp
        cacheTimestamp: `${STORAGE_PREFIX}reports_cache_timestamp`
    },
    // ============================================
    // HEMOGLOBIN DATA KEYS
    // ============================================
    hemoglobin: {
        // HB trends data
        trends: `${STORAGE_PREFIX}hb_trends`,
        
        // Latest HB value
        latest: `${STORAGE_PREFIX}hb_latest`,
        
        // HB history
        history: `${STORAGE_PREFIX}hb_history`,
        
        // HB statistics
        statistics: `${STORAGE_PREFIX}hb_statistics`,
        
        // HB cache timestamp
        cacheTimestamp: `${STORAGE_PREFIX}hb_cache_timestamp`
    },
    // ============================================
    // VITAMIN CONSUMPTION KEYS
    // ============================================
    vitamin: {
        // Consumption data
        consumption: `${STORAGE_PREFIX}vitamin_consumption`,
        
        // Consumption count
        count: `${STORAGE_PREFIX}vitamin_count`,
        
        // Target progress
        targetProgress: `${STORAGE_PREFIX}vitamin_target_progress`,
        
        // Consumption statistics
        statistics: `${STORAGE_PREFIX}vitamin_statistics`,
        
        // Consumption cache timestamp
        cacheTimestamp: `${STORAGE_PREFIX}vitamin_cache_timestamp`
    },
    // ============================================
    // NOTIFICATIONS KEYS
    // ============================================
    notifications: {
        // All notifications
        all: `${STORAGE_PREFIX}notifications_all`,
        
        // Unread notifications
        unread: `${STORAGE_PREFIX}notifications_unread`,
        
        // Unread count
        unreadCount: `${STORAGE_PREFIX}notifications_unread_count`,
        
        // Notification settings
        settings: `${STORAGE_PREFIX}notifications_settings`,
        
        // Last notification timestamp
        lastNotification: `${STORAGE_PREFIX}last_notification`,
        
        // Push subscription
        pushSubscription: `${STORAGE_PREFIX}push_subscription`,
        
        // Notification cache timestamp
        cacheTimestamp: `${STORAGE_PREFIX}notifications_cache_timestamp`
    },
    // ============================================
    // APP STATE KEYS
    // ============================================
    appState: {
        // Current screen/route
        currentScreen: `${STORAGE_PREFIX}current_screen`,
        
        // Navigation history
        navigationHistory: `${STORAGE_PREFIX}navigation_history`,
        
        // App version
        version: `${STORAGE_PREFIX}app_version`,
        
        // First launch flag
        firstLaunch: `${STORAGE_PREFIX}first_launch`,
        
        // Last active timestamp
        lastActive: `${STORAGE_PREFIX}last_active`,
        
        // App state
        state: `${STORAGE_PREFIX}app_state`,
        
        // Onboarding completed
        onboardingCompleted: `${STORAGE_PREFIX}onboarding_completed`,
        
        // Tutorial completed
        tutorialCompleted: `${STORAGE_PREFIX}tutorial_completed`
    },
    // ============================================
    // UI STATE KEYS
    // ============================================
    ui: {
        // Theme (light/dark)
        theme: `${STORAGE_PREFIX}ui_theme`,
        
        // Language
        language: `${STORAGE_PREFIX}ui_language`,
        
        // Font size
        fontSize: `${STORAGE_PREFIX}ui_font_size`,
        
        // Bottom tab active
        bottomTabActive: `${STORAGE_PREFIX}ui_bottom_tab_active`,
        
        // Sidebar state
        sidebarState: `${STORAGE_PREFIX}ui_sidebar_state`,
        
        // Modal state
        modalState: `${STORAGE_PREFIX}ui_modal_state`,
        
        // Drawer state
        drawerState: `${STORAGE_PREFIX}ui_drawer_state`
    },
    // ============================================
    // CACHE KEYS
    // ============================================
    cache: {
        // API response cache
        apiResponses: `${STORAGE_PREFIX}cache_api_responses`,
        
        // Images cache
        images: `${STORAGE_PREFIX}cache_images`,
        
        // Health tips cache
        healthTips: `${STORAGE_PREFIX}cache_health_tips`,
        
        // School data cache
        schoolData: `${STORAGE_PREFIX}cache_school_data`,
        
        // Cache metadata
        metadata: `${STORAGE_PREFIX}cache_metadata`
    },
    // ============================================
    // FORM DATA KEYS
    // ============================================
    forms: {
        // Report form draft
        reportDraft: `${STORAGE_PREFIX}form_report_draft`,
        
        // Profile form draft
        profileDraft: `${STORAGE_PREFIX}form_profile_draft`,
        
        // Login form data (NISN, School ID)
        loginData: `${STORAGE_PREFIX}form_login_data`,
        
        // Last form submission
        lastSubmission: `${STORAGE_PREFIX}form_last_submission`
    },
    // ============================================
    // OFFLINE DATA KEYS
    // ============================================
    offline: {
        // Pending requests
        pendingRequests: `${STORAGE_PREFIX}offline_pending_requests`,
        
        // Offline queue
        queue: `${STORAGE_PREFIX}offline_queue`,
        
        // Last sync timestamp
        lastSync: `${STORAGE_PREFIX}offline_last_sync`,
        
        // Sync status
        syncStatus: `${STORAGE_PREFIX}offline_sync_status`,
        
        // Offline mode flag
        isOffline: `${STORAGE_PREFIX}offline_is_offline`
    },
    // ============================================
    // ANALYTICS KEYS
    // ============================================
    analytics: {
        // Event queue
        eventQueue: `${STORAGE_PREFIX}analytics_event_queue`,
        
        // User analytics
        userAnalytics: `${STORAGE_PREFIX}analytics_user`,
        
        // Session analytics
        sessionAnalytics: `${STORAGE_PREFIX}analytics_session`,
        
        // Last event timestamp
        lastEvent: `${STORAGE_PREFIX}analytics_last_event`
    },
    // ============================================
    // FEATURE FLAGS KEYS
    // ============================================
    features: {
        // Enabled features
        enabled: `${STORAGE_PREFIX}features_enabled`,
        
        // Beta features
        beta: `${STORAGE_PREFIX}features_beta`,
        
        // Feature toggles
        toggles: `${STORAGE_PREFIX}features_toggles`
    },
    // ============================================
    // DEBUG KEYS
    // ============================================
    debug: {
        // Debug mode
        enabled: `${STORAGE_PREFIX}debug_enabled`,
        
        // Debug logs
        logs: `${STORAGE_PREFIX}debug_logs`,
        
        // Error logs
        errors: `${STORAGE_PREFIX}debug_errors`,
        
        // Performance metrics
        performance: `${STORAGE_PREFIX}debug_performance`
    }
};
/**
 * Storage Configuration
 */
export const StorageConfig = {
    // Default storage type
    defaultType: StorageType.LOCAL,
    
    // Encryption
    encryption: {
        enabled: false,
        algorithm: 'AES-256',
        key: null
    },
    
    // Compression
    compression: {
        enabled: false,
        threshold: 1024 // Compress if size > 1KB
    },
    
    // Expiration
    expiration: {
        enabled: true,
        defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
        cleanupInterval: 60 * 60 * 1000 // 1 hour
    },
    
    // Quota management
    quota: {
        maxSize: 5 * 1024 * 1024, // 5MB
        warningThreshold: 0.8, // 80%
        autoCleanup: true
    },
    
    // Serialization
    serialization: {
        method: 'JSON', // JSON, MessagePack
        prettyPrint: false
    }
};
/**
 * Storage Item Configuration
 */
export const StorageItemConfig = {
    // Auth token
    [StorageKeys.auth.token]: {
        type: StorageType.LOCAL,
        encrypted: true,
        ttl: 24 * 60 * 60 * 1000 // 24 hours
    },
    
    // User profile
    [StorageKeys.user.profile]: {
        type: StorageType.LOCAL,
        encrypted: false,
        ttl: 7 * 24 * 60 * 60 * 1000 // 7 days
    },
    
    // Reports cache
    [StorageKeys.reports.all]: {
        type: StorageType.LOCAL,
        encrypted: false,
        ttl: 5 * 60 * 1000, // 5 minutes
        compress: true
    },
    
    // Current screen
    [StorageKeys.appState.currentScreen]: {
        type: StorageType.SESSION,
        encrypted: false,
        ttl: null // Session only
    },
    
    // UI theme
    [StorageKeys.ui.theme]: {
        type: StorageType.LOCAL,
        encrypted: false,
        ttl: null // Never expires
    }
};
/**
 * Helper function to get full storage key
 * @param {string} key - Storage key
 * @returns {string} - Full storage key with prefix
 */
export function getStorageKey(key) {
    return key.startsWith(STORAGE_PREFIX) ? key : `${STORAGE_PREFIX}${key}`;
}
/**
 * Helper function to remove storage prefix
 * @param {string} key - Storage key with prefix
 * @returns {string} - Storage key without prefix
 */
export function removeStoragePrefix(key) {
    return key.replace(STORAGE_PREFIX, '');
}
/**
 * Helper function to get all storage keys
 * @returns {string[]} - Array of all storage keys
 */
export function getAllStorageKeys() {
    const keys = [];
    
    function extractKeys(obj, prefix = '') {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                extractKeys(obj[key], prefix);
            } else {
                keys.push(obj[key]);
            }
        }
    }
    
    extractKeys(StorageKeys);
    return keys;
}
/**
 * Helper function to clear all app storage
 */
export function clearAllAppStorage() {
    const allKeys = getAllStorageKeys();
    
    allKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    });
}
/**
 * Helper function to get storage size
 * @returns {number} - Total storage size in bytes
 */
export function getStorageSize() {
    let size = 0;
    
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith(STORAGE_PREFIX)) {
            size += localStorage[key].length + key.length;
        }
    }
    
    return size;
}
/**
 * Helper function to check if storage quota is exceeded
 * @returns {boolean} - True if quota exceeded
 */
export function isStorageQuotaExceeded() {
    const size = getStorageSize();
    const maxSize = StorageConfig.quota.maxSize;
    const threshold = StorageConfig.quota.warningThreshold;
    
    return size >= maxSize * threshold;
}
// Freeze configuration
Object.freeze(StorageKeys);
Object.freeze(StorageConfig);
Object.freeze(StorageItemConfig);
export default StorageKeys;