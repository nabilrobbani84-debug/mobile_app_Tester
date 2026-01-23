/**
 * Modiva - Notification Controller
 * Handles notification management
 * @module controllers/notification
 */

import * as Notifications from 'expo-notifications'; // IMPORT EXPO NOTIFICATIONS
import { NotificationModel } from '../models/Notification.model.js';
import { analyticsService, EventTypes } from '../services/analytics/analytics.service.js';
import { NotificationAPI } from '../services/api/notification.api.js';
import { localStorageService } from '../services/storage/local.storage.js';
import { ActionTypes, store } from '../state/store.js';
import { Logger } from '../utils/logger.js';

/**
 * Notification Controller
 */
export const NotificationController = {
    /**
     * Request notification permissions
     */
    async requestPermissions() {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
            Logger.warn('🚫 Notification permissions not granted');
            return false;
        }
        return true;
    },

    /**
     * Load all notifications
     * @param {object} options - Load options
     * @returns {Promise<void>}
     */
    async loadNotifications(options = {}) {
        Logger.info('🔔 NotificationController: Loading notifications');

        try {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'notifications', isLoading: true });

            // Check cache first
            const cachedNotifications = localStorageService.getNotificationsCache();
            
            if (cachedNotifications && !options.forceRefresh) {
                Logger.info('📦 Using cached notifications');
                store.dispatch(ActionTypes.NOTIFICATION_SET_LIST, cachedNotifications);
                return;
            }

            // Fetch from API
            const response = await NotificationAPI.getAll(options);

            if (response.success && response.data) {
                // Convert to models
                const notifications = response.data.map(data => 
                    NotificationModel.fromAPIResponse(data)
                );

                // Update state
                store.dispatch(ActionTypes.NOTIFICATION_SET_LIST, notifications.map(n => n.toJSON()));

                // Cache notifications
                localStorageService.setNotificationsCache(notifications.map(n => n.toJSON()));

                // Update unread count
                const unreadCount = response.meta?.unread || notifications.filter(n => !n.isRead()).length;
                localStorageService.setUnreadNotificationsCount(unreadCount);

                // Track page view
                analyticsService.trackPageView('notifications');

                Logger.success(`✅ Loaded ${notifications.length} notifications (${unreadCount} unread)`);
            }

        } catch (error) {
            Logger.error('❌ Failed to load notifications:', error);

            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'error',
                message: 'Gagal memuat notifikasi'
            });

        } finally {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'notifications', isLoading: false });
        }
    },

    /**
     * Mark notification as read
     * @param {string|number} notificationId - Notification ID
     * @returns {Promise<void>}
     */
    async markAsRead(notificationId) {
        Logger.info('✓ NotificationController: Mark as read', notificationId);

        try {
            // Update state immediately (optimistic update)
            store.dispatch(ActionTypes.NOTIFICATION_MARK_READ, notificationId);

            // Call API
            await NotificationAPI.markAsRead(notificationId);

            // Update cache
            const state = store.getState();
            localStorageService.setNotificationsCache(state.notifications.list);
            localStorageService.setUnreadNotificationsCount(state.notifications.unreadCount);

            // Track analytics
            analyticsService.trackEvent(EventTypes.NOTIFICATION_CLICK, {
                notificationId
            });

        } catch (error) {
            Logger.error('❌ Failed to mark as read:', error);
            // Revert optimistic update if needed
        }
    },

    /**
     * Mark all notifications as read
     * @returns {Promise<void>}
     */
    async markAllAsRead() {
        Logger.info('✓✓ NotificationController: Mark all as read');

        try {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'markAllRead', isLoading: true });

            // Update state
            store.dispatch(ActionTypes.NOTIFICATION_MARK_ALL_READ);

            // Call API (if available)
            // await NotificationAPI.markAllAsRead();

            // Update cache
            const state = store.getState();
            localStorageService.setNotificationsCache(state.notifications.list);
            localStorageService.setUnreadNotificationsCount(0);

            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'success',
                message: 'Semua notifikasi ditandai sudah dibaca'
            });

            Logger.success('✅ All notifications marked as read');

        } catch (error) {
            Logger.error('❌ Failed to mark all as read:', error);

            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'error',
                message: 'Gagal menandai semua notifikasi'
            });

        } finally {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'markAllRead', isLoading: false });
        }
    },

    /**
     * Delete notification
     * @param {string|number} notificationId - Notification ID
     * @returns {Promise<void>}
     */
    async deleteNotification(notificationId) {
        Logger.info('🗑️ NotificationController: Delete notification', notificationId);

        try {
            // Update state
            store.dispatch(ActionTypes.NOTIFICATION_DELETE, notificationId);

            // Call API
            await NotificationAPI.deleteNotification(notificationId);

            // Update cache
            const state = store.getState();
            localStorageService.setNotificationsCache(state.notifications.list);

            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'success',
                message: 'Notifikasi dihapus'
            });

            // Track analytics
            analyticsService.trackEvent(EventTypes.NOTIFICATION_DISMISS, {
                notificationId
            });

        } catch (error) {
            Logger.error('❌ Failed to delete notification:', error);

            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'error',
                message: 'Gagal menghapus notifikasi'
            });
        }
    },

    /**
     * Get unread count
     * @returns {number}
     */
    getUnreadCount() {
        const state = store.getState();
        return state.notifications.unreadCount;
    },

    /**
     * Add local notification (System + App)
     * @param {object} notificationData - Notification data
     */
    async addLocalNotification(notificationData) {
        try {
            const notification = new NotificationModel(notificationData);

            // Validate
            const validation = notification.validate();
            if (!validation.valid) {
                Logger.warn('⚠️ Invalid notification:', validation.errors);
                return;
            }

            // 1. Add to App State (In-App Notification List)
            store.dispatch(ActionTypes.NOTIFICATION_ADD, notification.toJSON());

            // Update cache
            const state = store.getState();
            localStorageService.setNotificationsCache(state.notifications.list);
            localStorageService.setUnreadNotificationsCount(state.notifications.unreadCount);

            // 2. Schedule System Notification (Push Notification)
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: notification.title,
                    body: notification.message,
                    data: { id: notification.id, type: notification.type },
                    sound: true,
                },
                trigger: null, // As soon as possible
            });

            Logger.info('✅ Local notification added & scheduled');

        } catch (error) {
            Logger.error('❌ Failed to add local notification:', error);
        }
    },

    /**
     * Filter notifications
     * @param {object} filters - Filter options
     * @returns {array}
     */
    filterNotifications(filters = {}) {
        const state = store.getState();
        let notifications = state.notifications.list.map(n => new NotificationModel(n));

        // Filter by type
        if (filters.type && filters.type !== 'all') {
            notifications = notifications.filter(n => n.type === filters.type);
        }

        // Filter by read status
        if (filters.read === 'read') {
            notifications = notifications.filter(n => n.isRead());
        } else if (filters.read === 'unread') {
            notifications = notifications.filter(n => !n.isRead());
        }

        return notifications.map(n => n.toJSON());
    },

    /**
     * Check for reminders (Vitamin consumption)
     */
    checkReminders() {
        const state = store.getState();
        const user = state.user;
        const profile = user.profile;
        
        if (!user || !profile) return;

        // 1. Vitamin Reminder
        const lastConsumed = user.vitaminConsumption.lastConsumed;
        const today = new Date().toDateString();
        const lastConsumedDate = lastConsumed ? new Date(lastConsumed).toDateString() : null;

        if (lastConsumedDate !== today) {
            // Check if we already have a reminder for today
            const notifications = state.notifications.list;
            const hasReminderToday = notifications.some(n => 
                n.type === 'reminder' && 
                new Date(n.timestamp).toDateString() === today
            );

            if (!hasReminderToday) {
                this.addLocalNotification({
                    type: 'reminder',
                    title: 'Waktunya Minum Vitamin!',
                    message: `Halo ${profile.name || 'Sobat'}, jangan lupa minum Tablet Tambah Darah hari ini ya!`,
                    timestamp: new Date().toISOString(),
                    read: false,
                    icon: 'notifications', // Use valid icon name
                    color: '#f59e0b'
                });
                Logger.info('⏰ Vitamin reminder added');
                
                // Show toast
                store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                    type: 'info',
                    message: 'Jangan lupa minum vitamin hari ini!'
                });
            }
        }
    },

    /**
     * Start notification scheduler
     */
    async startScheduler() {
        if (this.schedulerInterval) return;
        
        Logger.info('⏰ Notification Scheduler Started');
        
        // 1. Request permissions first
        await this.requestPermissions();

        // 2. Initial check
        this.checkReminders();
        this.loadNotifications();

        // 3. Check every minute
        this.schedulerInterval = setInterval(() => {
            this.checkReminders();
        }, 60 * 1000);
    },

    /**
     * Stop notification scheduler
     */
    stopScheduler() {
        if (this.schedulerInterval) {
            clearInterval(this.schedulerInterval);
            this.schedulerInterval = null;
            Logger.info('⏰ Notification Scheduler Stopped');
        }
    }
};

export default NotificationController;