/**
 * Modiva - Health Tip Card Component
 * Display health tips and information
 * @module views/components/cards/health-tip-card
 */

import { Logger } from '../../../utils/logger.js';

/**
 * Health Tip Card Component
 */
export const HealthTipCardComponent = {
    /**
     * Health tips data
     */
    tips: [
        {
            id: 1,
            emoji: '💡',
            title: 'Tahukah Kamu?',
            description: 'Vitamin D berperan penting dalam penyerapan kalsium untuk kesehatan tulang.',
            gradient: 'from-green-400 to-blue-500'
        },
        {
            id: 2,
            emoji: '🥛',
            title: 'Tips Sehat',
            description: 'Minum susu yang diperkaya vitamin D untuk meningkatkan kesehatan tulang.',
            gradient: 'from-purple-400 to-pink-500'
        },
        {
            id: 3,
            emoji: '☀️',
            title: 'Sinar Matahari',
            description: 'Paparan sinar matahari pagi 10-15 menit membantu produksi vitamin D.',
            gradient: 'from-yellow-400 to-orange-500'
        },
        {
            id: 4,
            emoji: '🐟',
            title: 'Makanan Sehat',
            description: 'Ikan berlemak seperti salmon kaya akan vitamin D alami.',
            gradient: 'from-blue-400 to-cyan-500'
        }
    ],

    /**
     * Current tip index
     */
    currentIndex: 0,

    /**
     * Render health tip card
     * @param {string} containerId - Container element ID
     * @param {number} tipIndex - Tip index (optional)
     */
    render(containerId = 'healthTipCard', tipIndex = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            Logger.error('Health tip card container not found');
            return;
        }

        const index = tipIndex !== null ? tipIndex : this.currentIndex;
        const tip = this.tips[index];

        container.innerHTML = `
            <div class="bg-gradient-to-r ${tip.gradient} rounded-2xl shadow-lg p-6 text-white">
                <h3 class="text-lg font-bold mb-2">${tip.emoji} ${tip.title}</h3>
                <p class="text-sm mb-4">${tip.description}</p>
                <button 
                    onclick="HealthTipCardComponent.handleLearnMore()"
                    class="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
                >
                    Pelajari Lebih Lanjut →
                </button>
            </div>
        `;
    },

    /**
     * Show next tip
     */
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.tips.length;
        this.render();
    },

    /**
     * Show previous tip
     */
    previous() {
        this.currentIndex = (this.currentIndex - 1 + this.tips.length) % this.tips.length;
        this.render();
    },

    /**
     * Show random tip
     */
    random() {
        this.currentIndex = Math.floor(Math.random() * this.tips.length);
        this.render();
    },

    /**
     * Handle learn more button
     */
    handleLearnMore() {
        Logger.info('💡 Learn more clicked');
        
        // Navigate to health tip detail screen
        if (window.Navigation) {
            window.Navigation.navigateTo('healthTipScreen');
        }
    },

    /**
     * Auto rotate tips
     * @param {number} interval - Interval in milliseconds
     * @returns {number} - Interval ID
     */
    startAutoRotate(interval = 10000) {
        return setInterval(() => {
            this.next();
        }, interval);
    },

    /**
     * Stop auto rotate
     * @param {number} intervalId - Interval ID
     */
    stopAutoRotate(intervalId) {
        clearInterval(intervalId);
    }
};

// Expose to window for onclick handler
if (typeof window !== 'undefined') {
    window.HealthTipCardComponent = HealthTipCardComponent;
}

export default HealthTipCardComponent;