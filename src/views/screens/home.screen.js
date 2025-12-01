/**
 * Modiva - Home/Dashboard Screen
 * Main dashboard for students
 * @module views/screens/home
 */

import { Logger } from '../../utils/logger.js';
import { DashboardController } from '../../controllers/dashboard.controller.js';
import { store } from '../../state/store.js';

/**
 * Home Screen Component
 */
export const HomeScreen = {
    /**
     * Screen ID
     */
    id: 'homeScreen',

    /**
     * Initialize home screen
     */
    async init() {
        Logger.info('🏠 HomeScreen: Initializing');
        
        this.render();
        await this.loadData();
        this.attachEventListeners();
    },

    /**
     * Render home screen
     */
    render() {
        const container = document.getElementById(this.id);
        
        if (!container) {
            Logger.error('Home screen container not found');
            return;
        }

        container.classList.add('active');
        
        // Update user data in UI
        this.updateUserData();
    },

    /**
     * Load dashboard data
     */
    async loadData() {
        try {
            await DashboardController.loadDashboardData();
            
            // Update UI with loaded data
            this.updateDashboardData();
            
            // Initialize charts
            this.initializeCharts();
            
        } catch (error) {
            Logger.error('❌ Failed to load dashboard data:', error);
        }
    },

    /**
     * Update user data in UI
     */
    updateUserData() {
        const state = store.getState();
        const user = state.user.profile;

        // Update user name
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = user.name || 'Pengguna';
        }

        // Update consumption count
        const consumptionCount = document.getElementById('consumptionCount');
        if (consumptionCount) {
            consumptionCount.textContent = state.user.vitaminConsumption.count || 0;
        }

        // Update total target
        const totalTarget = document.getElementById('totalTarget');
        if (totalTarget) {
            totalTarget.textContent = state.user.vitaminConsumption.target || 48;
        }

        // Update HB value
        const lastHB = document.getElementById('lastHB');
        if (lastHB) {
            lastHB.textContent = state.user.hemoglobin.current || '-';
        }

        // Update progress bar
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const percentage = state.user.vitaminConsumption.percentage || 0;
            progressBar.style.width = percentage + '%';
        }
    },

    /**
     * Update dashboard data
     */
    updateDashboardData() {
        const summary = DashboardController.getDashboardSummary();

        // Update recent history
        this.updateRecentHistory(summary.recentReports);
    },

    /**
     * Update recent history list
     * @param {array} reports - Recent reports
     */
    updateRecentHistory(reports) {
        const container = document.getElementById('recentHistory');
        if (!container) return;

        if (!reports || reports.length === 0) {
            container.innerHTML = `
                <div class="text-center p-8 text-gray-500">
                    <p>Belum ada riwayat konsumsi</p>
                </div>
            `;
            return;
        }

        container.innerHTML = reports.slice(0, 5).map(report => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                    <p class="font-semibold text-gray-800">${report.date}</p>
                    <p class="text-sm text-gray-600">Nilai HB: ${report.hb_value || '-'}</p>
                </div>
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    ${report.status || 'Selesai'}
                </span>
            </div>
        `).join('');
    },

    /**
     * Initialize charts
     */
    initializeCharts() {
        // Check if Charts module is available
        if (window.Charts) {
            setTimeout(() => {
                window.Charts.initCharts();
            }, 100);
        }
    },

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Report button
        const reportButton = document.querySelector('#homeScreen button[onclick*="reportFormScreen"]');
        if (reportButton) {
            reportButton.addEventListener('click', () => {
                this.navigateToReportForm();
            });
        }

        // Health tip button
        const healthTipButton = document.querySelector('#homeScreen button[onclick*="healthTipScreen"]');
        if (healthTipButton) {
            healthTipButton.addEventListener('click', () => {
                DashboardController.navigateToHealthTips();
            });
        }
    },

    /**
     * Navigate to report form
     */
    navigateToReportForm() {
        DashboardController.navigateToReportForm();
        
        import('../../routes/router.js').then(({ Router }) => {
            Router.navigate('reportForm');
        }).catch(() => {
            const Navigation = window.Navigation;
            if (Navigation) {
                Navigation.navigateTo('reportFormScreen');
            }
        });
    },

    /**
     * Refresh data
     */
    async refresh() {
        Logger.info('🔄 HomeScreen: Refreshing data');
        await this.loadData();
    },

    /**
     * Cleanup
     */
    cleanup() {
        Logger.info('🧹 HomeScreen: Cleanup');
    }
};

export default HomeScreen;