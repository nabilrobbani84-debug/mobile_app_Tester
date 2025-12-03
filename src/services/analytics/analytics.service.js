/**
 * Modiva - Analytics Service (React Native Compatible)
 * Track user events, screen views, and application usage securely.
 * @module services/analytics/analytics.service
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Pastikan package ini terinstall
import AppConfig from '../../config/app.config';
import Logger from '../../utils/logger';
import * as Application from 'expo-application'; // Opsional: Untuk info app version
import * as Device from 'expo-device'; // Opsional: Untuk info device

/**
 * Event Types
 */
export const EventTypes = {
    USER_LOGIN: 'user_login',
    USER_LOGOUT: 'user_logout',
    SCREEN_VIEW: 'screen_view',
    ACTION_CLICK: 'action_click',
    FORM_SUBMIT: 'form_submit',
    ERROR_OCCURRED: 'error_occurred',
    PROFILE_EDIT: 'profile_edit',
    CUSTOM_EVENT: 'custom_event'
};

/**
 * Event Categories
 */
export const EventCategories = {
    USER: 'User',
    NAVIGATION: 'Navigation',
    INTERACTION: 'Interaction',
    SYSTEM: 'System',
    ERROR: 'Error'
};

/**
 * Analytics Event Class
 */
class AnalyticsEvent {
    constructor(type, data = {}) {
        this.type = type;
        this.category = this.getCategoryFromType(type);
        this.data = data;
        this.timestamp = Date.now();
        this.sessionId = null; // Diisi nanti
        this.userId = null;    // Diisi nanti
        this.platform = Platform.OS;
        this.deviceModel = Device.modelName || 'Unknown';
        this.appVersion = Application.nativeApplicationVersion || '1.0.0';
    }

    getCategoryFromType(type) {
        if (type.includes('user')) return EventCategories.USER;
        if (type.includes('screen')) return EventCategories.NAVIGATION;
        if (type.includes('error')) return EventCategories.ERROR;
        return EventCategories.INTERACTION;
    }

    toJSON() {
        return {
            type: this.type,
            category: this.category,
            data: this.data,
            timestamp: this.timestamp,
            meta: {
                platform: this.platform,
                device: this.deviceModel,
                version: this.appVersion,
                sessionId: this.sessionId,
                userId: this.userId
            }
        };
    }
}

/**
 * Analytics Service Class
 */
export class AnalyticsService {
    constructor() {
        this.enabled = AppConfig.features?.enableAnalytics ?? true;
        this.queue = [];
        this.maxQueueSize = 50;
        this.flushInterval = 30000; // 30 detik
        this.sessionId = null;
        this.timerId = null;

        if (this.enabled) {
            this.initialize();
        }
    }

    async initialize() {
        Logger.info('📊 Initializing Analytics Service (Mobile)...');
        
        // 1. Generate/Retrieve Session ID
        this.sessionId = await this._getSessionId();
        
        // 2. Load Queue dari Storage (jika ada sisa event sebelum app close)
        await this.loadQueue();

        // 3. Start Auto Flush
        this.startAutoFlush();

        // 4. Init Providers (Mocking/Native SDKs)
        this.initializeProviders();
    }

    initializeProviders() {
        // Di React Native, kita biasanya menggunakan Firebase Analytics atau Sentry Native SDK
        // Di sini kita mock setup-nya agar tidak error
        if (__DEV__) {
            Logger.debug('📊 Analytics Providers: Setup Mock Providers');
        }
    }

    async _getSessionId() {
        try {
            let sid = await AsyncStorage.getItem('modiva_session_id');
            if (!sid) {
                sid = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                await AsyncStorage.setItem('modiva_session_id', sid);
            }
            return sid;
        } catch (e) {
            return `sess_temp_${Date.now()}`;
        }
    }

    async trackEvent(eventType, data = {}) {
        if (!this.enabled) return;

        const event = new AnalyticsEvent(eventType, data);
        event.sessionId = this.sessionId;
        
        // Coba ambil User ID dari Global State atau Storage jika perlu
        // event.userId = ... 

        if (__DEV__) {
            Logger.debug(`📊 [Track] ${eventType}`, data);
        }

        this.addToQueue(event);
        
        // Kirim langsung ke console/provider Native jika perlu real-time
        this.sendToProviders(event);
    }

    trackScreenView(screenName, params = {}) {
        this.trackEvent(EventTypes.SCREEN_VIEW, { screen: screenName, ...params });
    }

    trackError(error, context = {}) {
        this.trackEvent(EventTypes.ERROR_OCCURRED, {
            message: error.message,
            stack: error.stack, // Hati-hati log stack trace di production (bisa besar)
            ...context
        });
    }

    addToQueue(event) {
        this.queue.push(event.toJSON());
        if (this.queue.length > this.maxQueueSize) {
            // Drop event lama jika antrian penuh (FIFO)
            this.queue.shift(); 
        }
        this.saveQueue();
    }

    async saveQueue() {
        try {
            await AsyncStorage.setItem('modiva_analytics_queue', JSON.stringify(this.queue));
        } catch (e) {
            Logger.warn('Failed to save analytics queue', e);
        }
    }

    async loadQueue() {
        try {
            const saved = await AsyncStorage.getItem('modiva_analytics_queue');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) this.queue = parsed;
            }
        } catch (e) {
            // Ignore corrupted queue
        }
    }

    async flushQueue() {
        if (this.queue.length === 0) return;

        const batch = [...this.queue];
        if (__DEV__) {
            Logger.debug(`📊 Flushing ${batch.length} events to server...`);
        }

        try {
            // Simulasi kirim ke API Server
            /*
            await fetch(AppConfig.environment.apiUrl + '/analytics/batch', {
                method: 'POST',
                body: JSON.stringify({ events: batch }),
                // ... headers
            });
            */
            
            // Jika sukses, kosongkan queue
            this.queue = [];
            await AsyncStorage.removeItem('modiva_analytics_queue');
        } catch (error) {
            Logger.warn('Failed to flush analytics queue, retrying later.');
        }
    }

    sendToProviders(event) {
        // Implementasi integrasi native (misal: Firebase Analytics)
        // if (AppConfig.features.enableFirebase) { ... }
    }

    startAutoFlush() {
        this.stopAutoFlush();
        this.timerId = setInterval(() => this.flushQueue(), this.flushInterval);
    }

    stopAutoFlush() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }
}

// Singleton Instance
export const analyticsService = new AnalyticsService();
export default analyticsService;