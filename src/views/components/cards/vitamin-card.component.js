/**
 * Modiva - Vitamin Card Component
 * Display vitamin consumption information
 * @module views/components/cards/vitamin-card
 */

import { Logger } from '../../../utils/logger.js';
import { store } from '../../../state/store.js';

/**
 * Vitamin Card Component
 */
export const VitaminCardComponent = {
    /**
     * Render vitamin card
     * @param {string} containerId - Container element ID
     */
    render(containerId = 'vitaminCard') {
        const state = store.getState();
        const consumption = state.user.vitaminConsumption;

        const container = document.getElementById(containerId);
        if (!container) {
            Logger.error('Vitamin card container not found');
            return;
        }

        const percentage = consumption.percentage || 0;

        container.innerHTML = `
            <div class="bg-white rounded-2xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-800">Konsumsi Vitamin</h3>
                    <svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"/>
                    </svg>
                </div>
                <div class="flex items-baseline">
                    <span class="text-4xl font-bold text-blue-600">${consumption.count || 0}</span>
                    <span class="text-2xl text-gray-400 mx-2">/</span>
                    <span class="text-2xl text-gray-600">${consumption.target || 48}</span>
                </div>
                <p class="text-gray-600 mt-2">Jumlah vitamin diminum</p>
                <div class="mt-4 bg-gray-200 rounded-full h-3">
                    <div class="bg-blue-600 h-3 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
                </div>
                <p class="text-sm text-gray-500 mt-2 text-right">${percentage}% tercapai</p>
            </div>
        `;
    },

    /**
     * Update consumption count
     * @param {number} count - New count
     * @param {number} target - Target count
     */
    update(count, target = 48) {
        const percentage = Math.round((count / target) * 100);

        // Update count
        const countElement = document.querySelector('#vitaminCard .text-4xl');
        if (countElement) {
            countElement.textContent = count;
        }

        // Update target
        const targetElement = document.querySelector('#vitaminCard .text-2xl:last-of-type');
        if (targetElement) {
            targetElement.textContent = target;
        }

        // Update progress bar
        const progressBar = document.querySelector('#vitaminCard .bg-blue-600');
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }

        // Update percentage text
        const percentageText = document.querySelector('#vitaminCard .text-sm.text-gray-500');
        if (percentageText) {
            percentageText.textContent = `${percentage}% tercapai`;
        }
    }
};

export default VitaminCardComponent;