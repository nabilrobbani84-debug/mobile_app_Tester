/**
 * Modiva - Central Store
 * Redux-like state management with actions and reducers
 * @module state/store
 */
import { getJSON, setJSON } from '../utils/helpers/storageHelpers.js';
import { Logger } from '../utils/logger.js';
import { AuthState } from './auth.state.js';
import { NotificationState } from './notification.state.js';
import { ReportState } from './report.state.js';
import { UIState } from './ui.state.js';
import { UserState } from './user.state.js';
/**
 * Action Types
 */
export const ActionTypes = {
    // Auth actions
    AUTH_LOGIN: 'AUTH_LOGIN',
    AUTH_LOGOUT: 'AUTH_LOGOUT',
    AUTH_SET_TOKEN: 'AUTH_SET_TOKEN',
    AUTH_REFRESH_TOKEN: 'AUTH_REFRESH_TOKEN',
    AUTH_UPDATE_SESSION: 'AUTH_UPDATE_SESSION',
    
    // User actions
    USER_SET_PROFILE: 'USER_SET_PROFILE',
    USER_UPDATE_PROFILE: 'USER_UPDATE_PROFILE',
    USER_SET_PREFERENCES: 'USER_SET_PREFERENCES',
    USER_INCREMENT_CONSUMPTION: 'USER_INCREMENT_CONSUMPTION',
    USER_UPDATE_HB: 'USER_UPDATE_HB',
    
    // Report actions
    REPORT_ADD: 'REPORT_ADD',
    REPORT_SET_LIST: 'REPORT_SET_LIST',
    REPORT_UPDATE: 'REPORT_UPDATE',
    REPORT_DELETE: 'REPORT_DELETE',
    REPORT_SET_FILTER: 'REPORT_SET_FILTER',
    REPORT_SET_LOADING: 'REPORT_SET_LOADING',
    
    // Notification actions
    NOTIFICATION_SET_LIST: 'NOTIFICATION_SET_LIST',
    NOTIFICATION_ADD: 'NOTIFICATION_ADD',
    NOTIFICATION_MARK_READ: 'NOTIFICATION_MARK_READ',
    NOTIFICATION_MARK_ALL_READ: 'NOTIFICATION_MARK_ALL_READ',
    NOTIFICATION_DELETE: 'NOTIFICATION_DELETE',
    NOTIFICATION_SET_UNREAD_COUNT: 'NOTIFICATION_SET_UNREAD_COUNT',
    
    // UI actions
    UI_SET_LOADING: 'UI_SET_LOADING',
    UI_SHOW_MODAL: 'UI_SHOW_MODAL',
    UI_HIDE_MODAL: 'UI_HIDE_MODAL',
    UI_SHOW_TOAST: 'UI_SHOW_TOAST',
    UI_SET_THEME: 'UI_SET_THEME',
    UI_SET_LANGUAGE: 'UI_SET_LANGUAGE',
    UI_SET_CURRENT_SCREEN: 'UI_SET_CURRENT_SCREEN',
    UI_TOGGLE_BOTTOM_NAV: 'UI_TOGGLE_BOTTOM_NAV',
    
    // App actions
    APP_INIT: 'APP_INIT',
    APP_RESET: 'APP_RESET'
};
/**
 * Central Store Class
 */
class Store {
    constructor() {
        this.state = {
            auth: AuthState.getInitialState(),
            user: UserState.getInitialState(),
            reports: ReportState.getInitialState(),
            notifications: NotificationState.getInitialState(),
            ui: UIState.getInitialState()
        };
        
        this.subscribers = [];
        this.middleware = [];
        this.actionHistory = [];
        this.maxHistorySize = 50;
        
        Logger.info('🏪 Store initialized');
    }
    /**
     * Get current state
     * @returns {object} - Current state
     */
    getState() {
        return JSON.parse(JSON.stringify(this.state)); // Deep clone
    }
    /**
     * Get specific state slice
     * @param {string} slice - State slice name
     * @returns {object} - State slice
     */
    getStateSlice(slice) {
        return JSON.parse(JSON.stringify(this.state[slice]));
    }
    /**
     * Dispatch action
     * @param {string} type - Action type
     * @param {*} payload - Action payload
     * @returns {object} - Action object
     */
    dispatch(type, payload = null) {
        const action = { type, payload, timestamp: Date.now() };
        
        Logger.debug('📬 Dispatch:', action);
        // Apply middleware
        let processedAction = action;
        for (const mw of this.middleware) {
            processedAction = mw(processedAction, this.getState());
        }
        // Update state based on action type
        const prevState = this.getState();
        this.reduce(processedAction);
        const newState = this.getState();
        // Add to history
        this.addToHistory(processedAction);
        // Notify subscribers if state changed
        if (JSON.stringify(prevState) !== JSON.stringify(newState)) {
            this.notifySubscribers(newState, prevState, processedAction);
        }
        return processedAction;
    }
    /**
     * Reduce state based on action
     * @param {object} action - Action object
     */
    reduce(action) {
        const { type, payload } = action;
        switch (type) {
            // Auth actions
            case ActionTypes.AUTH_LOGIN:
                this.state.auth = AuthState.login(this.state.auth, payload);
                break;
            case ActionTypes.AUTH_LOGOUT:
                this.state.auth = AuthState.logout(this.state.auth);
                this.state.user = UserState.getInitialState();
                break;
            case ActionTypes.AUTH_SET_TOKEN:
                this.state.auth = AuthState.setToken(this.state.auth, payload);
                break;
            case ActionTypes.AUTH_REFRESH_TOKEN:
                this.state.auth = AuthState.refreshToken(this.state.auth, payload);
                break;
            // User actions
            case ActionTypes.USER_SET_PROFILE:
                this.state.user = UserState.setProfile(this.state.user, payload);
                break;
            case ActionTypes.USER_UPDATE_PROFILE:
                this.state.user = UserState.updateProfile(this.state.user, payload);
                break;
            case ActionTypes.USER_SET_PREFERENCES:
                this.state.user = UserState.setPreferences(this.state.user, payload);
                break;
            case ActionTypes.USER_INCREMENT_CONSUMPTION:
                this.state.user = UserState.incrementConsumption(this.state.user);
                break;
            case ActionTypes.USER_UPDATE_HB:
                this.state.user = UserState.updateHB(this.state.user, payload);
                break;
            // Report actions
            case ActionTypes.REPORT_ADD:
                this.state.reports = ReportState.addReport(this.state.reports, payload);
                break;
            case ActionTypes.REPORT_SET_LIST:
                this.state.reports = ReportState.setReports(this.state.reports, payload);
                break;
            case ActionTypes.REPORT_UPDATE:
                this.state.reports = ReportState.updateReport(this.state.reports, payload);
                break;
            case ActionTypes.REPORT_DELETE:
                this.state.reports = ReportState.deleteReport(this.state.reports, payload);
                break;
            case ActionTypes.REPORT_SET_FILTER:
                this.state.reports = ReportState.setFilter(this.state.reports, payload);
                break;
            case ActionTypes.REPORT_SET_LOADING:
                this.state.reports = ReportState.setLoading(this.state.reports, payload);
                break;
            // Notification actions
            case ActionTypes.NOTIFICATION_SET_LIST:
                this.state.notifications = NotificationState.setNotifications(this.state.notifications, payload);
                break;
            case ActionTypes.NOTIFICATION_ADD:
                this.state.notifications = NotificationState.addNotification(this.state.notifications, payload);
                break;
            case ActionTypes.NOTIFICATION_MARK_READ:
                this.state.notifications = NotificationState.markAsRead(this.state.notifications, payload);
                break;
            case ActionTypes.NOTIFICATION_MARK_ALL_READ:
                this.state.notifications = NotificationState.markAllAsRead(this.state.notifications);
                break;
            case ActionTypes.NOTIFICATION_DELETE:
                this.state.notifications = NotificationState.deleteNotification(this.state.notifications, payload);
                break;
            // UI actions
            case ActionTypes.UI_SET_LOADING:
                this.state.ui = UIState.setLoading(this.state.ui, payload);
                break;
            case ActionTypes.UI_SHOW_MODAL:
                this.state.ui = UIState.showModal(this.state.ui, payload);
                break;
            case ActionTypes.UI_HIDE_MODAL:
                this.state.ui = UIState.hideModal(this.state.ui);
                break;
            case ActionTypes.UI_SHOW_TOAST:
                this.state.ui = UIState.showToast(this.state.ui, payload);
                break;
            case ActionTypes.UI_SET_THEME:
                this.state.ui = UIState.setTheme(this.state.ui, payload);
                break;
            case ActionTypes.UI_SET_LANGUAGE:
                this.state.ui = UIState.setLanguage(this.state.ui, payload);
                break;
            case ActionTypes.UI_SET_CURRENT_SCREEN:
                this.state.ui = UIState.setCurrentScreen(this.state.ui, payload);
                break;
            case ActionTypes.UI_TOGGLE_BOTTOM_NAV:
                this.state.ui = UIState.toggleBottomNav(this.state.ui, payload);
                break;
            // App actions
            case ActionTypes.APP_RESET:
                this.state = {
                    auth: AuthState.getInitialState(),
                    user: UserState.getInitialState(),
                    reports: ReportState.getInitialState(),
                    notifications: NotificationState.getInitialState(),
                    ui: UIState.getInitialState()
                };
                break;
            default:
                Logger.warn('Unknown action type:', type);
        }
    }
    /**
     * Subscribe to state changes
     * @param {Function} callback - Callback function
     * @returns {Function} - Unsubscribe function
     */
    subscribe(callback) {
        this.subscribers.push(callback);
        
        // Return unsubscribe function
        return () => {
            const index = this.subscribers.indexOf(callback);
            if (index > -1) {
                this.subscribers.splice(index, 1);
            }
        };
    }
    /**
     * Notify subscribers of state change
     * @param {object} newState - New state
     * @param {object} prevState - Previous state
     * @param {object} action - Action that caused change
     */
    notifySubscribers(newState, prevState, action) {
        this.subscribers.forEach(callback => {
            try {
                callback(newState, prevState, action);
            } catch (error) {
                Logger.error('Subscriber error:', error);
            }
        });
    }
    /**
     * Add middleware
     * @param {Function} middleware - Middleware function
     */
    use(middleware) {
        this.middleware.push(middleware);
    }
    /**
     * Add action to history
     * @param {object} action - Action object
     */
    addToHistory(action) {
        this.actionHistory.push(action);
        
        // Limit history size
        if (this.actionHistory.length > this.maxHistorySize) {
            this.actionHistory.shift();
        }
    }
    /**
     * Get action history
     * @returns {array} - Action history
     */
    getHistory() {
        return [...this.actionHistory];
    }
    /**
     * Clear history
     */
    clearHistory() {
        this.actionHistory = [];
    }
    /**
     * Reset store to initial state
     */
    reset() {
        this.dispatch(ActionTypes.APP_RESET);
        Logger.info('🏪 Store reset');
    }
    /**
     * Persist state to storage
     */
    async persist() {
        try {
            const stateToPersist = {
                auth: this.state.auth,
                user: this.state.user,
                ui: {
                    theme: this.state.ui.theme,
                    language: this.state.ui.language
                }
            };
            
            await setJSON('modiva_store_state', stateToPersist);
            Logger.debug('💾 State persisted');
        } catch (error) {
            Logger.error('Failed to persist state:', error);
        }
    }
    /**
     * Restore state from storage
     */
    async restore() {
        try {
            const parsedState = await getJSON('modiva_store_state');
            if (parsedState) {
                const prevState = this.getState();
                
                if (parsedState.auth) this.state.auth = parsedState.auth;
                if (parsedState.user) this.state.user = parsedState.user;
                if (parsedState.ui) {
                    this.state.ui.theme = parsedState.ui.theme;
                    this.state.ui.language = parsedState.ui.language;
                }
                
                Logger.info('📥 State restored from storage');
                
                // Notify subscribers of the restoration
                this.notifySubscribers(this.getState(), prevState, { type: 'STORE_RESTORED' });
            }
        } catch (error) {
            Logger.error('Failed to restore state:', error);
        }
    }
    /**
     * Get store info
     * @returns {object}
     */
    getInfo() {
        return {
            subscriberCount: this.subscribers.length,
            middlewareCount: this.middleware.length,
            historySize: this.actionHistory.length,
            stateSize: JSON.stringify(this.state).length
        };
    }
}
/**
 * Create singleton store instance
 */
export const store = new Store();
// Auto-persist on state changes
store.subscribe(() => {
    store.persist();
});
// Restore on load
store.restore();
// Freeze action types
Object.freeze(ActionTypes);
export default store;