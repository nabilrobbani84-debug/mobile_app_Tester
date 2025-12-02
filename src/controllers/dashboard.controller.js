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
            // Note: We await Promise.allSettled to ensure one failure doesn't stop the other
            const results = await Promise.allSettled([
                this.loadRecentReports(),
                this.refreshUserProfile()
            ]);

            // Check if any request failed and log it (Optional)
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    Logger.warn(`⚠️ Dashboard partial load failed [Index ${index}]:`, result.reason);
                }
            });

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
            const cachedReports = await localStorageService.getReportsCache(); // Added await just in case
            
            if (cachedReports && Array.isArray(cachedReports) && cachedReports.length > 0) {
                Logger.info('📦 Using cached reports');
                store.dispatch(ActionTypes.REPORT_SET_LIST, cachedReports);
                // Return explicitly to stop execution, but don't prevent fetching fresh data if needed
                // If you want "stale-while-revalidate" strategy, remove the return
                return; 
            }

            // Fetch from API
            const response = await ReportAPI.getAll({ limit: 10 });

            // FIX: Added safer check for response.data
            if (response && response.success && response.data) {
                const reports = response.data.reports || [];

                // Update state
                store.dispatch(ActionTypes.REPORT_SET_LIST, reports);

                // Cache reports
                localStorageService.setReportsCache(reports);

                // Update HB trends if available
                if (response.data.hb_trends) {
                    this.updateHBTrends(response.data.hb_trends);
                }

                Logger.info(`✅ Loaded ${reports.length} reports`);
            } else {
                Logger.warn('⚠️ Reports API returned empty or invalid data');
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

            if (response && response.success && response.data) {
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
            // FIX: Generate dynamic labels instead of hardcoded ['Nov', 'Des', ...]
            // Or ensure trendsData matches the structure expected by the chart
            localStorageService.setHBTrendsCache({
                labels: trendsData.map((_, i) => `Data ${i + 1}`), // Fallback labels
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
        
        // FIX: Add safety check for state existence
        if (!state || !state.user) {
            return {
                userName: 'Pengguna',
                consumptionCount: 0,
                consumptionTarget: 0,
                consumptionPercentage: 0,
                currentHB: 0,
                hbTrend: 'stable',
                recentReports: []
            };
        }

        const user = state.user;
        const reports = state.reports || { list: [] };

        // FIX: Use Optional Chaining (?.) to prevent crashes if profile or vitaminConsumption is null
        return {
            userName: user.profile?.name || 'Pengguna',
            consumptionCount: user.vitaminConsumption?.count || 0,
            consumptionTarget: user.vitaminConsumption?.target || 0,
            consumptionPercentage: user.vitaminConsumption?.percentage || 0,
            currentHB: user.hemoglobin?.current || 0,
            hbTrend: user.hemoglobin?.trend || 'stable',
            recentReports: Array.isArray(reports.list) ? reports.list.slice(0, 5) : []
        };
    },

    /**
     * Navigate to report form
     */
    navigateToReportForm() {
        Logger.info('📝 Navigating to report form');
        
        // FIX: Add safety check for analyticsService
        if (analyticsService && typeof analyticsService.trackAction === 'function') {
            analyticsService.trackAction('navigate_report_form', 'dashboard');
        }
    },

    /**
     * Navigate to health tips
     */
    navigateToHealthTips() {
        Logger.info('💡 Navigating to health tips');
        
        if (analyticsService && typeof analyticsService.trackEvent === 'function') {
            analyticsService.trackEvent(EventTypes.HEALTH_TIP_VIEW, {
                source: 'dashboard'
            });
        }
    }
};

export default DashboardController;