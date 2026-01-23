/**
 * Modiva - Notification Model
 * Notification data model
 * @module models/Notification
 */

export class NotificationModel {
    constructor(data = {}) {
        this.id = data.id || Date.now();
        this.type = data.type || 'info'; // reminder, success, warning, info
        this.title = data.title || '';
        this.message = data.message || '';
        this.timestamp = data.timestamp || new Date().toISOString();
        this.read = data.read || false;
        this.icon = data.icon || 'notifications';
        this.color = data.color || '#3b82f6';
        this.action = data.action || null; // Navigation action
        this.metadata = data.metadata || {};
    }

    /**
     * Validate notification data
     * @returns {object} { valid: boolean, errors: array }
     */
    validate() {
        const errors = [];
        
        if (!this.title) {
            errors.push({ field: 'title', message: 'Title is required' });
        }
        
        if (!this.message) {
            errors.push({ field: 'message', message: 'Message is required' });
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Check if read
     * @returns {boolean}
     */
    isRead() {
        return this.read === true;
    }

    /**
     * Mark as read
     */
    markAsRead() {
        this.read = true;
    }

    /**
     * Get formatted time (relative)
     *Simple implementation - for full feat use date-fns or moment
     */
    getTimeAgo() {
        const now = new Date();
        const date = new Date(this.timestamp);
        const diff = (now - date) / 1000; // seconds

        if (diff < 60) return 'Baru saja';
        if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
        return `${Math.floor(diff / 86400)} hari yang lalu`;
    }

    /**
     * Convert to JSON
     * @returns {object}
     */
    toJSON() {
        return {
            id: this.id,
            type: this.type,
            title: this.title,
            message: this.message,
            timestamp: this.timestamp,
            read: this.read,
            icon: this.icon,
            color: this.color,
            action: this.action,
            metadata: this.metadata
        };
    }

    /**
     * Create from API response
     * @param {object} data 
     * @returns {NotificationModel}
     */
    static fromAPIResponse(data) {
        return new NotificationModel({
            id: data.id,
            type: data.type,
            title: data.title,
            message: data.message,
            timestamp: data.timestamp || data.created_at,
            read: data.read || data.is_read,
            icon: data.icon,
            color: data.color,
            action: data.action,
            metadata: data.metadata
        });
    }
}

export default NotificationModel;