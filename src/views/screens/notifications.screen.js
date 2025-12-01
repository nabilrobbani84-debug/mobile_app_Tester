/**
 * Modiva - Notifications Screen
 * Display user notifications
 * @module views/screens/notifications
 */

import { Logger } from '../../utils/logger.js';
import { NotificationController } from '../../controllers/notification.controller.js';
import { store } from '../../state/store.js';

/**
 * Notifications Screen Component
 */
export const NotificationsScreen = {
    /**
     * Screen ID
     */
    id: 'notificationsScreen',

    /**
     * Initialize notifications screen
     */
    async init() {
        Logger.info('🔔 NotificationsScreen: Initializing');
        
        this.render();
        await this.loadData();
        this.attachEventListeners();
    },

    /**
     * Render screen
     */
    render() {
        const container = document.getElementById(this.id);
        
        if (!container) {
            Logger.error('Notifications screen container not found');
            return;
        }

        container.classList.add('active');
    },

    /**
     * Load notifications data
     */
    async loadData() {
        try {
            await NotificationController.loadNotifications();
            
            // Update UI
            this.updateNotificationsList();
            
        } catch (error) {
            Logger.error('❌ Failed to load notifications:', error);
        }
    },

    /**
     * Update notifications list
     */
    updateNotificationsList() {
        const state = store.getState();
        const notifications = state.notifications.list;

        const container = document.getElementById('notificationsList');
        if (!container) return;

        if (!notifications || notifications.length === 0) {
            container.innerHTML = `
                <div class="text-center p-8 text-gray-500">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <p>Belum ada notifikasi</p>
                </div>
            `;
            return;
        }

        container.innerHTML = notifications.map(notification => 
            this.renderNotificationCard(notification)
        ).join('');

        // Attach click listeners
        this.attachNotificationListeners();
    },

    /**
     * Render notification card
     * @param {object} notification - Notification data
     * @returns {string} - HTML string
     */
    renderNotificationCard(notification) {
        const colorClasses = {
            blue: 'border-blue-500 bg-blue-100 text-blue-600',
            green: 'border-green-500 bg-green-100 text-green-600',
            purple: 'border-purple-500 bg-purple-100 text-purple-600',
            yellow: 'border-yellow-500 bg-yellow-100 text-yellow-600',
            red: 'border-red-500 bg-red-100 text-red-600'
        };

        const colorClass = colorClasses[notification.color] || colorClasses.blue;
        const readClass = notification.read ? 'opacity-60' : '';

        return `
            <div class="bg-white rounded-xl shadow p-4 border-l-4 ${colorClass} ${readClass} notification-item" 
                 data-id="${notification.id}">
                <div class="flex items-start">
                    <div class="flex-shrink-0 w-10 h-10 ${colorClass.replace('border', 'bg').replace('500', '100')} rounded-full flex items-center justify-center">
                        ${this.getIconSVG(notification.icon, colorClass.replace('border', 'text'))}
                    </div>
                    <div class="ml-4 flex-1">
                        <div class="flex items-start justify-between">
                            <p class="font-semibold text-gray-800">${notification.title}</p>
                            ${!notification.read ? '<span class="w-2 h-2 bg-blue-600 rounded-full"></span>' : ''}
                        </div>
                        <p class="text-sm text-gray-600 mt-1">${notification.message}</p>
                        <p class="text-xs text-gray-400 mt-2">${notification.time || this.formatTime(notification.timestamp)}</p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Get icon SVG
     * @param {string} icon - Icon name
     * @param {string} colorClass - Color class
     * @returns {string} - SVG HTML
     */
    getIconSVG(icon, colorClass) {
        const icons = {
            bell: '<path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>',
            check: '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>',
            'thumbs-up': '<path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>',
            info: '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>'
        };

        return `
            <svg class="w-6 h-6 ${colorClass}" fill="currentColor" viewBox="0 0 20 20">
                ${icons[icon] || icons.info}
            </svg>
        `;
    },

    /**
     * Format time
     * @param {number} timestamp - Timestamp
     * @returns {string} - Formatted time
     */
    formatTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;

        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'Baru saja';
        if (minutes < 60) return `${minutes} menit yang lalu`;
        if (hours < 24) return `${hours} jam yang lalu`;
        if (days < 7) return `${days} hari yang lalu`;
        
        return new Date(timestamp).toLocaleDateString('id-ID');
    },

    /**
     * Attach notification listeners
     */
    attachNotificationListeners() {
        const notificationItems = document.querySelectorAll('.notification-item');
        
        notificationItems.forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                this.handleNotificationClick(id);
            });
        });
    },

    /**
     * Handle notification click
     * @param {number} id - Notification ID
     */
    async handleNotificationClick(id) {
        Logger.info('📧 NotificationsScreen: Notification clicked:', id);
        
        await NotificationController.markAsRead(id);
        this.updateNotificationsList();
    },

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Mark all as read button (if exists)
        const markAllBtn = document.querySelector('#notificationsScreen .mark-all-read-btn');
        if (markAllBtn) {
            markAllBtn.addEventListener('click', () => {
                this.handleMarkAllAsRead();
            });
        }
    },

    /**
     * Handle mark all as read
     */
    async handleMarkAllAsRead() {
        await NotificationController.markAllAsRead();
        this.updateNotificationsList();
    },

    /**
     * Refresh data
     */
    async refresh() {
        Logger.info('🔄 NotificationsScreen: Refreshing data');
        await this.loadData();
    },

    /**
     * Cleanup
     */
    cleanup() {
        Logger.info('🧹 NotificationsScreen: Cleanup');
    }
};

export default NotificationsScreen;