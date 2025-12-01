/**
 * Modiva - SessionStorage Service
 * Wrapper around sessionStorage for temporary data
 * @module services/storage/session-storage
 */
import { StorageService } from './storage.services.js';
import { Logger } from '../../utils/logger.js';
/**
 * SessionStorage Service Class
 * Enhanced sessionStorage for temporary session data
 */
export class SessionStorageService extends StorageService {
    constructor() {
        super('sessionStorage');
        Logger.debug('SessionStorage service initialized');
    }
    /**
     * Set current tab/screen
     * @param {string} tabId - Tab ID
     */
    setCurrentTab(tabId) {
        this.set('modiva_current_tab', tabId);
    }
    /**
     * Get current tab/screen
     * @returns {string|null}
     */
    getCurrentTab() {
        return this.get('modiva_current_tab');
    }
    /**
     * Set scroll position
     * @param {string} screenId - Screen ID
     * @param {number} position - Scroll position
     */
    setScrollPosition(screenId, position) {
        const key = `modiva_scroll_${screenId}`;
        this.set(key, position);
    }
    /**
     * Get scroll position
     * @param {string} screenId - Screen ID
     * @returns {number}
     */
    getScrollPosition(screenId) {
        const key = `modiva_scroll_${screenId}`;
        return this.get(key, 0);
    }
    /**
     * Set form state (for unsaved changes)
     * @param {string} formId - Form ID
     * @param {object} formState - Form state
     */
    setFormState(formId, formState) {
        const key = `modiva_form_state_${formId}`;
        this.set(key, formState);
        Logger.debug(`📝 Form state saved: ${formId}`);
    }
    /**
     * Get form state
     * @param {string} formId - Form ID
     * @returns {object|null}
     */
    getFormState(formId) {
        const key = `modiva_form_state_${formId}`;
        return this.get(key);
    }
    /**
     * Clear form state
     * @param {string} formId - Form ID
     */
    clearFormState(formId) {
        const key = `modiva_form_state_${formId}`;
        this.remove(key);
        Logger.debug(`📝 Form state cleared: ${formId}`);
    }
    /**
     * Set modal state
     * @param {string} modalId - Modal ID
     * @param {object} state - Modal state
     */
    setModalState(modalId, state) {
        const key = `modiva_modal_${modalId}`;
        this.set(key, state);
    }
    /**
     * Get modal state
     * @param {string} modalId - Modal ID
     * @returns {object|null}
     */
    getModalState(modalId) {
        const key = `modiva_modal_${modalId}`;
        return this.get(key);
    }
    /**
     * Clear modal state
     * @param {string} modalId - Modal ID
     */
    clearModalState(modalId) {
        const key = `modiva_modal_${modalId}`;
        this.remove(key);
    }
    /**
     * Set filter state
     * @param {string} filterId - Filter ID
     * @param {object} filters - Filter values
     */
    setFilterState(filterId, filters) {
        const key = `modiva_filter_${filterId}`;
        this.set(key, filters);
        Logger.debug(`🔍 Filter state saved: ${filterId}`);
    }
    /**
     * Get filter state
     * @param {string} filterId - Filter ID
     * @returns {object|null}
     */
    getFilterState(filterId) {
        const key = `modiva_filter_${filterId}`;
        return this.get(key);
    }
    /**
     * Clear filter state
     * @param {string} filterId - Filter ID
     */
    clearFilterState(filterId) {
        const key = `modiva_filter_${filterId}`;
        this.remove(key);
    }
    /**
     * Set search query
     * @param {string} searchId - Search ID
     * @param {string} query - Search query
     */
    setSearchQuery(searchId, query) {
        const key = `modiva_search_${searchId}`;
        this.set(key, query);
    }
    /**
     * Get search query
     * @param {string} searchId - Search ID
     * @returns {string}
     */
    getSearchQuery(searchId) {
        const key = `modiva_search_${searchId}`;
        return this.get(key, '');
    }
    /**
     * Clear search query
     * @param {string} searchId - Search ID
     */
    clearSearchQuery(searchId) {
        const key = `modiva_search_${searchId}`;
        this.remove(key);
    }
    /**
     * Set pagination state
     * @param {string} pageId - Page ID
     * @param {object} pagination - Pagination data
     */
    setPaginationState(pageId, pagination) {
        const key = `modiva_pagination_${pageId}`;
        this.set(key, pagination);
    }
    /**
     * Get pagination state
     * @param {string} pageId - Page ID
     * @returns {object|null}
     */
    getPaginationState(pageId) {
        const key = `modiva_pagination_${pageId}`;
        return this.get(key);
    }
    /**
     * Set sort state
     * @param {string} tableId - Table ID
     * @param {object} sort - Sort configuration
     */
    setSortState(tableId, sort) {
        const key = `modiva_sort_${tableId}`;
        this.set(key, sort);
    }
    /**
     * Get sort state
     * @param {string} tableId - Table ID
     * @returns {object|null}
     */
    getSortState(tableId) {
        const key = `modiva_sort_${tableId}`;
        return this.get(key);
    }
    /**
     * Set drawer/sidebar state
     * @param {string} drawerId - Drawer ID
     * @param {boolean} isOpen - Open state
     */
    setDrawerState(drawerId, isOpen) {
        const key = `modiva_drawer_${drawerId}`;
        this.set(key, isOpen);
    }
    /**
     * Get drawer/sidebar state
     * @param {string} drawerId - Drawer ID
     * @returns {boolean}
     */
    getDrawerState(drawerId) {
        const key = `modiva_drawer_${drawerId}`;
        return this.get(key, false);
    }
    /**
     * Set temporary data with auto-expiry
     * @param {string} key - Data key
     * @param {*} value - Data value
     * @param {number} ttl - Time to live in milliseconds
     */
    setTemporary(key, value, ttl = 5 * 60 * 1000) {
        const fullKey = `modiva_temp_${key}`;
        this.set(fullKey, value, { ttl });
    }
    /**
     * Get temporary data
     * @param {string} key - Data key
     * @returns {*}
     */
    getTemporary(key) {
        const fullKey = `modiva_temp_${key}`;
        return this.get(fullKey);
    }
    /**
     * Set navigation back data
     * @param {object} data - Data to pass back
     */
    setBackData(data) {
        this.set('modiva_back_data', data);
    }
    /**
     * Get navigation back data
     * @returns {object|null}
     */
    getBackData() {
        const data = this.get('modiva_back_data');
        this.remove('modiva_back_data'); // Clear after reading
        return data;
    }
    /**
     * Set redirect URL
     * @param {string} url - URL to redirect to
     */
    setRedirectUrl(url) {
        this.set('modiva_redirect_url', url);
    }
    /**
     * Get redirect URL
     * @returns {string|null}
     */
    getRedirectUrl() {
        const url = this.get('modiva_redirect_url');
        this.remove('modiva_redirect_url'); // Clear after reading
        return url;
    }
    /**
     * Set error state
     * @param {object} error - Error object
     */
    setErrorState(error) {
        this.set('modiva_error_state', {
            message: error.message,
            stack: error.stack,
            timestamp: Date.now()
        });
    }
    /**
     * Get error state
     * @returns {object|null}
     */
    getErrorState() {
        return this.get('modiva_error_state');
    }
    /**
     * Clear error state
     */
    clearErrorState() {
        this.remove('modiva_error_state');
    }
    /**
     * Set loading states
     * @param {object} loadingStates - Loading states object
     */
    setLoadingStates(loadingStates) {
        this.set('modiva_loading_states', loadingStates);
    }
    /**
     * Get loading states
     * @returns {object}
     */
    getLoadingStates() {
        return this.get('modiva_loading_states', {});
    }
    /**
     * Set loading state for specific key
     * @param {string} key - Loading key
     * @param {boolean} isLoading - Loading state
     */
    setLoading(key, isLoading) {
        const states = this.getLoadingStates();
        states[key] = isLoading;
        this.setLoadingStates(states);
    }
    /**
     * Get loading state for specific key
     * @param {string} key - Loading key
     * @returns {boolean}
     */
    isLoading(key) {
        const states = this.getLoadingStates();
        return states[key] || false;
    }
    /**
     * Clear all loading states
     */
    clearLoadingStates() {
        this.remove('modiva_loading_states');
    }
    /**
     * Get session statistics
     * @returns {object}
     */
    getStatistics() {
        const info = this.getInfo();
        const keys = this.keys();
        const modivaKeys = keys.filter(key => key.startsWith('modiva_'));
        
        return {
            ...info,
            totalKeys: keys.length,
            modivaKeys: modivaKeys.length,
            currentTab: this.getCurrentTab()
        };
    }
    /**
     * Clear all session data
     */
    clearSessionData() {
        this.clear();
        Logger.info('🗑️ Session data cleared');
    }
}
/**
 * Create singleton instance
 */
export const sessionStorageService = new SessionStorageService();
export default sessionStorageService;