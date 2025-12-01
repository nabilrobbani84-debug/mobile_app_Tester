/**
 * Modiva - Splash Screen
 * Initial screen with logo and loading animation
 * @module views/screens/splash
 */

import { AppConfig } from '../../config/app.config.js';
import { Logger } from '../../utils/logger.js';
import { AuthController } from '../../controllers/auth.controller.js';

/**
 * Splash Screen Component
 */
export const SplashScreen = {
    /**
     * Screen ID
     */
    id: 'splashScreen',

    /**
     * Initialize splash screen
     */
    init() {
        Logger.info('🎨 SplashScreen: Initializing');
        
        this.render();
        this.startAnimation();
        this.scheduleNavigation();
    },

    /**
     * Render splash screen
     */
    render() {
        const container = document.getElementById(this.id);
        
        if (!container) {
            Logger.error('Splash screen container not found');
            return;
        }

        // Screen is already rendered in HTML
        // Just ensure it's visible
        container.classList.add('active');
    },

    /**
     * Start animations
     */
    startAnimation() {
        // Blood drop animation
        const bloodDrop = document.querySelector('#splashScreen .blood-drop');
        if (bloodDrop) {
            bloodDrop.style.animation = 'pulse 2s infinite';
        }

        // Fade in text
        const texts = document.querySelectorAll('#splashScreen p, #splashScreen h1');
        texts.forEach((text, index) => {
            setTimeout(() => {
                text.style.opacity = '1';
                text.style.transform = 'translateY(0)';
            }, 300 * index);
        });
    },

    /**
     * Schedule navigation after splash duration
     */
    async scheduleNavigation() {
        Logger.info(`⏰ Splash duration: ${AppConfig.ui.splashDuration}ms`);

        setTimeout(async () => {
            await this.navigateNext();
        }, AppConfig.ui.splashDuration);
    },

    /**
     * Navigate to next screen based on auth status
     */
    async navigateNext() {
        Logger.info('🔀 SplashScreen: Determining next screen');

        try {
            // Initialize auth check
            const isAuthenticated = await AuthController.initializeAuth();

            if (isAuthenticated) {
                Logger.info('✅ User authenticated - navigating to home');
                this.navigateToHome();
            } else {
                Logger.info('ℹ️ User not authenticated - navigating to login');
                this.navigateToLogin();
            }

        } catch (error) {
            Logger.error('❌ Navigation error:', error);
            // Fallback to login on error
            this.navigateToLogin();
        }
    },

    /**
     * Navigate to login screen
     */
    navigateToLogin() {
        // Import navigation dynamically to avoid circular dependency
        import('../../routes/router.js').then(({ Router }) => {
            Router.navigate('login');
        }).catch(() => {
            // Fallback: direct navigation
            const Navigation = window.Navigation;
            if (Navigation) {
                Navigation.navigateTo('loginScreen');
            }
        });
    },

    /**
     * Navigate to home screen
     */
    navigateToHome() {
        import('../../routes/router.js').then(({ Router }) => {
            Router.navigate('home');
        }).catch(() => {
            // Fallback: direct navigation
            const Navigation = window.Navigation;
            if (Navigation) {
                Navigation.navigateTo('homeScreen');
                // Show bottom nav
                const bottomNav = document.querySelector('.bottom-nav');
                if (bottomNav) {
                    bottomNav.classList.add('active');
                }
            }
        });
    },

    /**
     * Cleanup
     */
    cleanup() {
        Logger.info('🧹 SplashScreen: Cleanup');
        
        const container = document.getElementById(this.id);
        if (container) {
            container.classList.remove('active');
        }
    }
};

export default SplashScreen;