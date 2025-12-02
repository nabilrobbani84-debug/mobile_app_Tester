
/**
 * Modiva - Main Application Module
 * Entry point and orchestrator for the application
 * @module core/app
 */
import { AppConfig } from '../config/app.config.js';
import { Bootstrap } from './bootstrap.js';
import { AppLifecycle, LifecyclePhases } from './lifecycle.js';
import { Logger } from '../utils/logger.js';
/**
 * Main Application Class
 */
export class ModivaApp {
    constructor() {
        this.name = AppConfig.app.name;
        this.version = AppConfig.app.version;
        this.isInitialized = false;
        this.isRunning = false;
        
        Logger.info(`
╔═══════════════════════════════════════╗
║   ${this.name} - ${AppConfig.app.fullName}   ║
║   Version: ${this.version}                     ║
╚═══════════════════════════════════════╝
        `);
    }
    /**
     * Initialize the application
     * @returns {Promise<boolean>}
     */
    async initialize() {
        if (this.isInitialized) {
            Logger.warn('⚠️ Application already initialized');
            return true;
        }
        try {
            Logger.info('🚀 Initializing Modiva application...');
            // Step 1: Initialize lifecycle manager
            AppLifecycle.initialize();
            // Step 2: Run lifecycle phases
            await AppLifecycle.run();
            // Step 3: Run bootstrap
            const bootstrapSuccess = await Bootstrap.run();
            
            if (!bootstrapSuccess) {
                throw new Error('Bootstrap failed');
            }
            this.isInitialized = true;
            
            Logger.success('✅ Application initialized successfully');
            
            return true;
        } catch (error) {
            Logger.error('❌ Application initialization failed:', error);
            this.handleInitializationError(error);
            return false;
        }
    }
    /**
     * Start the application
     * @returns {Promise<void>}
     */
    async start() {
        if (!this.isInitialized) {
            Logger.error('❌ Cannot start: Application not initialized');
            return;
        }
        if (this.isRunning) {
            Logger.warn('⚠️ Application already running');
            return;
        }
        try {
            Logger.info('▶️ Starting Modiva application...');
            // Wait for ready phase
            await AppLifecycle.waitForPhase(LifecyclePhases.READY);
            // Determine initial route based on authentication
            const isAuthenticated = Bootstrap.isAuthenticated;
            
            if (isAuthenticated) {
                Logger.info('✅ User authenticated - loading dashboard');
                await this.showAuthenticatedApp();
            } else {
                Logger.info('ℹ️ User not authenticated - showing splash screen');
                await this.showSplashScreen();
            }
            this.isRunning = true;
            // Log performance metrics
            AppLifecycle.logSummary();
            Logger.success('✅ Application started successfully');
        } catch (error) {
            Logger.error('❌ Application start failed:', error);
            this.handleStartError(error);
        }
    }
    /**
     * Show splash screen then navigate appropriately
     * @returns {Promise<void>}
     */
    async showSplashScreen() {
        Logger.info('🎨 Showing splash screen...');
        
        // Navigation module will handle this
        // For now, just wait for splash duration
        await this.delay(AppConfig.ui.splashDuration);
        
        Logger.info('📱 Navigating to login screen...');
        // Router.navigate('/login');
    }
    /**
     * Show authenticated app (dashboard)
     * @returns {Promise<void>}
     */
    async showAuthenticatedApp() {
        Logger.info('🏠 Loading authenticated app...');
        
        // Show splash first
        await this.delay(AppConfig.ui.splashDuration);
        
        // Then navigate to home/dashboard
        Logger.info('📱 Navigating to dashboard...');
        // Router.navigate('/home');
        
        // Initialize dashboard components
        // Charts.initCharts();
        // UI.updateDashboard();
    }
    /**
     * Delay helper
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Handle initialization error
     * @param {Error} error - Error object
     */
    handleInitializationError(error) {
        Logger.error('💥 Critical initialization error:', error);
        // Show error screen
        this.showErrorScreen({
            title: 'Initialization Error',
            message: 'Failed to initialize the application. Please refresh the page.',
            error: error.message,
            canRetry: true
        });
    }
    /**
     * Handle start error
     * @param {Error} error - Error object
     */
    handleStartError(error) {
        Logger.error('💥 Critical start error:', error);
        // Show error screen
        this.showErrorScreen({
            title: 'Start Error',
            message: 'Failed to start the application. Please try again.',
            error: error.message,
            canRetry: true
        });
    }
    /**
     * Show error screen
     * @param {object} errorInfo - Error information
     */
    showErrorScreen(errorInfo) {
        const errorHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                padding: 2rem;
                text-align: center;
                background: linear-gradient(to bottom, #ef4444, #dc2626);
                color: white;
            ">
                <div style="max-width: 400px;">
                    <h1 style="font-size: 3rem; margin-bottom: 1rem;">😞</h1>
                    <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
                        ${errorInfo.title}
                    </h2>
                    <p style="margin-bottom: 1rem; opacity: 0.9;">
                        ${errorInfo.message}
                    </p>
                    ${AppConfig.environment.debug ? `
                        <details style="margin-bottom: 1rem; text-align: left; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 0.5rem;">
                            <summary style="cursor: pointer; font-weight: bold;">Error Details</summary>
                            <pre style="margin-top: 0.5rem; font-size: 0.875rem; overflow-x: auto;">${errorInfo.error}</pre>
                        </details>
                    ` : ''}
                    ${errorInfo.canRetry ? `
                        <button 
                            onclick="window.location.reload()"
                            style="
                                background: white;
                                color: #ef4444;
                                padding: 0.75rem 2rem;
                                border: none;
                                border-radius: 0.5rem;
                                font-weight: bold;
                                cursor: pointer;
                                font-size: 1rem;
                            "
                        >
                            Refresh Page
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        document.body.innerHTML = errorHTML;
    }
    /**
     * Reload application
     * @returns {Promise<void>}
     */
    async reload() {
        Logger.info('🔄 Reloading application...');
        
        this.isInitialized = false;
        this.isRunning = false;
        
        // Clear state
        AppLifecycle.reset();
        
        // Reinitialize
        await this.initialize();
        await this.start();
    }
    /**
     * Restart application
     * @returns {Promise<void>}
     */
    async restart() {
        Logger.info('🔄 Restarting application...');
        
        await this.stop();
        await this.start();
    }
    /**
     * Stop application
     * @returns {Promise<void>}
     */
    async stop() {
        if (!this.isRunning) {
            Logger.warn('⚠️ Application not running');
            return;
        }
        Logger.info('⏸️ Stopping application...');
        this.isRunning = false;
        Logger.success('✅ Application stopped');
    }
    /**
     * Destroy application
     */
    destroy() {
        Logger.info('🗑️ Destroying application...');
        this.stop();
        AppLifecycle.destroy();
        this.isInitialized = false;
        this.isRunning = false;
        Logger.success('✅ Application destroyed');
    }
    /**
     * Get application info
     * @returns {object}
     */
    getInfo() {
        return {
            name: this.name,
            version: this.version,
            isInitialized: this.isInitialized,
            isRunning: this.isRunning,
            environment: AppConfig.environment.mode,
            debug: AppConfig.environment.debug
        };
    }
    /**
     * Get application status
     * @returns {object}
     */
    getStatus() {
        return {
            app: this.getInfo(),
            lifecycle: {
                phase: AppLifecycle.getCurrentPhase(),
                metrics: AppLifecycle.getPerformanceMetrics()
            },
            bootstrap: Bootstrap.getState(),
            features: Bootstrap.features
        };
    }
    /**
     * Enable debug mode
     */
    enableDebug() {
        Logger.setLevel('debug');
        Logger.info('🐛 Debug mode enabled');
    }
    /**
     * Disable debug mode
     */
    disableDebug() {
        Logger.setLevel('info');
        Logger.info('ℹ️ Debug mode disabled');
    }
    /**
     * Show install prompt (PWA)
     * @returns {Promise<boolean>}
     */
    async showInstallPrompt() {
        return await Bootstrap.showInstallPrompt();
    }
}
/**
 * Create and export singleton instance
 */
export const App = new ModivaApp();
/**
 * Auto-initialize on DOMContentLoaded
 */
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            await App.initialize();
            await App.start();
        } catch (error) {
            Logger.error('❌ Failed to auto-start application:', error);
        }
    });
}
/**
 * Handle global errors
 */
if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
        Logger.error('💥 Global error:', event.error);
    });
    window.addEventListener('unhandledrejection', (event) => {
        Logger.error('💥 Unhandled promise rejection:', event.reason);
    });
}
/**
 * Expose App to window for debugging
 */
if (typeof window !== 'undefined' && AppConfig.environment.debug) {
    window.ModivaApp = App;
    Logger.info('🐛 App exposed to window.ModivaApp for debugging');
}
export default App;