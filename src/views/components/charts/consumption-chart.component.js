/**
 * Modiva - Consumption Chart Component
 * Vitamin consumption bar chart (6 months)
 * @module views/components/charts/consumption-chart
 */

import { Logger } from '../../../utils/logger.js';
import { ChartConfig, ChartColors } from '../../../config/constants.js';

/**
 * Consumption Chart Component
 */
export const ConsumptionChartComponent = {
    /**
     * Chart instance
     */
    chart: null,

    /**
     * Default data
     */
    defaultData: {
        labels: ['Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr'],
        data: [11.8, 12.0, 12.2, 12.1, 12.3, 12.5]
    },

    /**
     * Initialize consumption chart
     * @param {string} canvasId - Canvas element ID
     * @param {object} data - Chart data (optional)
     */
    init(canvasId = 'hb6MonthChart', data = null) {
        Logger.info('📊 ConsumptionChartComponent: Initializing');

        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            Logger.error('Consumption chart canvas not found');
            return;
        }

        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }

        const chartData = data || this.defaultData;

        const ctx = canvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Hemoglobin (g/dL)',
                    data: chartData.data,
                    backgroundColor: ChartColors.PRIMARY,
                    borderRadius: 8,
                    barThickness: 40,
                    hoverBackgroundColor: ChartColors.SUCCESS
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
                        min: 11,
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

        Logger.success('✅ Consumption chart initialized');
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

        Logger.info('📊 Consumption chart updated');
    },

    /**
     * Highlight specific bar
     * @param {number} index - Bar index
     */
    highlightBar(index) {
        if (!this.chart) return;

        const dataset = this.chart.data.datasets[0];
        const colors = dataset.data.map((_, i) => 
            i === index ? ChartColors.SUCCESS : ChartColors.PRIMARY
        );
        
        dataset.backgroundColor = colors;
        this.chart.update();
    },

    /**
     * Reset highlight
     */
    resetHighlight() {
        if (!this.chart) return;

        this.chart.data.datasets[0].backgroundColor = ChartColors.PRIMARY;
        this.chart.update();
    },

    /**
     * Destroy chart
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
            Logger.info('🗑️ Consumption chart destroyed');
        }
    }
};

export default ConsumptionChartComponent;