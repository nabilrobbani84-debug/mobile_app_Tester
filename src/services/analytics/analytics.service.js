/**
 * Modiva - Analytics Service
 * Track user events, page views, and application usage
 * @module services/analytics/analytics.service
 */
import { AppConfig } from '../../config/app.config.js';
import { Logger } from '../../utils/logger.js';
/**
 * Event Types
 */
export const EventTypes = {
    // User actions
    USER_LOGIN: 'user_login',
    USER_LOGOUT: 'user_logout',
    USER_SIGNUP: 'user_signup',
    
    // Page views
    PAGE_VIEW: 'page_view',
    SCREEN_VIEW: 'screen_view',
    
    // Report actions
    REPORT_SUBMIT: 'report_submit',
    REPORT_VIEW: 'report_view',
    REPORT_EDIT: 'report_edit',
    REPORT_DELETE: 'report_delete',
    
    // Photo actions
    PHOTO_UPLOAD: 'photo_upload',
    PHOTO_COMPRESS: 'photo_compress',
    
    // Notification actions
    NOTIFICATION_VIEW: 'notification_view',
    NOTIFICATION_CLICK: 'notification_click',
    NOTIFICATION_DISMISS: 'notification_dismiss',
    
    // Profile actions
    PROFILE_VIEW: 'profile_view',
    PROFILE_EDIT: 'profile_edit',
    
    // Navigation
    NAVIGATION: 'navigation',
    TAB_CHANGE: 'tab_change',
    
    // Health tips
    HEALTH_TIP_VIEW: 'health_tip_view',
    HEALTH_TIP_SHARE: 'health_tip_share',
    
    // Errors
    ERROR_OCCURRED: 'error_occurred',
    API_ERROR: 'api_error',
    VALIDATION_ERROR: 'validation_error',
    
    // Performance
    PERFORMANCE_METRIC: 'performance_metric',
    
    // Engagement
    BUTTON_CLICK: 'button_click',
    LINK_CLICK: 'link_click',
    FORM_SUBMIT: 'form_submit',
    
    // PWA
    PWA_INSTALL: 'pwa_install',
    PWA_SHARE: 'pwa_share',
    
    // Custom
    CUSTOM_EVENT: 'custom_event'
};
/**
 * Event Categories
 */
export const EventCategories = {
    USER: 'User',
    NAVIGATION: 'Navigation',
    REPORT: 'Report',
    NOTIFICATION: 'Notification',
    PROFILE: 'Profile',
    ERROR: 'Error',
    PERFORMANCE: 'Performance',
    ENGAGEMENT: 'Engagement',
    HEALTH: 'Health',
    PWA: 'PWA'
};
/**
 * Analytics Event Interface
 */
class AnalyticsEvent {
    constructor(type, data = {}) {
        this.type = type;
        this.category = this.getCategoryFromType(type);
        this.data = data;
        this.timestamp = Date.now();
        this.sessionId = this.getSessionId();
        this.userId = this.getUserId();
        this.userAgent = navigator.userAgent;
        this.url = window.location.href;
        this.referrer = document.referrer;
    }
    getCategoryFromType(type) {
        if (type.startsWith('user_')) return EventCategories.USER;
        if (type.startsWith('page_') || type.startsWith('screen_') || type.startsWith('navigation') || type.startsWith('tab_')) return EventCategories.NAVIGATION;
        if (type.startsWith('report_') || type.startsWith('photo_')) return EventCategories.REPORT;
        if (type.startsWith('notification_')) return EventCategories.NOTIFICATION;
        if (type.startsWith('profile_')) return EventCategories.PROFILE;
        if (type.startsWith('error_') || type.includes('error')) return EventCategories.ERROR;
        if (type.startsWith('performance_')) return EventCategories.PERFORMANCE;
        if (type.startsWith('health_')) return EventCategories.HEALTH;
        if (type.startsWith('pwa_')) return EventCategories.PWA;
        return EventCategories.ENGAGEMENT;
    }
    getSessionId() {
        let sessionId = sessionStorage.getItem('modiva_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('modiva_session_id', sessionId);
        }
        return sessionId;
    }
    getUserId() {
        try {
            const authData = localStorage.getItem('modiva_auth');
            if (authData) {
                const parsed = JSON.parse(authData);
                return parsed.user?.id || null;
            }
        } catch (e) {
            // Ignore
        }
        return null;
    }
    toJSON() {
        return {
            type: this.type,
            category: this.category,
            data: this.data,
            timestamp: this.timestamp,
            sessionId: this.sessionId,
            userId: this.userId,
            userAgent: this.userAgent,
            url: this.url,
            referrer: this.referrer
        };
    }
}
/**
 * Analytics Service Class
 */
export class AnalyticsService {
    constructor() {
        this.enabled = AppConfig.analytics.enabled;
        this.providers = AppConfig.analytics.providers;
        this.queue = [];
        this.maxQueueSize = 100;
        this.flushInterval = 30000; // 30 seconds
        this.sessionStartTime = Date.now();
        
        if (this.enabled) {
            this.initialize();
        }
    }
    /**
     * Initialize analytics service
     */
    initialize() {
        Logger.info('📊 Initializing Analytics Service...');
        // Initialize Google Analytics
        if (this.providers.googleAnalytics.enabled) {
            this.initializeGoogleAnalytics();
        }
        // Initialize Sentry
        if (this.providers.sentry.enabled) {
            this.initializeSentry();
        }
        // Start auto-flush
        this.startAutoFlush();
        // Track session start
        this.trackEvent(EventTypes.PAGE_VIEW, {
            page: 'app_start',
            sessionStart: true
        });
        Logger.success('✅ Analytics Service initialized');
    }
    /**
     * Initialize Google Analytics
     */
    initializeGoogleAnalytics() {
        const trackingId = this.providers.googleAnalytics.trackingId;
        
        if (!trackingId || trackingId === 'GA_MEASUREMENT_ID') {
            Logger.warn('⚠️ Google Analytics tracking ID not configured');
            return;
        }
        // Load GA script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        document.head.appendChild(script);
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            window.dataLayer.push(arguments);
        }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', trackingId, {
            send_page_view: false // We'll handle page views manually
        });
        Logger.success('✅ Google Analytics initialized');
    }
    /**
     * Initialize Sentry
     */
    initializeSentry() {
        const dsn = this.providers.sentry.dsn;
        
        if (!dsn || dsn === 'SENTRY_DSN') {
            Logger.warn('⚠️ Sentry DSN not configured');
            return;
        }
        // In production, you would load Sentry SDK here
        Logger.success('✅ Sentry initialized (mock)');
    }
    /**
     * Track event
     * @param {string} eventType - Event type
     * @param {object} data - Event data
     */
    trackEvent(eventType, data = {}) {
        if (!this.enabled) return;
        const event = new AnalyticsEvent(eventType, data);
        
        Logger.debug('📊 Analytics Event:', event.toJSON());
        // Add to queue
        this.addToQueue(event);
        // Send to providers
        this.sendToProviders(event);
    }
    /**
     * Track page view
     * @param {string} pageName - Page name
     * @param {object} data - Additional data
     */
    trackPageView(pageName, data = {}) {
        this.trackEvent(EventTypes.PAGE_VIEW, {
            page: pageName,
            ...data
        });
    }
    /**
     * Track screen view
     * @param {string} screenName - Screen name
     * @param {object} data - Additional data
     */
    trackScreenView(screenName, data = {}) {
        this.trackEvent(EventTypes.SCREEN_VIEW, {
            screen: screenName,
            ...data
        });
    }
    /**
     * Track user action
     * @param {string} action - Action name
     * @param {string} label - Action label
     * @param {number} value - Action value
     */
    trackAction(action, label = '', value = null) {
        this.trackEvent(EventTypes.BUTTON_CLICK, {
            action,
            label,
            value
        });
    }
    /**
     * Track error
     * @param {Error} error - Error object
     * @param {object} context - Error context
     */
    trackError(error, context = {}) {
        this.trackEvent(EventTypes.ERROR_OCCURRED, {
            message: error.message,
            stack: error.stack,
            name: error.name,
            ...context
        });
        // Send to Sentry if enabled
        if (this.providers.sentry.enabled && window.Sentry) {
            window.Sentry.captureException(error, { extra: context });
        }
    }
    /**
     * Track performance metric
     * @param {string} metricName - Metric name
     * @param {number} value - Metric value
     * @param {object} data - Additional data
     */
    trackPerformance(metricName, value, data = {}) {
        this.trackEvent(EventTypes.PERFORMANCE_METRIC, {
            metric: metricName,
            value,
            ...data
        });
    }
    /**
     * Track timing
     * @param {string} category - Timing category
     * @param {string} variable - Timing variable
     * @param {number} time - Time in ms
     */
    trackTiming(category, variable, time) {
        this.trackEvent(EventTypes.PERFORMANCE_METRIC, {
            category,
            variable,
            time
        });
        // Send to Google Analytics
        if (this.providers.googleAnalytics.enabled && window.gtag) {
            window.gtag('event', 'timing_complete', {
                name: variable,
                value: time,
                event_category: category
            });
        }
    }
    /**
     * Set user properties
     * @param {object} properties - User properties
     */
    setUserProperties(properties) {
        if (!this.enabled) return;
        Logger.debug('📊 Set User Properties:', properties);
        // Google Analytics
        if (this.providers.googleAnalytics.enabled && window.gtag) {
            window.gtag('set', 'user_properties', properties);
        }
        // Sentry
        if (this.providers.sentry.enabled && window.Sentry) {
            window.Sentry.setUser(properties);
        }
    }
    /**
     * Set user ID
     * @param {string} userId - User ID
     */
    setUserId(userId) {
        this.setUserProperties({ user_id: userId });
    }
    /**
     * Add event to queue
     * @param {AnalyticsEvent} event - Event object
     */
    addToQueue(event) {
        this.queue.push(event.toJSON());
        // Limit queue size
        if (this.queue.length > this.maxQueueSize) {
            this.queue.shift();
        }
        // Save to localStorage
        this.saveQueue();
    }
    /**
     * Send event to providers
     * @param {AnalyticsEvent} event - Event object
     */
    sendToProviders(event) {
        // Google Analytics
        if (this.providers.googleAnalytics.enabled && window.gtag) {
            window.gtag('event', event.type, {
                event_category: event.category,
                event_label: JSON.stringify(event.data),
                value: event.data.value || 0
            });
        }
    }
    /**
     * Flush queue
     */
    async flushQueue() {
        if (this.queue.length === 0) return;
        Logger.debug(`📊 Flushing analytics queue (${this.queue.length} events)`);
        // In production, send to analytics server
        // await fetch('/api/analytics/batch', {
        //     method: 'POST',
        //     body: JSON.stringify(this.queue)
        // });
        // Clear queue
        this.queue = [];
        this.saveQueue();
    }
    /**
     * Start auto-flush interval
     */
    startAutoFlush() {
        this.flushIntervalId = setInterval(() => {
            this.flushQueue();
        }, this.flushInterval);
    }
    /**
     * Stop auto-flush interval
     */
    stopAutoFlush() {
        if (this.flushIntervalId) {
            clearInterval(this.flushIntervalId);
            this.flushIntervalId = null;
        }
    }
    /**
     * Save queue to localStorage
     */
    saveQueue() {
        try {
            localStorage.setItem('modiva_analytics_queue', JSON.stringify(this.queue));
        } catch (e) {
            Logger.error('Failed to save analytics queue:', e);
        }
    }
    /**
     * Load queue from localStorage
     */
    loadQueue() {
        try {
            const saved = localStorage.getItem('modiva_analytics_queue');
            if (saved) {
                this.queue = JSON.parse(saved);
            }
        } catch (e) {
            Logger.error('Failed to load analytics queue:', e);
        }
    }
    /**
     * Get session duration
     * @returns {number} - Duration in ms
     */
    getSessionDuration() {
        return Date.now() - this.sessionStartTime;
    }
    /**
     * Get queue size
     * @returns {number}
     */
    getQueueSize() {
        return this.queue.length;
    }
    /**
     * Clear queue
     */
    clearQueue() {
        this.queue = [];
        this.saveQueue();
    }
    /**
     * Disable analytics
     */
    disable() {
        this.enabled = false;
        this.stopAutoFlush();
        Logger.info('📊 Analytics disabled');
    }
    /**
     * Enable analytics
     */
    enable() {
        this.enabled = true;
        this.startAutoFlush();
        Logger.info('📊 Analytics enabled');
    }
    /**
     * Get analytics info
     * @returns {object}
     */
    getInfo() {
        return {
            enabled: this.enabled,
            queueSize: this.queue.length,
            sessionDuration: this.getSessionDuration(),
            providers: {
                googleAnalytics: this.providers.googleAnalytics.enabled,
                sentry: this.providers.sentry.enabled
            }
        };
    }
}
/**
 * Create singleton instance
 */
export const analyticsService = new AnalyticsService();
// Freeze event types
Object.freeze(EventTypes);
Object.freeze(EventCategories);
export default analyticsService;