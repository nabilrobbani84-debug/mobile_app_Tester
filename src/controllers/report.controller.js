/**
 * Modiva - Report Controller
 * Handles report submission and management
 * @module controllers/report
 */

import { ReportModel } from '../models/Report.model.js';
import { analyticsService, EventTypes } from '../services/analytics/analytics.service.js';
import { ReportAPI } from '../services/api/report.api.js';
import { imageCompressor } from '../services/image/compressor.js';
import { imageValidator } from '../services/image/validator.js';
import { localStorageService } from '../services/storage/local.storage.js';
import { ActionTypes, store } from '../state/store.js';
import { Logger } from '../utils/logger.js';

/**
 * Report Controller
 */
export const ReportController = {
    // Controller for handling report logic
    /**
     * Submit new report
     * @param {object} reportData - Report data
     * @param {string} reportData.date - Consumption date
     * @param {File} reportData.photo - Photo file
     * @param {string} reportData.notes - Optional notes
     * @returns {Promise<object>} - Submit result
     */
    async submitReport(reportData) {
        Logger.info('📤 ReportController: Submitting report');

        try {
            // Validate report data
            const report = new ReportModel(reportData);
            const validation = report.validate();

            if (!validation.valid) {
                const errorMessage = validation.errors.map(e => e.message).join(', ');
                throw new Error(errorMessage);
            }

            // Show loading
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'submitReport', isLoading: true });

            // Validate image
            if (reportData.photo) {
                await this.validateImage(reportData.photo);
            }

            // Compress image
            let compressedImage = reportData.photo;
            if (reportData.photo) {
                Logger.info('🗜️ Compressing image...');
                compressedImage = await this.compressImage(reportData.photo);
            }

            // Create FormData
            const formData = new FormData();
            formData.append('date', reportData.date);
            if (compressedImage) {
                formData.append('photo', compressedImage, 'vitamin-photo.jpg');
            }
            if (reportData.notes) {
                formData.append('notes', reportData.notes);
            }

            // Submit to API
            const response = await ReportAPI.submit(formData);

            if (response.success) {
                Logger.success('✅ Report submitted successfully');

                // Create new report model
                const newReport = new ReportModel({
                    id: response.data.report_id,
                    date: reportData.date,
                    photoUrl: response.data.photo_url,
                    notes: reportData.notes,
                    status: 'pending',
                    createdAt: response.data.timestamp
                });

                // Update state
                store.dispatch(ActionTypes.REPORT_ADD, newReport.toJSON());
                store.dispatch(ActionTypes.USER_INCREMENT_CONSUMPTION);

                // Clear cache
                localStorageService.clearReportsCache();

                // Track analytics
                analyticsService.trackEvent(EventTypes.REPORT_SUBMIT, {
                    date: reportData.date,
                    hasNotes: !!reportData.notes
                });

                // Track photo upload
                analyticsService.trackEvent(EventTypes.PHOTO_UPLOAD, {
                    originalSize: reportData.photo?.size,
                    compressedSize: compressedImage?.size
                });

                // Show success modal
                store.dispatch(ActionTypes.UI_SHOW_MODAL, {
                    type: 'success',
                    title: 'Berhasil!',
                    message: 'Laporan konsumsi vitamin berhasil dikirim.'
                });

                return {
                    success: true,
                    report: newReport.toJSON()
                };
            }

        } catch (error) {
            Logger.error('❌ Report submission failed:', error);

            analyticsService.trackError(error, {
                context: 'submit_report',
                date: reportData.date
            });

            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'error',
                message: error.message || 'Gagal mengirim laporan'
            });

            throw error;

        } finally {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'submitReport', isLoading: false });
        }
    },

    /**
     * Validate image
     * @param {File} file - Image file
     * @returns {Promise<void>}
     */
    async validateImage(file) {
        try {
            await imageValidator.validate(file, {
                validateDimensions: false,
                validateFileName: false
            });
        } catch (error) {
            Logger.error('❌ Image validation failed:', error);
            throw new Error(error.message || 'File gambar tidak valid');
        }
    },

    /**
     * Compress image
     * @param {File} file - Image file
     * @returns {Promise<Blob>} - Compressed image
     */
    async compressImage(file) {
        try {
            const startTime = Date.now();
            
            const compressed = await imageCompressor.compress(file, {
                maxWidth: 1024,
                maxHeight: 1024,
                quality: 0.7
            });

            const duration = Date.now() - startTime;

            // Track compression
            analyticsService.trackEvent(EventTypes.PHOTO_COMPRESS, {
                originalSize: file.size,
                compressedSize: compressed.size,
                compressionRatio: ((1 - compressed.size / file.size) * 100).toFixed(2),
                duration
            });

            Logger.info(`✅ Image compressed: ${(file.size / 1024).toFixed(2)}KB → ${(compressed.size / 1024).toFixed(2)}KB`);

            return compressed;

        } catch (error) {
            Logger.error('❌ Image compression failed:', error);
            // Return original if compression fails
            return file;
        }
    },

    /**
     * Load all reports
     * @param {object} filters - Filter options
     * @returns {Promise<void>}
     */
    async loadReports(filters = {}) {
        Logger.info('📋 ReportController: Loading reports');

        try {
            store.dispatch(ActionTypes.REPORT_SET_LOADING, true);

            const response = await ReportAPI.getAll(filters);

            if (response.success && response.data) {
                // Update state
                store.dispatch(ActionTypes.REPORT_SET_LIST, response.data.reports || []);

                // Update statistics
                if (response.data.hb_trends) {
                    // Update HB trends
                }

                Logger.success(`✅ Loaded ${response.data.reports?.length || 0} reports`);
            }

        } catch (error) {
            Logger.error('❌ Failed to load reports:', error);
            
            store.dispatch(ActionTypes.REPORT_SET_ERROR, error.message);

        } finally {
            store.dispatch(ActionTypes.REPORT_SET_LOADING, false);
        }
    },

    /**
     * Get report by ID
     * @param {string} reportId - Report ID
     * @returns {Promise<ReportModel>}
     */
    async getReportById(reportId) {
        try {
            const response = await ReportAPI.getById(reportId);

            if (response.success && response.data) {
                return ReportModel.fromAPIResponse(response.data);
            }

            throw new Error('Report not found');

        } catch (error) {
            Logger.error('❌ Failed to get report:', error);
            throw error;
        }
    },

    /**
     * Save report draft
     * @param {object} reportData - Report draft data
     */
    saveReportDraft(reportData) {
        try {
            localStorageService.setFormDraft('modiva_form_report_draft', reportData);
            Logger.info('💾 Report draft saved');

            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'info',
                message: 'Draft tersimpan'
            });

        } catch (error) {
            Logger.error('❌ Failed to save draft:', error);
        }
    },

    /**
     * Load report draft
     * @returns {object|null} - Draft data
     */
    loadReportDraft() {
        try {
            const draft = localStorageService.getFormDraft('modiva_form_report_draft');
            
            if (draft) {
                Logger.info('📥 Report draft loaded');
            }

            return draft;

        } catch (error) {
            Logger.error('❌ Failed to load draft:', error);
            return null;
        }
    },

    /**
     * Clear report draft
     */
    clearReportDraft() {
        localStorageService.clearFormDraft('modiva_form_report_draft');
        Logger.info('🗑️ Report draft cleared');
    }
};

export default ReportController;