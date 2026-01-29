/**
 * Modiva - Notification API
 * API calls for notification management
 * @module services/api/notification.api
 */
import { ApiEndpoints, USE_MOCK_API } from '../../config/api.config.js';
import { Logger } from '../../utils/logger.js';
import { apiService } from './api.services.js';
/**
 * Mock Notification API
 */
const MockNotificationAPI = {
    /**
     * Mock get all notifications
     */
    async getAll(params = {}) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        Logger.info('🎭 Mock API: Get All Notifications', params);
        
        return {
            success: true,
            data: [
                {
                    id: 1,
                    type: 'reminder',
                    title: 'Pengingat Minum Vitamin',
                    message: 'Jangan lupa minum vitamin hari ini!',
                    time: '2 jam yang lalu',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    read: false,
                    icon: 'bell',
                    color: 'blue'
                },
                {
                    id: 2,
                    type: 'success',
                    title: 'Laporan Berhasil Dikirim',
                    message: 'Laporan konsumsi vitamin Anda telah berhasil dicatat.',
                    time: '5 jam yang lalu',
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    read: true,
                    icon: 'check',
                    color: 'green'
                },
                {
                    id: 3,
                    type: 'motivation',
                    title: 'Motivasi',
                    message: 'Hebat! Kamu sudah konsisten minum vitamin selama 7 hari berturut-turut!',
                    time: '1 hari yang lalu',
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    read: false,
                    icon: 'thumbs-up',
                    color: 'purple'
                },
                {
                    id: 4,
                    type: 'info',
                    title: 'Tips Kesehatan',
                    message: 'Tahukah kamu? Vitamin D membantu penyerapan kalsium untuk tulang yang kuat.',
                    time: '2 hari yang lalu',
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    read: true,
                    icon: 'info',
                    color: 'yellow'
                }
            ],
            meta: {
                total: 4,
                unread: 2
            }
        };
    },
    /**
     * Mock mark as read
     */
    /**
     * Mock mark as read
     */
    async markAsRead(id) {
        await new Promise(resolve => setTimeout(resolve, 200));
        Logger.info('🎭 Mock API: Mark Notification as Read', { id });
        return { success: true, message: 'Notification marked as read' };
    },

    /**
     * Mock mark all as read
     */
    async markAllAsRead() {
        await new Promise(resolve => setTimeout(resolve, 300));
        Logger.info('🎭 Mock API: Mark All as Read');
        return { success: true, message: 'All notifications marked as read' };
    },

    /**
     * Mock delete notification
     */
    async deleteNotification(id) {
        await new Promise(resolve => setTimeout(resolve, 200));
        Logger.info('🎭 Mock API: Delete Notification', { id });
        return { success: true, message: 'Notification deleted' };
    }
};
/**
 * Notification API
 */
export const NotificationAPI = {
    /**
     * Get all notifications
     * @param {object} params - Query parameters
     * @returns {Promise<object>} - Notifications data
     */
    async getAll(params = {}) {
        if (USE_MOCK_API) {
            return await MockNotificationAPI.getAll(params);
        }
        
        const endpoint = ApiEndpoints.notifications.getAll;
        return await apiService.get(endpoint.url, {
            query: params,
            timeout: endpoint.timeout
        });
    },
    /**
     * Mark notification as read
     * @param {string|number} id - Notification ID
     * @returns {Promise<object>} - Response
     */
    async markAsRead(id) {
        if (USE_MOCK_API) {
            return await MockNotificationAPI.markAsRead(id);
        }
        
        const endpoint = ApiEndpoints.notifications.markAsRead;
        return await apiService.put(endpoint.url, {}, {
            params: { id },
            timeout: endpoint.timeout
        });
    },

    /**
     * Mark all notifications as read
     * @returns {Promise<object>}
     */
    async markAllAsRead() {
        if (USE_MOCK_API) {
            return await MockNotificationAPI.markAllAsRead();
        }

        // Check if endpoint exists, if not use a generic one or multiple calls
        const endpoint = ApiEndpoints.notifications.markAllRead || { url: '/notifications/read-all', timeout: 5000 };
        return await apiService.put(endpoint.url, {}, {
            timeout: endpoint.timeout
        });
    },

    /**
     * Delete notification
     * @param {string|number} id - Notification ID
     * @returns {Promise<object>}
     */
    async deleteNotification(id) {
        if (USE_MOCK_API) {
            return await MockNotificationAPI.deleteNotification(id);
        }

        const endpoint = ApiEndpoints.notifications.delete || { url: '/notifications/:id', timeout: 5000 };
        // Replace :id if needed or use params
        let url = endpoint.url;
        if (url.includes(':id')) {
            url = url.replace(':id', id);
        }

        return await apiService.delete(url, {
            params: { id },
            timeout: endpoint.timeout
        });
    }
};
export default NotificationAPI;
