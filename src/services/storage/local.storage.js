/**
 * Modiva - LocalStorage Service
 * Wrapper around localStorage with additional features
 * @module services/storage/local-storage
 */
import { STORAGE_PREFIX, StorageKeys } from '../../config/storage.config.js';
import { Logger } from '../../utils/logger.js';
import { StorageService } from './storage.services.js';
/**
 * LocalStorage Service Class
 * Enhanced localStorage with expiration, compression, and encryption
 */
export class LocalStorageService extends StorageService {
    constructor() {
        super('localStorage');
        Logger.debug('LocalStorage service initialized');
    }
    getScopedKey(baseKey, scope = 'global') {
        return `${baseKey}:${scope || 'global'}`;
    }
    /**
     * Set authentication token
     * @param {string} token - JWT token
     * @param {number} expiresIn - Expiration time in milliseconds
     */
    setAuthToken(token, expiresIn = 24 * 60 * 60 * 1000) {
        const expiryTime = Date.now() + expiresIn;
        
        this.set(StorageKeys.auth.token, token, {
            ttl: expiresIn,
            encrypted: true
        });
        
        this.set(StorageKeys.auth.tokenExpiry, expiryTime);
        
        Logger.info('🔐 Auth token stored');
    }
    /**
     * Get authentication token
     * @returns {string|null}
     */
    getAuthToken() {
        return this.get(StorageKeys.auth.token);
    }
    /**
     * Remove authentication token
     */
    removeAuthToken() {
        this.remove(StorageKeys.auth.token);
        this.remove(StorageKeys.auth.refreshToken);
        this.remove(StorageKeys.auth.tokenExpiry);
        Logger.info('🔓 Auth token removed');
    }
    /**
     * Check if authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        const token = this.getAuthToken();
        const expiry = this.get(StorageKeys.auth.tokenExpiry);
        
        if (!token || !expiry) return false;
        
        return Date.now() < expiry;
    }
    /**
     * Set user profile
     * @param {object} user - User data
     */
    setUserProfile(user) {
        this.set(StorageKeys.user.profile, user, {
            ttl: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        Logger.debug('👤 User profile stored');
    }
    /**
     * Get user profile
     * @returns {object|null}
     */
    getUserProfile() {
        return this.get(StorageKeys.user.profile);
    }
    /**
     * Update user profile
     * @param {object} updates - Profile updates
     */
    updateUserProfile(updates) {
        const currentProfile = this.getUserProfile() || {};
        const updatedProfile = { ...currentProfile, ...updates };
        this.setUserProfile(updatedProfile);
        Logger.debug('👤 User profile updated');
    }
    /**
     * Remove user profile
     */
    removeUserProfile() {
        this.remove(StorageKeys.user.profile);
        Logger.debug('👤 User profile removed');
    }
    /**
     * Set reports cache
     * @param {array} reports - Reports array
     */
    setReportsCache(reports, userId = 'global') {
        const scopedKey = this.getScopedKey(StorageKeys.reports.all, userId);
        this.set(scopedKey, reports, {
            ttl: 5 * 60 * 1000, // 5 minutes
            compress: true
        });
        this.set(this.getScopedKey(StorageKeys.reports.cacheTimestamp, userId), Date.now());
        Logger.debug('📊 Reports cached');
    }
    /**
     * Get reports cache
     * @returns {array|null}
     */
    getReportsCache(userId = 'global') {
        return this.get(this.getScopedKey(StorageKeys.reports.all, userId));
    }
    /**
     * Clear reports cache
     */
    clearReportsCache(userId = null) {
        if (userId) {
            this.remove(this.getScopedKey(StorageKeys.reports.all, userId));
            this.remove(this.getScopedKey(StorageKeys.reports.cacheTimestamp, userId));
            Logger.debug('📊 Reports cache cleared');
            return;
        }

        this.keys()
            .filter((key) => key.startsWith(`${StorageKeys.reports.all}:`) || key.startsWith(`${StorageKeys.reports.cacheTimestamp}:`))
            .forEach((key) => this.remove(key));
        Logger.debug('📊 Reports cache cleared');
    }
    /**
     * Set HB trends cache
     * @param {object} trends - HB trends data
     */
    setHBTrendsCache(trends, userId = 'global') {
        const scopedKey = this.getScopedKey(StorageKeys.hemoglobin.trends, userId);
        this.set(scopedKey, trends, {
            ttl: 10 * 60 * 1000 // 10 minutes
        });
        this.set(this.getScopedKey(StorageKeys.hemoglobin.cacheTimestamp, userId), Date.now());
        Logger.debug('❤️ HB trends cached');
    }
    /**
     * Get HB trends cache
     * @returns {object|null}
     */
    getHBTrendsCache(userId = 'global') {
        return this.get(this.getScopedKey(StorageKeys.hemoglobin.trends, userId));
    }
    /**
     * Set notifications cache
     * @param {array} notifications - Notifications array
     */
    setNotificationsCache(notifications) {
        this.set(StorageKeys.notifications.all, notifications, {
            ttl: 2 * 60 * 1000 // 2 minutes
        });
        Logger.debug('🔔 Notifications cached');
    }
    /**
     * Get notifications cache
     * @returns {array|null}
     */
    getNotificationsCache() {
        return this.get(StorageKeys.notifications.all);
    }
    /**
     * Set unread notifications count
     * @param {number} count - Unread count
     */
    setUnreadNotificationsCount(count) {
        this.set(StorageKeys.notifications.unreadCount, count);
    }
    /**
     * Get unread notifications count
     * @returns {number}
     */
    getUnreadNotificationsCount() {
        return this.get(StorageKeys.notifications.unreadCount, 0);
    }
    /**
     * Set deleted notifications cache
     * @param {array} notifications - Notifications array
     */
    setDeletedNotifications(notifications) {
        this.set(StorageKeys.notifications.deleted, notifications);
    }
    /**
     * Get deleted notifications
     * @returns {array}
     */
    getDeletedNotifications() {
        return this.get(StorageKeys.notifications.deleted, []);
    }
    /**
     * Clear notifications cache and related counters
     */
    clearNotificationsCache() {
        this.remove(StorageKeys.notifications.all);
        this.remove(StorageKeys.notifications.unread);
        this.remove(StorageKeys.notifications.unreadCount);
        this.remove(StorageKeys.notifications.cacheTimestamp);
        this.remove(StorageKeys.notifications.lastNotification);
        this.remove(StorageKeys.notifications.deleted);
        Logger.debug('🔔 Notifications cache cleared');
    }
    /**
     * Add to deleted notifications
     * @param {object} notification - Notification object
     */
    addDeletedNotification(notification) {
        const deleted = this.getDeletedNotifications();
        deleted.push({
            ...notification,
            deletedAt: Date.now()
        });
        this.setDeletedNotifications(deleted);
        Logger.debug('🗑️ Notification archived');
    }
    /**
     * Set current screen
     * @param {string} screenId - Screen ID
     */
    setCurrentScreen(screenId) {
        this.set(StorageKeys.appState.currentScreen, screenId);
    }
    /**
     * Get current screen
     * @returns {string|null}
     */
    getCurrentScreen() {
        return this.get(StorageKeys.appState.currentScreen);
    }
    /**
     * Set navigation history
     * @param {array} history - Navigation history
     */
    setNavigationHistory(history) {
        this.set(StorageKeys.appState.navigationHistory, history);
    }
    /**
     * Get navigation history
     * @returns {array}
     */
    getNavigationHistory() {
        return this.get(StorageKeys.appState.navigationHistory, []);
    }
    /**
     * Set UI theme
     * @param {string} theme - Theme name (light/dark)
     */
    setTheme(theme) {
        this.set(StorageKeys.ui.theme, theme);
        Logger.debug(`🎨 Theme set to: ${theme}`);
    }
    /**
     * Get UI theme
     * @returns {string}
     */
    getTheme() {
        return this.get(StorageKeys.ui.theme, 'light');
    }
    /**
     * Set language
     * @param {string} language - Language code
     */
    setLanguage(language) {
        this.set(StorageKeys.ui.language, language);
        Logger.debug(`🌍 Language set to: ${language}`);
    }
    /**
     * Get language
     * @returns {string}
     */
    getLanguage() {
        return this.get(StorageKeys.ui.language, 'id');
    }
    /**
     * Set form draft
     * @param {string} formKey - Form key
     * @param {object} formData - Form data
     */
    setFormDraft(formKey, formData) {
        this.set(formKey, formData, {
            ttl: 24 * 60 * 60 * 1000 // 24 hours
        });
        Logger.debug(`📝 Form draft saved: ${formKey}`);
    }
    /**
     * Get form draft
     * @param {string} formKey - Form key
     * @returns {object|null}
     */
    getFormDraft(formKey) {
        return this.get(formKey);
    }
    /**
     * Clear form draft
     * @param {string} formKey - Form key
     */
    clearFormDraft(formKey) {
        this.remove(formKey);
        Logger.debug(`📝 Form draft cleared: ${formKey}`);
    }
    /**
     * Set offline queue
     * @param {array} queue - Offline queue
     */
    setOfflineQueue(queue) {
        this.set(StorageKeys.offline.queue, queue);
        Logger.debug(`📴 Offline queue updated (${queue.length} items)`);
    }
    /**
     * Get offline queue
     * @returns {array}
     */
    getOfflineQueue() {
        return this.get(StorageKeys.offline.queue, []);
    }
    /**
     * Add to offline queue
     * @param {object} request - Request object
     */
    addToOfflineQueue(request) {
        const queue = this.getOfflineQueue();
        queue.push({
            ...request,
            timestamp: Date.now()
        });
        this.setOfflineQueue(queue);
    }
    /**
     * Clear offline queue
     */
    clearOfflineQueue() {
        this.remove(StorageKeys.offline.queue);
        Logger.debug('📴 Offline queue cleared');
    }
    /**
     * Clear all app data (logout)
     */
    clearAppData() {
        this.removeAuthToken();
        this.removeUserProfile();
        this.clearReportsCache();
        this.clearNotificationsCache();
        this.clearOfflineQueue();
        this.clearFormDraft(StorageKeys.forms.reportDraft);
        this.remove(StorageKeys.hemoglobin.latest);
        this.remove(StorageKeys.hemoglobin.history);
        this.remove(StorageKeys.hemoglobin.statistics);
        
        Logger.info('🗑️ All app data cleared');
    }
    /**
     * Get storage statistics
     * @returns {object}
     */
    getStatistics() {
        const info = this.getInfo();
        const keys = this.keys();
        const appKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));
        
        return {
            ...info,
            totalKeys: keys.length,
            appKeys: appKeys.length,
            authenticated: this.isAuthenticated(),
            hasUserProfile: this.has(StorageKeys.user.profile),
            unreadNotifications: this.getUnreadNotificationsCount(),
            offlineQueueSize: this.getOfflineQueue().length
        };
    }
    /**
     * Export all app data
     * @returns {object}
     */
    exportAppData() {
        const keys = this.keys().filter(key => key.startsWith(STORAGE_PREFIX));
        const data = {};
        
        keys.forEach(key => {
            data[key] = this.get(key);
        });
        
        Logger.info('📤 App data exported');
        return data;
    }
    /**
     * Import app data
     * @param {object} data - Data to import
     */
    importAppData(data) {
        Object.keys(data).forEach(key => {
            this.set(key, data[key]);
        });
        
        Logger.info('📥 App data imported');
    }
}
/**
 * Create singleton instance
 */
export const localStorageService = new LocalStorageService();
export default localStorageService;
