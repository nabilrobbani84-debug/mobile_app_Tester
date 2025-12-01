/**
 * Modiva - Application Lifecycle Module
 * Manages application lifecycle phases and state transitions
 * @module core/lifecycle
 */
import { AppConfig } from '../config/app.config.js';
import { Logger } from '../utils/logger.js';
/**
 * Lifecycle Phases
 */
export const LifecyclePhases = {
    BOOTSTRAP: 'bootstrap',
    INIT: 'init',
    READY: 'ready',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    BACKGROUND: 'background',
    SUSPENDED: 'suspended',
    DESTROY: 'destroy'
};
/**
 * Lifecycle Events
 */
export const LifecycleEvents = {
    BEFORE_BOOTSTRAP: 'lifecycle:beforeBootstrap',
    AFTER_BOOTSTRAP: 'lifecycle:afterBootstrap',
    BEFORE_INIT: 'lifecycle:beforeInit',
    AFTER_INIT: 'lifecycle:afterInit',
    BEFORE_READY: 'lifecycle:beforeReady',
    AFTER_READY: 'lifecycle:afterReady',
    APP_ACTIVE: 'lifecycle:appActive',
    APP_INACTIVE: 'lifecycle:appInactive',
    APP_BACKGROUND: 'lifecycle:appBackground',
    APP_FOREGROUND: 'lifecycle:appForeground',
    BEFORE_DESTROY: 'lifecycle:beforeDestroy',
    AFTER_DESTROY: 'lifecycle:afterDestroy'
};
/**
 * Application Lifecycle Manager
 */
export const AppLifecycle = {
    /**
     * Current lifecycle phase
     */
    currentPhase: null,
    /**
     * Previous lifecycle phase
     */
    previousPhase: null,
    /**
     * Lifecycle history
     */
    history: [],
    /**
     * Event listeners
     */
    listeners: new Map(),
    /**
     * Lifecycle timings
     */
    timings: {
        bootstrap: { start: null, end: null, duration: null },
        init: { start: null, end: null, duration: null },
        ready: { start: null, end: null, duration: null }
    },
    /**
     * Lifecycle metadata
     */
    metadata: {
        startTime: null,
        readyTime: null,
        totalStartupTime: null
    },
    /**
     * Initialize lifecycle manager
     */
    initialize() {
        Logger.info('🔄 Initializing lifecycle manager...');
        
        this.metadata.startTime = Date.now();
        this.setupLifecycleListeners();
        
        Logger.success('✅ Lifecycle manager initialized');
    },
    /**
     * Setup lifecycle listeners
     */
    setupLifecycleListeners() {
        // Listen for visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.transitionTo(LifecyclePhases.BACKGROUND);
            } else {
                this.transitionTo(LifecyclePhases.ACTIVE);
            }
        });
        // Listen for page focus/blur
        window.addEventListener('focus', () => {
            this.emit(LifecycleEvents.APP_FOREGROUND);
        });
        window.addEventListener('blur', () => {
            this.emit(LifecycleEvents.APP_BACKGROUND);
        });
        // Listen for page load
        window.addEventListener('load', () => {
            Logger.info('📄 Page loaded');
        });
        // Listen for beforeunload
        window.addEventListener('beforeunload', () => {
            this.transitionTo(LifecyclePhases.DESTROY);
        });
    },
    /**
     * Run lifecycle phases
     * @returns {Promise<void>}
     */
    async run() {
        Logger.info('🚀 Starting application lifecycle...');
        try {
            // Phase 1: Bootstrap
            await this.bootstrap();
            // Phase 2: Initialize
            await this.init();
            // Phase 3: Ready
            await this.ready();
            Logger.success('✅ Application lifecycle completed');
        } catch (error) {
            Logger.error('❌ Lifecycle failed:', error);
            throw error;
        }
    },
    /**
     * Bootstrap phase
     * @returns {Promise<void>}
     */
    async bootstrap() {
        Logger.info('📦 Starting bootstrap phase...');
        
        this.timings.bootstrap.start = Date.now();
        this.transitionTo(LifecyclePhases.BOOTSTRAP);
        this.emit(LifecycleEvents.BEFORE_BOOTSTRAP);
        // Bootstrap logic handled by Bootstrap module
        // This is just the lifecycle tracking
        this.timings.bootstrap.end = Date.now();
        this.timings.bootstrap.duration = this.timings.bootstrap.end - this.timings.bootstrap.start;
        
        this.emit(LifecycleEvents.AFTER_BOOTSTRAP);
        
        Logger.success(`✅ Bootstrap phase completed in ${this.timings.bootstrap.duration}ms`);
    },
    /**
     * Initialize phase
     * @returns {Promise<void>}
     */
    async init() {
        Logger.info('⚙️ Starting init phase...');
        
        this.timings.init.start = Date.now();
        this.transitionTo(LifecyclePhases.INIT);
        this.emit(LifecycleEvents.BEFORE_INIT);
        // Initialize services, state, router
        // This is handled by other modules
        this.timings.init.end = Date.now();
        this.timings.init.duration = this.timings.init.end - this.timings.init.start;
        
        this.emit(LifecycleEvents.AFTER_INIT);
        
        Logger.success(`✅ Init phase completed in ${this.timings.init.duration}ms`);
    },
    /**
     * Ready phase
     * @returns {Promise<void>}
     */
    async ready() {
        Logger.info('✨ Starting ready phase...');
        
        this.timings.ready.start = Date.now();
        this.transitionTo(LifecyclePhases.READY);
        this.emit(LifecycleEvents.BEFORE_READY);
        // App is ready - render first screen, activate features
        this.metadata.readyTime = Date.now();
        this.metadata.totalStartupTime = this.metadata.readyTime - this.metadata.startTime;
        this.timings.ready.end = Date.now();
        this.timings.ready.duration = this.timings.ready.end - this.timings.ready.start;
        
        this.emit(LifecycleEvents.AFTER_READY);
        
        Logger.success(`✅ Ready phase completed in ${this.timings.ready.duration}ms`);
        Logger.info(`📊 Total startup time: ${this.metadata.totalStartupTime}ms`);
        // Transition to active
        this.transitionTo(LifecyclePhases.ACTIVE);
        this.emit(LifecycleEvents.APP_ACTIVE);
    },
    /**
     * Transition to new phase
     * @param {string} newPhase - New lifecycle phase
     */
    transitionTo(newPhase) {
        if (!Object.values(LifecyclePhases).includes(newPhase)) {
            Logger.error(`❌ Invalid lifecycle phase: ${newPhase}`);
            return;
        }
        this.previousPhase = this.currentPhase;
        this.currentPhase = newPhase;
        // Add to history
        this.history.push({
            phase: newPhase,
            timestamp: Date.now(),
            previous: this.previousPhase
        });
        Logger.info(`🔄 Lifecycle transition: ${this.previousPhase || 'null'} → ${newPhase}`);
        // Emit phase change event
        this.emit(`lifecycle:phaseChange:${newPhase}`, {
            phase: newPhase,
            previous: this.previousPhase
        });
    },
    /**
     * Register lifecycle event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} - Unsubscribe function
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    },
    /**
     * Register one-time lifecycle event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    once(event, callback) {
        const unsubscribe = this.on(event, (...args) => {
            callback(...args);
            unsubscribe();
        });
    },
    /**
     * Remove lifecycle event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    },
    /**
     * Emit lifecycle event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data = null) {
        Logger.debug(`📢 Lifecycle event: ${event}`, data);
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event);
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                Logger.error(`❌ Lifecycle event callback error (${event}):`, error);
            }
        });
    },
    /**
     * Get current phase
     * @returns {string} - Current lifecycle phase
     */
    getCurrentPhase() {
        return this.currentPhase;
    },
    /**
     * Check if in specific phase
     * @param {string} phase - Phase to check
     * @returns {boolean}
     */
    isInPhase(phase) {
        return this.currentPhase === phase;
    },
    /**
     * Wait for specific phase
     * @param {string} phase - Phase to wait for
     * @returns {Promise<void>}
     */
    waitForPhase(phase) {
        return new Promise((resolve) => {
            if (this.currentPhase === phase) {
                resolve();
                return;
            }
            const unsubscribe = this.on(`lifecycle:phaseChange:${phase}`, () => {
                unsubscribe();
                resolve();
            });
        });
    },
    /**
     * Get lifecycle timings
     * @returns {object} - Timings object
     */
    getTimings() {
        return { ...this.timings };
    },
    /**
     * Get lifecycle metadata
     * @returns {object} - Metadata object
     */
    getMetadata() {
        return { ...this.metadata };
    },
    /**
     * Get lifecycle history
     * @returns {array} - History array
     */
    getHistory() {
        return [...this.history];
    },
    /**
     * Get performance metrics
     * @returns {object} - Performance metrics
     */
    getPerformanceMetrics() {
        return {
            totalStartupTime: this.metadata.totalStartupTime,
            bootstrapTime: this.timings.bootstrap.duration,
            initTime: this.timings.init.duration,
            readyTime: this.timings.ready.duration,
            currentPhase: this.currentPhase,
            phaseChanges: this.history.length
        };
    },
    /**
     * Log lifecycle summary
     */
    logSummary() {
        const metrics = this.getPerformanceMetrics();
        
        console.group('📊 Lifecycle Summary');
        console.log('Current Phase:', metrics.currentPhase);
        console.log('Total Startup Time:', `${metrics.totalStartupTime}ms`);
        console.log('Bootstrap Time:', `${metrics.bootstrapTime}ms`);
        console.log('Init Time:', `${metrics.initTime}ms`);
        console.log('Ready Time:', `${metrics.readyTime}ms`);
        console.log('Phase Changes:', metrics.phaseChanges);
        console.groupEnd();
    },
    /**
     * Reset lifecycle (for testing)
     */
    reset() {
        this.currentPhase = null;
        this.previousPhase = null;
        this.history = [];
        this.listeners.clear();
        this.timings = {
            bootstrap: { start: null, end: null, duration: null },
            init: { start: null, end: null, duration: null },
            ready: { start: null, end: null, duration: null }
        };
        this.metadata = {
            startTime: null,
            readyTime: null,
            totalStartupTime: null
        };
        
        Logger.info('🔄 Lifecycle reset');
    },
    /**
     * Destroy lifecycle manager
     */
    destroy() {
        Logger.info('🗑️ Destroying lifecycle manager...');
        
        this.emit(LifecycleEvents.BEFORE_DESTROY);
        
        // Clear all listeners
        this.listeners.clear();
        
        // Clear history
        this.history = [];
        
        this.emit(LifecycleEvents.AFTER_DESTROY);
        
        Logger.success('✅ Lifecycle manager destroyed');
    }
};
/**
 * Create lifecycle middleware
 * @param {string} phase - Required phase
 * @returns {Function} - Middleware function
 */
export function createLifecycleMiddleware(phase) {
    return async (next) => {
        await AppLifecycle.waitForPhase(phase);
        next();
    };
}
/**
 * Lifecycle decorator for methods
 * @param {string} phase - Required phase
 * @returns {Function} - Decorator function
 */
export function requiresPhase(phase) {
    return function(target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function(...args) {
            await AppLifecycle.waitForPhase(phase);
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
// Freeze lifecycle constants
Object.freeze(LifecyclePhases);
Object.freeze(LifecycleEvents);
export default AppLifecycle;