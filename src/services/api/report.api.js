/**
 * Modiva - Report API
 * API calls for report management
 * @module services/api/report.api
 */
import { apiService } from './api.service.js';
import { ApiEndpoints, USE_MOCK_API, MOCK_API_DELAY } from '../../config/api.config.js';
import { Logger } from '../../utils/logger.js';
/**
 * Mock Report API
 */
const MockReportAPI = {
    /**
     * Mock submit report
     */
    async submit(reportData) {
        await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY * 1.5));
        
        Logger.info('🎭 Mock API: Submit Report', reportData);
        
        return {
            success: true,
            status: 'success',
            message: 'Laporan berhasil dikirim.',
            data: {
                report_id: 'RPT-' + Date.now(),
                date: reportData.date,
                timestamp: new Date().toISOString(),
                photo_url: 'https://cdn.modiva.app/reports/RPT-' + Date.now() + '.jpg'
            }
        };
    },
    /**
     * Mock get all reports
     */
    async getAll(params = {}) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        Logger.info('🎭 Mock API: Get All Reports', params);
        
        return {
            success: true,
            data: {
                hb_trends: [11.8, 12.0, 12.2, 12.1, 12.3, 12.5],
                consumption_rate: 85,
                total_count: 8,
                reports: [
                    {
                        id: 'RPT-001',
                        date: '2024-05-15',
                        hb_value: 12.5,
                        status: 'Selesai',
                        photo_url: 'https://cdn.modiva.app/reports/RPT-001.jpg',
                        notes: 'Diminum setelah makan',
                        created_at: '2024-05-15T08:30:00Z'
                    },
                    {
                        id: 'RPT-002',
                        date: '2024-05-14',
                        hb_value: 12.3,
                        status: 'Selesai',
                        photo_url: 'https://cdn.modiva.app/reports/RPT-002.jpg',
                        created_at: '2024-05-14T08:30:00Z'
                    }
                ]
            },
            meta: {
                page: params.page || 1,
                limit: params.limit || 10,
                total: 8
            }
        };
    }
};
/**
 * Report API
 */
export const ReportAPI = {
    /**
     * Submit new report
     * @param {FormData|object} reportData - Report data
     * @returns {Promise<object>} - Submit response
     */
    async submit(reportData) {
        if (USE_MOCK_API) {
            return await MockReportAPI.submit(reportData);
        }
        
        const endpoint = ApiEndpoints.reports.submit;
        return await apiService.upload(endpoint.url, reportData, {
            timeout: endpoint.timeout
        });
    },
    /**
     * Get all reports
     * @param {object} params - Query parameters
     * @returns {Promise<object>} - Reports data
     */
    async getAll(params = {}) {
        if (USE_MOCK_API) {
            return await MockReportAPI.getAll(params);
        }
        
        const endpoint = ApiEndpoints.reports.getAll;
        return await apiService.get(endpoint.url, {
            query: params,
            timeout: endpoint.timeout
        });
    },
    /**
     * Get report by ID
     * @param {string} id - Report ID
     * @returns {Promise<object>} - Report data
     */
    async getById(id) {
        const endpoint = ApiEndpoints.reports.getById;
        return await apiService.get(endpoint.url, {
            params: { id },
            timeout: endpoint.timeout
        });
    }
};
export default ReportAPI;