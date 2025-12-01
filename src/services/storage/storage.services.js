/**
 * Modiva - Base Storage Service
 * Core storage service with encryption, compression, and expiration
 * @module services/storage/storage.service
 */
import { StorageConfig, StorageItemConfig, StorageKeys } from '../../config/storage.config.js';
import { Logger } from '../../utils/logger.js';
/**
 * Storage Item Structure
 */
class StorageItem {
    constructor(data, options = {}) {
        this.value = data;
        this.timestamp = Date.now();
        this.ttl = options.ttl || null;
        this.encrypted = options.encrypted || false;
        this.compressed = options.compressed || false;
        this.metadata = options.metadata || {};
    }
    /**
     * Check if item is expired
     * @returns {boolean}
     */
    isExpired() {
        if (!this.ttl) return false;
        return Date.now() - this.timestamp > this.ttl;
    }
    /**
     * Get remaining TTL in milliseconds
     * @returns {number}
     */
    getRemainingTTL() {
        if (!this.ttl) return Infinity;
        const remaining = this.ttl - (Date.now() - this.timestamp);
        return Math.max(0, remaining);
    }
    /**
     * Serialize to JSON
     * @returns {string}
     */
    toJSON() {
        return JSON.stringify({
            value: this.value,
            timestamp: this.timestamp,
            ttl: this.ttl,
            encrypted: this.encrypted,
            compressed: this.compressed,
            metadata: this.metadata
        });
    }
    /**
     * Deserialize from JSON
     * @param {string} json - JSON string
     * @returns {StorageItem}
     */
    static fromJSON(json) {
        try {
            const data = JSON.parse(json);
            const item = new StorageItem(data.value, {
                ttl: data.ttl,
                encrypted: data.encrypted,
                compressed: data.compressed,
                metadata: data.metadata
            });
            item.timestamp = data.timestamp;
            return item;
        } catch (error) {
            Logger.error('Failed to deserialize StorageItem:', error);
            return null;
        }
    }
}
/**
 * Base Storage Service
 */
export class StorageService {
    constructor(storageType = 'localStorage') {
        this.storageType = storageType;
        this.storage = this.getStorageBackend(storageType);
        this.config = StorageConfig;
        this.itemConfig = StorageItemConfig;
        
        // Initialize cleanup interval
        if (this.config.expiration.enabled) {
            this.startCleanupInterval();
        }
    }
    /**
     * Get storage backend
     * @param {string} type - Storage type
     * @returns {Storage}
     */
    getStorageBackend(type) {
        switch (type) {
            case 'localStorage':
                return typeof window !== 'undefined' ? window.localStorage : null;
            case 'sessionStorage':
                return typeof window !== 'undefined' ? window.sessionStorage : null;
            case 'memory':
                return new MemoryStorage();
            default:
                Logger.warn(`Unknown storage type: ${type}, falling back to memory`);
                return new MemoryStorage();
        }
    }
    /**
     * Start cleanup interval for expired items
     */
    startCleanupInterval() {
        if (this.cleanupInterval) return;
        
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, this.config.expiration.cleanupInterval);
        
        Logger.debug('Storage cleanup interval started');
    }
    /**
     * Stop cleanup interval
     */
    stopCleanupInterval() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
            Logger.debug('Storage cleanup interval stopped');
        }
    }
    /**
     * Cleanup expired items
     */
    cleanup() {
        if (!this.storage) return;
        
        let cleanedCount = 0;
        const keys = Object.keys(this.storage);
        
        keys.forEach(key => {
            try {
                const rawValue = this.storage.getItem(key);
                if (!rawValue) return;
                
                const item = StorageItem.fromJSON(rawValue);
                if (item && item.isExpired()) {
                    this.storage.removeItem(key);
                    cleanedCount++;
                }
            } catch (error) {
                // Skip invalid items
            }
        });
        
        if (cleanedCount > 0) {
            Logger.info(`🗑️ Cleaned ${cleanedCount} expired storage items`);
        }
    }
    /**
     * Set item to storage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @param {object} options - Storage options
     * @returns {boolean} - Success status
     */
    set(key, value, options = {}) {
        if (!this.storage) {
            Logger.error('Storage backend not available');
            return false;
        }
        try {
            // Get item-specific config
            const itemConfig = this.itemConfig[key] || {};
            const mergedOptions = {
                ...itemConfig,
                ...options
            };
            // Check quota before storing
            if (this.config.quota.autoCleanup && this.isQuotaExceeded()) {
                Logger.warn('Storage quota exceeded, running cleanup...');
                this.cleanup();
            }
            // Create storage item
            let processedValue = value;
            // Compress if enabled
            if (mergedOptions.compress && this.config.compression.enabled) {
                processedValue = this.compress(processedValue);
            }
            // Encrypt if enabled
            if (mergedOptions.encrypted && this.config.encryption.enabled) {
                processedValue = this.encrypt(processedValue);
            }
            // Create storage item
            const item = new StorageItem(processedValue, {
                ttl: mergedOptions.ttl,
                encrypted: mergedOptions.encrypted,
                compressed: mergedOptions.compress,
                metadata: mergedOptions.metadata || {}
            });
            // Serialize and store
            this.storage.setItem(key, item.toJSON());
            
            Logger.debug(`💾 Stored: ${key}`, { ttl: item.ttl, size: item.toJSON().length });
            return true;
        } catch (error) {
            Logger.error(`Failed to set storage item: ${key}`, error);
            
            // Handle quota exceeded error
            if (error.name === 'QuotaExceededError') {
                this.handleQuotaExceeded();
            }
            
            return false;
        }
    }
    /**
     * Get item from storage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} - Stored value or default
     */
    get(key, defaultValue = null) {
        if (!this.storage) {
            Logger.error('Storage backend not available');
            return defaultValue;
        }
        try {
            const rawValue = this.storage.getItem(key);
            
            if (rawValue === null) {
                return defaultValue;
            }
            // Deserialize storage item
            const item = StorageItem.fromJSON(rawValue);
            
            if (!item) {
                Logger.warn(`Invalid storage item: ${key}`);
                this.remove(key);
                return defaultValue;
            }
            // Check expiration
            if (item.isExpired()) {
                Logger.debug(`Expired storage item: ${key}`);
                this.remove(key);
                return defaultValue;
            }
            let value = item.value;
            // Decrypt if needed
            if (item.encrypted) {
                value = this.decrypt(value);
            }
            // Decompress if needed
            if (item.compressed) {
                value = this.decompress(value);
            }
            Logger.debug(`📦 Retrieved: ${key}`, { age: Date.now() - item.timestamp });
            return value;
        } catch (error) {
            Logger.error(`Failed to get storage item: ${key}`, error);
            return defaultValue;
        }
    }
    /**
     * Remove item from storage
     * @param {string} key - Storage key
     * @returns {boolean} - Success status
     */
    remove(key) {
        if (!this.storage) {
            Logger.error('Storage backend not available');
            return false;
        }
        try {
            this.storage.removeItem(key);
            Logger.debug(`🗑️ Removed: ${key}`);
            return true;
        } catch (error) {
            Logger.error(`Failed to remove storage item: ${key}`, error);
            return false;
        }
    }
    /**
     * Check if key exists
     * @param {string} key - Storage key
     * @returns {boolean}
     */
    has(key) {
        if (!this.storage) return false;
        
        const value = this.storage.getItem(key);
        return value !== null;
    }
    /**
     * Clear all items
     * @returns {boolean}
     */
    clear() {
        if (!this.storage) {
            Logger.error('Storage backend not available');
            return false;
        }
        try {
            this.storage.clear();
            Logger.info('🗑️ Storage cleared');
            return true;
        } catch (error) {
            Logger.error('Failed to clear storage:', error);
            return false;
        }
    }
    /**
     * Get all keys
     * @returns {string[]}
     */
    keys() {
        if (!this.storage) return [];
        return Object.keys(this.storage);
    }
    /**
     * Get storage size in bytes
     * @returns {number}
     */
    getSize() {
        if (!this.storage) return 0;
        
        let size = 0;
        const keys = this.keys();
        
        keys.forEach(key => {
            const value = this.storage.getItem(key);
            if (value) {
                size += key.length + value.length;
            }
        });
        
        return size;
    }
    /**
     * Get storage size in human-readable format
     * @returns {string}
     */
    getSizeFormatted() {
        const size = this.getSize();
        const units = ['B', 'KB', 'MB', 'GB'];
        let unitIndex = 0;
        let formattedSize = size;
        
        while (formattedSize >= 1024 && unitIndex < units.length - 1) {
            formattedSize /= 1024;
            unitIndex++;
        }
        
        return `${formattedSize.toFixed(2)} ${units[unitIndex]}`;
    }
    /**
     * Check if quota is exceeded
     * @returns {boolean}
     */
    isQuotaExceeded() {
        const size = this.getSize();
        const maxSize = this.config.quota.maxSize;
        const threshold = this.config.quota.warningThreshold;
        
        return size >= maxSize * threshold;
    }
    /**
     * Get quota usage percentage
     * @returns {number}
     */
    getQuotaUsage() {
        const size = this.getSize();
        const maxSize = this.config.quota.maxSize;
        return (size / maxSize) * 100;
    }
    /**
     * Handle quota exceeded
     */
    handleQuotaExceeded() {
        Logger.warn('⚠️ Storage quota exceeded!');
        
        if (this.config.quota.autoCleanup) {
            Logger.info('Running automatic cleanup...');
            this.cleanup();
            
            // If still exceeded, remove oldest items
            if (this.isQuotaExceeded()) {
                this.removeOldestItems(10);
            }
        }
    }
    /**
     * Remove oldest items
     * @param {number} count - Number of items to remove
     */
    removeOldestItems(count) {
        const keys = this.keys();
        const items = [];
        
        // Get all items with timestamps
        keys.forEach(key => {
            try {
                const rawValue = this.storage.getItem(key);
                const item = StorageItem.fromJSON(rawValue);
                if (item) {
                    items.push({ key, timestamp: item.timestamp });
                }
            } catch (error) {
                // Skip invalid items
            }
        });
        
        // Sort by timestamp (oldest first)
        items.sort((a, b) => a.timestamp - b.timestamp);
        
        // Remove oldest items
        const toRemove = items.slice(0, count);
        toRemove.forEach(item => {
            this.remove(item.key);
        });
        
        Logger.info(`🗑️ Removed ${toRemove.length} oldest items`);
    }
    /**
     * Encrypt value (placeholder)
     * @param {*} value - Value to encrypt
     * @returns {*} - Encrypted value
     */
    encrypt(value) {
        // In production, implement actual encryption
        // For now, just return the value
        return value;
    }
    /**
     * Decrypt value (placeholder)
     * @param {*} value - Value to decrypt
     * @returns {*} - Decrypted value
     */
    decrypt(value) {
        // In production, implement actual decryption
        // For now, just return the value
        return value;
    }
    /**
     * Compress value (placeholder)
     * @param {*} value - Value to compress
     * @returns {*} - Compressed value
     */
    compress(value) {
        // In production, implement actual compression (e.g., LZString)
        // For now, just return the value
        return value;
    }
    /**
     * Decompress value (placeholder)
     * @param {*} value - Value to decompress
     * @returns {*} - Decompressed value
     */
    decompress(value) {
        // In production, implement actual decompression
        // For now, just return the value
        return value;
    }
    /**
     * Get storage info
     * @returns {object}
     */
    getInfo() {
        return {
            type: this.storageType,
            size: this.getSize(),
            sizeFormatted: this.getSizeFormatted(),
            quotaUsage: this.getQuotaUsage(),
            itemCount: this.keys().length,
            quotaExceeded: this.isQuotaExceeded()
        };
    }
    /**
     * Destroy storage service
     */
    destroy() {
        this.stopCleanupInterval();
        Logger.info('Storage service destroyed');
    }
}
/**
 * Memory Storage (fallback when localStorage/sessionStorage not available)
 */
class MemoryStorage {
    constructor() {
        this.data = new Map();
    }
    getItem(key) {
        return this.data.get(key) || null;
    }
    setItem(key, value) {
        this.data.set(key, value);
    }
    removeItem(key) {
        this.data.delete(key);
    }
    clear() {
        this.data.clear();
    }
    key(index) {
        return Array.from(this.data.keys())[index] || null;
    }
    get length() {
        return this.data.size;
    }
}
export default StorageService;
