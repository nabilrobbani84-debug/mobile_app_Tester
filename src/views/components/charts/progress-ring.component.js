/**
 * Modiva - Progress Ring Component
 * Circular progress indicator
 * @module views/components/charts/progress-ring
 */

import { Logger } from '../../../utils/logger.js';
import { ChartColors } from '../../../config/constants.js';

/**
 * Progress Ring Component
 */
export const ProgressRingComponent = {
    /**
     * Render progress ring
     * @param {string} containerId - Container element ID
     * @param {number} percentage - Progress percentage (0-100)
     * @param {object} options - Customization options
     * @returns {string} - HTML string
     */
    render(containerId, percentage = 0, options = {}) {
        const defaults = {
            size: 128,
            strokeWidth: 12,
            color: ChartColors.PRIMARY,
            backgroundColor: '#e5e7eb',
            showPercentage: true,
            animated: true
        };

        const config = { ...defaults, ...options };

        const radius = (config.size - config.strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.getHTML(percentage, config, radius, circumference, offset);
            
            if (config.animated) {
                this.animateRing(containerId, percentage, config, radius, circumference);
            }
        }

        return this.getHTML(percentage, config, radius, circumference, offset);
    },

    /**
     * Get HTML for progress ring
     * @param {number} percentage - Progress percentage
     * @param {object} config - Configuration
     * @param {number} radius - Circle radius
     * @param {number} circumference - Circle circumference
     * @param {number} offset - Stroke dash offset
     * @returns {string} - HTML string
     */
    getHTML(percentage, config, radius, circumference, offset) {
        const center = config.size / 2;

        return `
            <div class="relative inline-flex items-center justify-center">
                <svg class="progress-ring transform -rotate-90" width="${config.size}" height="${config.size}">
                    <!-- Background circle -->
                    <circle 
                        cx="${center}" 
                        cy="${center}" 
                        r="${radius}" 
                        stroke="${config.backgroundColor}" 
                        stroke-width="${config.strokeWidth}" 
                        fill="none"
                    />
                    <!-- Progress circle -->
                    <circle 
                        class="progress-ring-circle"
                        cx="${center}" 
                        cy="${center}" 
                        r="${radius}" 
                        stroke="${config.color}" 
                        stroke-width="${config.strokeWidth}" 
                        fill="none"
                        stroke-dasharray="${circumference}"
                        stroke-dashoffset="${offset}"
                        stroke-linecap="round"
                        style="transition: stroke-dashoffset 0.5s ease-in-out;"
                    />
                </svg>
                ${config.showPercentage ? `
                    <div class="absolute inset-0 flex items-center justify-center">
                        <span class="text-3xl font-bold" style="color: ${config.color}">${Math.round(percentage)}%</span>
                    </div>
                ` : ''}
            </div>
        `;
    },

    /**
     * Animate progress ring
     * @param {string} containerId - Container element ID
     * @param {number} targetPercentage - Target percentage
     * @param {object} config - Configuration
     * @param {number} radius - Circle radius
     * @param {number} circumference - Circle circumference
     */
    animateRing(containerId, targetPercentage, config, radius, circumference) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const circle = container.querySelector('.progress-ring-circle');
        const percentageText = container.querySelector('span');

        if (!circle) return;

        // Animate from 0 to target
        let current = 0;
        const duration = 1000; // 1 second
        const steps = 60;
        const increment = targetPercentage / steps;
        const stepDuration = duration / steps;

        const interval = setInterval(() => {
            current += increment;
            
            if (current >= targetPercentage) {
                current = targetPercentage;
                clearInterval(interval);
            }

            const offset = circumference - (current / 100) * circumference;
            circle.style.strokeDashoffset = offset;

            if (percentageText) {
                percentageText.textContent = Math.round(current) + '%';
            }
        }, stepDuration);
    },

    /**
     * Update progress ring value
     * @param {string} containerId - Container element ID
     * @param {number} newPercentage - New percentage value
     */
    update(containerId, newPercentage) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const circle = container.querySelector('.progress-ring-circle');
        const percentageText = container.querySelector('span');

        if (!circle) return;

        // Get current configuration
        const svg = container.querySelector('svg');
        const size = parseInt(svg.getAttribute('width'));
        const strokeWidth = 12;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (newPercentage / 100) * circumference;

        // Update circle
        circle.style.strokeDashoffset = offset;

        // Update text
        if (percentageText) {
            percentageText.textContent = Math.round(newPercentage) + '%';
        }

        Logger.info('🔄 Progress ring updated:', newPercentage + '%');
    },

    /**
     * Create multiple progress rings (for comparison)
     * @param {string} containerId - Container element ID
     * @param {array} data - Array of {label, percentage, color}
     */
    renderMultiple(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = data.map((item, index) => `
            <div class="flex items-center justify-between mb-4">
                <span class="text-sm font-medium text-gray-700">${item.label}</span>
                <div id="ring_${containerId}_${index}"></div>
            </div>
        `).join('');

        // Render each ring
        data.forEach((item, index) => {
            this.render(`ring_${containerId}_${index}`, item.percentage, {
                size: 64,
                strokeWidth: 8,
                color: item.color || ChartColors.PRIMARY,
                showPercentage: true
            });
        });
    }
};

export default ProgressRingComponent;