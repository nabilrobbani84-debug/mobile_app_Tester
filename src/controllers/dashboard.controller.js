/**
 * Modiva - Dashboard Controller
 * Handles dashboard/home screen logic
 * @module controllers/dashboard
 */

import { analyticsService, EventTypes } from '../services/analytics/analytics.service.js';
import { ReportAPI } from '../services/api/report.api.js';
import { UserAPI } from '../services/api/user.api.js';
import { localStorageService } from '../services/storage/local.storage.js';
import { ActionTypes, store } from '../state/store.js';
import { Logger } from '../utils/logger.js';

/**
 * Dashboard Controller
 */
export const DashboardController = {
    /**
     * Load dashboard data
     * @returns {Promise<void>}
     */
    async loadDashboardData() {
        Logger.info('📊 DashboardController: Loading dashboard data');

        try {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'dashboard', isLoading: true });

            // Load data in parallel
            const [reportsResponse, profileResponse] = await Promise.all([
                this.loadRecentReports(),
                this.refreshUserProfile()
            ]);

            // Track page view
            analyticsService.trackPageView('dashboard');

            Logger.success('✅ Dashboard data loaded');

        } catch (error) {
            Logger.error('❌ Failed to load dashboard data:', error);
            
            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'error',
                message: 'Gagal memuat data dashboard'
            });

        } finally {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'dashboard', isLoading: false });
        }
    },

    /**
     * Load recent reports
     * @returns {Promise<void>}
     */
    async loadRecentReports() {
        try {
            // Check cache first
            const cachedReports = localStorageService.getReportsCache();
            
            if (cachedReports && cachedReports.length > 0) {
                Logger.info('📦 Using cached reports');
                store.dispatch(ActionTypes.REPORT_SET_LIST, cachedReports);
                return;
            }

            // Fetch from API
            const response = await ReportAPI.getAll({ limit: 10 });

            if (response.success && response.data.reports) {
                // Update state
                store.dispatch(ActionTypes.REPORT_SET_LIST, response.data.reports);

                // Cache reports
                localStorageService.setReportsCache(response.data.reports);

                // Update HB trends if available
                if (response.data.hb_trends) {
                    this.updateHBTrends(response.data.hb_trends);
                }

                Logger.info(`✅ Loaded ${response.data.reports.length} reports`);
            }

        } catch (error) {
            Logger.error('❌ Failed to load reports:', error);
            throw error;
        }
    },

    /**
     * Refresh user profile
     * @returns {Promise<void>}
     */
    async refreshUserProfile() {
        try {
            const response = await UserAPI.getProfile();

            if (response.success && response.data) {
                // Update state
                store.dispatch(ActionTypes.USER_SET_PROFILE, response.data);

                // Update storage
                localStorageService.setUserProfile(response.data);

                Logger.info('✅ User profile refreshed');
            }

        } catch (error) {
            Logger.warn('⚠️ Failed to refresh profile:', error);
            // Don't throw, use cached data
        }
    },

    /**
     * Update HB trends
     * @param {array} trendsData - HB trends data
     */
    updateHBTrends(trendsData) {
        try {
            if (!Array.isArray(trendsData) || trendsData.length === 0) {
                return;
            }

            // Get latest HB value
            const latestHB = trendsData[trendsData.length - 1];

            // Update user HB
            store.dispatch(ActionTypes.USER_UPDATE_HB, latestHB);

            // Cache trends
            localStorageService.setHBTrendsCache({
                labels: ['Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr'],
                data: trendsData
            });

            Logger.info('✅ HB trends updated');

        } catch (error) {
            Logger.error('❌ Failed to update HB trends:', error);
        }
    },

    /**
     * Get dashboard summary
     * @returns {object} - Dashboard summary data
     */
    getDashboardSummary() {
        const state = store.getState();
        const user = state.user;

        return {
            userName: user.profile.name,
            consumptionCount: user.vitaminConsumption.count,
            consumptionTarget: user.vitaminConsumption.target,
            consumptionPercentage: user.vitaminConsumption.percentage,
            currentHB: user.hemoglobin.current,
            hbTrend: user.hemoglobin.trend,
            recentReports: state.reports.list.slice(0, 5)
        };
    },

    /**
     * Navigate to report form
     */
    navigateToReportForm() {
        Logger.info('📝 Navigating to report form');
        
        analyticsService.trackAction('navigate_report_form', 'dashboard');
        
        // Navigation will be handled by router
        // This is just tracking
    },

    /**
     * Navigate to health tips
     */
    navigateToHealthTips() {
        Logger.info('💡 Navigating to health tips');
        
        analyticsService.trackEvent(EventTypes.HEALTH_TIP_VIEW, {
            source: 'dashboard'
        });
    }
};

export default DashboardController;