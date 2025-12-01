/**
 * Modiva - Health Tip Screen
 * Display health tips and educational content
 * @module views/screens/health-tip
 */

import { Logger } from '../../utils/logger.js';
import { analyticsService, EventTypes } from '../../services/analytics/analytics.service.js';

/**
 * Health Tip Screen Component
 */
export const HealthTipScreen = {
    /**
     * Screen ID
     */
    id: 'healthTipScreen',

    /**
     * Initialize health tip screen
     */
    init() {
        Logger.info('💡 HealthTipScreen: Initializing');
        
        this.render();
        this.trackView();
        this.attachEventListeners();
    },

    /**
     * Render screen
     */
    render() {
        const container = document.getElementById(this.id);
        
        if (!container) {
            Logger.error('Health tip screen container not found');
            return;
        }

        container.classList.add('active');
    },

    /**
     * Track page view
     */
    trackView() {
        analyticsService.trackEvent(EventTypes.HEALTH_TIP_VIEW, {
            tip: 'vitamin_d_role',
            source: 'dashboard'
        });
    },

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Back button
        const backButton = document.querySelector('#healthTipScreen button[onclick*="homeScreen"]');
        if (backButton) {
            backButton.onclick = () => {
                this.navigateBack();
            };
        }

        // Share button (if exists)
        const shareButton = document.querySelector('#healthTipScreen .share-btn');
        if (shareButton) {
            shareButton.addEventListener('click', () => {
                this.handleShare();
            });
        }
    },

    /**
     * Navigate back to home
     */
    navigateBack() {
        Logger.info('⬅️ HealthTipScreen: Navigating back');
        
        import('../../routes/router.js').then(({ Router }) => {
            Router.navigate('home');
        }).catch(() => {
            const Navigation = window.Navigation;
            if (Navigation) {
                Navigation.navigateTo('homeScreen');
            }
        });
    },

    /**
     * Handle share
     */
    handleShare() {
        Logger.info('📤 HealthTipScreen: Sharing');
        
        analyticsService.trackEvent(EventTypes.HEALTH_TIP_SHARE, {
            tip: 'vitamin_d_role'
        });

        if (navigator.share) {
            navigator.share({
                title: 'Peran Vital Vitamin D',
                text: 'Vitamin D membantu penyerapan kalsium untuk tulang yang kuat.',
                url: window.location.href
            }).catch(err => {
                Logger.error('Share failed:', err);
            });
        } else {
            // Fallback: Copy to clipboard
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                alert('Link berhasil disalin!');
            });
        }
    },

    /**
     * Cleanup
     */
    cleanup() {
        Logger.info('🧹 HealthTipScreen: Cleanup');
    }
};

export default HealthTipScreen;