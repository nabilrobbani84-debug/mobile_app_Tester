/**
 * Modiva - Notification Card Component
 * Display individual notification card
 * @module views/components/cards/notification-card
 */

import { Logger } from '../../../utils/logger.js';
import { NotificationModel } from '../../../models/Notification.model.js';

/**
 * Notification Card Component
 */
export const NotificationCardComponent = {
    /**
     * Render notification card
     * @param {object} notification - Notification data
     * @param {string} colorClass - Color class (optional)
     * @returns {string} - HTML string
     */
    render(notification, colorClass = null) {
        const notif = new NotificationModel(notification);

        // Determine color class
        const colors = notif.getColorClasses();
        const finalColorClass = colorClass || `${colors.border} ${colors.bg} ${colors.text}`;

        const readClass = notif.isRead() ? 'opacity-60' : '';

        return `
            <div class="bg-white rounded-xl shadow p-4 border-l-4 ${finalColorClass} ${readClass}" data-id="${notif.id}">
                <div class="flex items-start">
                    <div class="flex-shrink-0 w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 ${colors.text}" fill="currentColor" viewBox="0 0 20 20">
                            ${notif.getIconSVGPath()}
                        </svg>
                    </div>
                    <div class="ml-4 flex-1">
                        <div class="flex items-start justify-between">
                            <p class="font-semibold text-gray-800">${notif.title}</p>
                            ${!notif.isRead() ? '<span class="w-2 h-2 bg-blue-600 rounded-full"></span>' : ''}
                        </div>
                        <p class="text-sm text-gray-600 mt-1">${notif.message}</p>
                        <div class="flex items-center justify-between mt-2">
                            <p class="text-xs text-gray-400">${notif.getRelativeTime()}</p>
                            ${this.renderActions(notif)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render notification actions
     * @param {NotificationModel} notification - Notification model
     * @returns {string} - HTML string
     */
    renderActions(notification) {
        if (notification.isRead()) {
            return '';
        }

        return `
            <button 
                class="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                onclick="NotificationCardComponent.handleMarkAsRead(${notification.id})"
            >
                Tandai Dibaca
            </button>
        `;
    },

    /**
     * Render compact notification card
     * @param {object} notification - Notification data
     * @returns {string} - HTML string
     */
    renderCompact(notification) {
        const notif = new NotificationModel(notification);
        const colors = notif.getColorClasses();

        return `
            <div class="flex items-center p-3 bg-white rounded-lg border ${colors.border} hover:shadow-md transition" data-id="${notif.id}">
                <div class="w-2 h-2 ${notif.isRead() ? 'bg-gray-300' : 'bg-blue-600'} rounded-full mr-3"></div>
                <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">${notif.title}</p>
                    <p class="text-xs text-gray-500">${notif.getRelativeTime()}</p>
                </div>
                <svg class="w-5 h-5 ${colors.text}" fill="currentColor" viewBox="0 0 20 20">
                    ${notif.getIconSVGPath()}
                </svg>
            </div>
        `;
    },

    /**
     * Render notification badge
     * @param {object} notification - Notification data
     * @returns {string} - HTML string
     */
    renderBadge(notification) {
        const notif = new NotificationModel(notification);
        const colors = notif.getColorClasses();

        return `
            <div class="inline-flex items-center px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-xs font-semibold">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    ${notif.getIconSVGPath()}
                </svg>
                ${notif.type}
            </div>
        `;
    },

    /**
     * Handle mark as read
     * @param {number} notificationId - Notification ID
     */
    async handleMarkAsRead(notificationId) {
        Logger.info('✓ NotificationCardComponent: Mark as read:', notificationId);
        
        // Import controller dynamically
        const { NotificationController } = await import('../../../controllers/notification.controller.js');
        await NotificationController.markAsRead(notificationId);
    }
};

// Expose to window for onclick handler
if (typeof window !== 'undefined') {
    window.NotificationCardComponent = NotificationCardComponent;
}

export default NotificationCardComponent;