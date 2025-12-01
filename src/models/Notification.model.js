/**
 * Modiva - Notification Model
 * Notification data model with validation and transformations
 * @module models/Notification
 */
import { NotificationTypes } from '../config/constants.js';
import { Logger } from '../utils/logger.js';
/**
 * Notification Model Class
 */
export class NotificationModel {
    constructor(data = {}) {
        this.id = data.id || null;
        this.userId = data.userId || data.user_id || null;
        this.type = data.type || NotificationTypes.INFO;
        this.title = data.title || '';
        this.message = data.message || '';
        this.icon = data.icon || 'info';
        this.color = data.color || 'blue';
        this.data = data.data || null;
        this.read = data.read || false;
        this.actionUrl = data.actionUrl || data.action_url || null;
        this.timestamp = data.timestamp || data.created_at || Date.now();
        this.expiresAt = data.expiresAt || data.expires_at || null;
    }
    /**
     * Validate notification data
     * @returns {object} - { valid: boolean, errors: array }
     */
    validate() {
        const errors = [];
        // Validate type
        if (!Object.values(NotificationTypes).includes(this.type)) {
            errors.push({
                field: 'type',
                message: 'Tipe notifikasi tidak valid'
            });
        }
        // Validate title
        if (!this.title || this.title.trim().length === 0) {
            errors.push({
                field: 'title',
                message: 'Judul notifikasi harus diisi'
            });
        }
        // Validate message
        if (!this.message || this.message.trim().length === 0) {
            errors.push({
                field: 'message',
                message: 'Pesan notifikasi harus diisi'
            });
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
    /**
     * Check if notification is read
     * @returns {boolean}
     */
    isRead() {
        return this.read === true;
    }
    /**
     * Check if notification is expired
     * @returns {boolean}
     */
    isExpired() {
        if (!this.expiresAt) return false;
        return Date.now() > new Date(this.expiresAt).getTime();
    }
    /**
     * Get notification age in minutes
     * @returns {number}
     */
    getAgeInMinutes() {
        const now = Date.now();
        const timestamp = new Date(this.timestamp).getTime();
        return Math.floor((now - timestamp) / (1000 * 60));
    }
    /**
     * Get notification age in hours
     * @returns {number}
     */
    getAgeInHours() {
        return Math.floor(this.getAgeInMinutes() / 60);
    }
    /**
     * Get notification age in days
     * @returns {number}
     */
    getAgeInDays() {
        return Math.floor(this.getAgeInHours() / 24);
    }
    /**
     * Get relative time string
     * @returns {string}
     */
    getRelativeTime() {
        const minutes = this.getAgeInMinutes();
        if (minutes < 1) return 'Baru saja';
        if (minutes < 60) return `${minutes} menit yang lalu`;
        const hours = this.getAgeInHours();
        if (hours < 24) return `${hours} jam yang lalu`;
        const days = this.getAgeInDays();
        if (days < 7) return `${days} hari yang lalu`;
        if (days < 30) return `${Math.floor(days / 7)} minggu yang lalu`;
        if (days < 365) return `${Math.floor(days / 30)} bulan yang lalu`;
        return `${Math.floor(days / 365)} tahun yang lalu`;
    }
    /**
     * Get formatted timestamp
     * @returns {string}
     */
    getFormattedTimestamp() {
        const date = new Date(this.timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    /**
     * Get icon SVG path
     * @returns {string}
     */
    getIconSVGPath() {
        const iconPaths = {
            bell: 'M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z',
            check: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
            'thumbs-up': 'M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z',
            info: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
            warning: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
            error: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
            trophy: 'M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z'
        };
        return iconPaths[this.icon] || iconPaths.info;
    }
    /**
     * Get color classes
     * @returns {object}
     */
    getColorClasses() {
        const colorMap = {
            blue: {
                bg: 'bg-blue-100',
                text: 'text-blue-600',
                border: 'border-blue-500'
            },
            green: {
                bg: 'bg-green-100',
                text: 'text-green-600',
                border: 'border-green-500'
            },
            yellow: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-600',
                border: 'border-yellow-500'
            },
            red: {
                bg: 'bg-red-100',
                text: 'text-red-600',
                border: 'border-red-500'
            },
            purple: {
                bg: 'bg-purple-100',
                text: 'text-purple-600',
                border: 'border-purple-500'
            }
        };
        return colorMap[this.color] || colorMap.blue;
    }
    /**
     * Mark as read
     * @returns {NotificationModel}
     */
    markAsRead() {
        this.read = true;
        return this;
    }
    /**
     * Mark as unread
     * @returns {NotificationModel}
     */
    markAsUnread() {
        this.read = false;
        return this;
    }
    /**
     * Convert to JSON
     * @returns {object}
     */
    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            type: this.type,
            title: this.title,
            message: this.message,
            icon: this.icon,
            color: this.color,
            data: this.data,
            read: this.read,
            actionUrl: this.actionUrl,
            timestamp: this.timestamp,
            expiresAt: this.expiresAt
        };
    }
    /**
     * Convert to API format (snake_case)
     * @returns {object}
     */
    toAPIFormat() {
        return {
            id: this.id,
            user_id: this.userId,
            type: this.type,
            title: this.title,
            message: this.message,
            icon: this.icon,
            color: this.color,
            data: this.data,
            read: this.read,
            action_url: this.actionUrl,
            timestamp: this.timestamp,
            expires_at: this.expiresAt
        };
    }
    /**
     * Get summary data
     * @returns {object}
     */
    getSummary() {
        return {
            id: this.id,
            type: this.type,
            title: this.title,
            message: this.message.substring(0, 100) + (this.message.length > 100 ? '...' : ''),
            read: this.read,
            relativeTime: this.getRelativeTime(),
            color: this.color
        };
    }
    /**
     * Create from API response
     * @param {object} data - API response data
     * @returns {NotificationModel}
     */
    static fromAPIResponse(data) {
        return new NotificationModel({
            id: data.id,
            userId: data.user_id,
            type: data.type,
            title: data.title,
            message: data.message,
            icon: data.icon,
            color: data.color,
            data: data.data,
            read: data.read,
            actionUrl: data.action_url,
            timestamp: data.timestamp || data.created_at,
            expiresAt: data.expires_at
        });
    }
    /**
     * Clone notification
     * @returns {NotificationModel}
     */
    clone() {
        return new NotificationModel(this.toJSON());
    }
    /**
     * Log notification info (for debugging)
     */
    log() {
        Logger.info('Notification Model:', this.toJSON());
    }
}
export default NotificationModel;