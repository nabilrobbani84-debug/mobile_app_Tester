/**
 * Modiva - HB Trend Chart Component
 * Weekly HB trend line chart
 * @module views/components/charts/hb-trend-chart
 */

import { Logger } from '../../../utils/logger.js';
import { ChartConfig, ChartColors } from '../../../config/constants.js';

/**
 * HB Trend Chart Component
 */
export const HBTrendChartComponent = {
    /**
     * Chart instance
     */
    chart: null,

    /**
     * Default data
     */
    defaultData: {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        data: [12.0, 12.1, 12.2, 12.3, 12.4, 12.3, 12.5]
    },

    /**
     * Initialize HB trend chart
     * @param {string} canvasId - Canvas element ID
     * @param {object} data - Chart data (optional)
     */
    init(canvasId = 'hbTrendChart', data = null) {
        Logger.info('📈 HBTrendChartComponent: Initializing');

        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            Logger.error('HB trend chart canvas not found');
            return;
        }

        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }

        const chartData = data || this.defaultData;

        const ctx = canvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'HB Level (g/dL)',
                    data: chartData.data,
                    borderColor: ChartColors.SECONDARY,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: ChartColors.SECONDARY,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        display: false 
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                return 'HB: ' + context.parsed.y.toFixed(1) + ' g/dL';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 11.5,
                        max: 13,
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1) + ' g/dL';
                            },
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                animation: {
                    duration: ChartConfig.ANIMATION_DURATION,
                    easing: ChartConfig.ANIMATION_EASING
                }
            }
        });

        Logger.success('✅ HB trend chart initialized');
    },

    /**
     * Update chart data
     * @param {object} newData - New chart data
     */
    update(newData) {
        if (!this.chart) {
            Logger.warn('Chart not initialized');
            return;
        }

        this.chart.data.labels = newData.labels;
        this.chart.data.datasets[0].data = newData.data;
        this.chart.update();

        Logger.info('📊 HB trend chart updated');
    },

    /**
     * Add data point
     * @param {string} label - Data label
     * @param {number} value - Data value
     */
    addDataPoint(label, value) {
        if (!this.chart) return;

        this.chart.data.labels.push(label);
        this.chart.data.datasets[0].data.push(value);

        // Keep only last 7 points
        if (this.chart.data.labels.length > 7) {
            this.chart.data.labels.shift();
            this.chart.data.datasets[0].data.shift();
        }

        this.chart.update();
    },

    /**
     * Destroy chart
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
            Logger.info('🗑️ HB trend chart destroyed');
        }
    }
};

export default HBTrendChartComponent;