/**
 * Modiva - Reports Screen
 * Display health reports and statistics
 * @module views/screens/reports
 */

import { Logger } from '../../utils/logger.js';
import { ReportController } from '../../controllers/report.controller.js';
import { store } from '../../state/store.js';

/**
 * Reports Screen Component
 */
export const ReportsScreen = {
    /**
     * Screen ID
     */
    id: 'reportsScreen',

    /**
     * Initialize reports screen
     */
    async init() {
        Logger.info('📊 ReportsScreen: Initializing');
        
        this.render();
        await this.loadData();
        this.attachEventListeners();
    },

    /**
     * Render screen
     */
    render() {
        const container = document.getElementById(this.id);
        
        if (!container) {
            Logger.error('Reports screen container not found');
            return;
        }

        container.classList.add('active');
        
        // Update user info
        this.updateUserInfo();
    },

    /**
     * Load reports data
     */
    async loadData() {
        try {
            await ReportController.loadReports();
            
            // Update UI
            this.updateReportsData();
            
            // Initialize charts
            this.initializeCharts();
            
        } catch (error) {
            Logger.error('❌ Failed to load reports:', error);
        }
    },

    /**
     * Update user info
     */
    updateUserInfo() {
        const state = store.getState();
        const user = state.user.profile;

        const reportUserInfo = document.getElementById('reportUserInfo');
        if (reportUserInfo) {
            reportUserInfo.textContent = `${user.name || 'Pengguna'} | NISN: ${user.nisn || '-'}`;
        }

        const currentHB = document.getElementById('currentHB');
        if (currentHB) {
            currentHB.textContent = state.user.hemoglobin.current || '-';
        }
    },

    /**
     * Update reports data
     */
    updateReportsData() {
        const state = store.getState();
        
        // Update past reports list
        this.updatePastReports(state.reports.list);
    },

    /**
     * Update past reports list
     * @param {array} reports - Reports array
     */
    updatePastReports(reports) {
        const container = document.getElementById('pastReportsList');
        if (!container) return;

        if (!reports || reports.length === 0) {
            container.innerHTML = `
                <div class="text-center p-8 text-gray-500">
                    <p>Belum ada laporan</p>
                </div>
            `;
            return;
        }

        container.innerHTML = reports.map(report => `
            <div class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <p class="font-semibold text-gray-800">${report.date}</p>
                        <p class="text-sm text-gray-600">HB: ${report.hb_value || '-'} g/dL</p>
                    </div>
                    <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        ${report.status || 'Selesai'}
                    </span>
                </div>
                ${report.notes ? `<p class="text-sm text-gray-500 mt-2">${report.notes}</p>` : ''}
            </div>
        `).join('');
    },

    /**
     * Initialize charts
     */
    initializeCharts() {
        if (window.Charts) {
            setTimeout(() => {
                // Initialize 6-month HB chart
                const canvas = document.getElementById('hb6MonthChart');
                if (canvas && !canvas.chart) {
                    window.Charts.initHB6MonthChart();
                }
            }, 100);
        }
    },

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Filter buttons, if any
        const filterButtons = document.querySelectorAll('#reportsScreen .filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleFilter(btn.dataset.filter);
            });
        });
    },

    /**
     * Handle filter
     * @param {string} filter - Filter type
     */
    async handleFilter(filter) {
        Logger.info('🔍 ReportsScreen: Filtering:', filter);
        
        await ReportController.loadReports({ status: filter });
        this.updateReportsData();
    },

    /**
     * Refresh data
     */
    async refresh() {
        Logger.info('🔄 ReportsScreen: Refreshing data');
        await this.loadData();
    },

    /**
     * Cleanup
     */
    cleanup() {
        Logger.info('🧹 ReportsScreen: Cleanup');
    }
};

export default ReportsScreen;