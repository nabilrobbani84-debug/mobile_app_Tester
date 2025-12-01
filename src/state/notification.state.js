/**
 * Modiva - Notification State
 * Notification data state management
 * @module state/notification
 */
/**
 * Notification State Module
 */
export const NotificationState = {
    /**
     * Get initial notification state
     * @returns {object}
     */
    getInitialState() {
        return {
            list: [],
            unreadCount: 0,
            filters: {
                type: 'all',
                read: 'all'
            },
            loading: false,
            error: null
        };
    },
    /**
     * Set notifications list
     * @param {object} state - Current state
     * @param {array} payload - Notifications array
     * @returns {object} - New state
     */
    setNotifications(state, payload) {
        const unreadCount = payload.filter(n => !n.read).length;
        
        return {
            ...state,
            list: payload,
            unreadCount,
            loading: false,
            error: null
        };
    },
    /**
     * Add notification
     * @param {object} state - Current state
     * @param {object} payload - Notification object
     * @returns {object} - New state
     */
    addNotification(state, payload) {
        const newNotification = {
            ...payload,
            id: Date.now(),
            read: false,
            timestamp: Date.now()
        };
        return {
            ...state,
            list: [newNotification, ...state.list],
            unreadCount: state.unreadCount + 1
        };
    },
    /**
     * Mark notification as read
     * @param {object} state - Current state
     * @param {number} payload - Notification ID
     * @returns {object} - New state
     */
    markAsRead(state, payload) {
        const notificationId = payload;
        
        const updatedList = state.list.map(notification => 
            notification.id === notificationId 
                ? { ...notification, read: true }
                : notification
        );
        const unreadCount = updatedList.filter(n => !n.read).length;
        return {
            ...state,
            list: updatedList,
            unreadCount
        };
    },
    /**
     * Mark all notifications as read
     * @param {object} state - Current state
     * @returns {object} - New state
     */
    markAllAsRead(state) {
        const updatedList = state.list.map(notification => ({
            ...notification,
            read: true
        }));
        return {
            ...state,
            list: updatedList,
            unreadCount: 0
        };
    },
    /**
     * Delete notification
     * @param {object} state - Current state
     * @param {number} payload - Notification ID
     * @returns {object} - New state
     */
    deleteNotification(state, payload) {
        const notificationId = payload;
        
        const notification = state.list.find(n => n.id === notificationId);
        const wasUnread = notification && !notification.read;
        
        const updatedList = state.list.filter(n => n.id !== notificationId);
        return {
            ...state,
            list: updatedList,
            unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount
        };
    },
    /**
     * Delete all notifications
     * @param {object} state - Current state
     * @returns {object} - New state
     */
    deleteAll(state) {
        return {
            ...state,
            list: [],
            unreadCount: 0
        };
    },
    /**
     * Set filter
     * @param {object} state - Current state
     * @param {object} payload - Filter updates
     * @returns {object} - New state
     */
    setFilter(state, payload) {
        return {
            ...state,
            filters: {
                ...state.filters,
                ...payload
            }
        };
    },
    /**
     * Set loading state
     * @param {object} state - Current state
     * @param {boolean} payload - Loading flag
     * @returns {object} - New state
     */
    setLoading(state, payload) {
        return {
            ...state,
            loading: payload
        };
    },
    /**
     * Set error
     * @param {object} state - Current state
     * @param {string} payload - Error message
     * @returns {object} - New state
     */
    setError(state, payload) {
        return {
            ...state,
            error: payload,
            loading: false
        };
    },
    /**
     * Get filtered notifications
     * @param {object} state - Current state
     * @returns {array} - Filtered notifications
     */
    getFilteredNotifications(state) {
        let filtered = [...state.list];
        // Filter by type
        if (state.filters.type !== 'all') {
            filtered = filtered.filter(n => n.type === state.filters.type);
        }
        // Filter by read status
        if (state.filters.read === 'read') {
            filtered = filtered.filter(n => n.read === true);
        } else if (state.filters.read === 'unread') {
            filtered = filtered.filter(n => n.read === false);
        }
        return filtered;
    },
    /**
     * Get unread notifications
     * @param {object} state - Current state
     * @returns {array} - Unread notifications
     */
    getUnreadNotifications(state) {
        return state.list.filter(n => !n.read);
    },
    /**
     * Get notifications by type
     * @param {object} state - Current state
     * @param {string} type - Notification type
     * @returns {array} - Filtered notifications
     */
    getNotificationsByType(state, type) {
        return state.list.filter(n => n.type === type);
    }
};
export default NotificationState;