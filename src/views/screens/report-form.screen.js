/**
 * Modiva - Report Form Screen
 * Form for submitting vitamin consumption report
 * @module views/screens/report-form
 */

import { Logger } from '../../utils/logger.js';
import { ReportController } from '../../controllers/report.controller.js';

/**
 * Report Form Screen Component
 */
export const ReportFormScreen = {
    /**
     * Screen ID
     */
    id: 'reportFormScreen',

    /**
     * Selected image file
     */
    selectedImage: null,

    /**
     * Initialize report form screen
     */
    init() {
        Logger.info('📝 ReportFormScreen: Initializing');
        
        this.render();
        this.attachEventListeners();
        this.loadDraft();
        this.setDefaultDate();
    },

    /**
     * Render screen
     */
    render() {
        const container = document.getElementById(this.id);
        
        if (!container) {
            Logger.error('Report form screen container not found');
            return;
        }

        container.classList.add('active');
    },

    /**
     * Set default date to today
     */
    setDefaultDate() {
        const dateInput = document.getElementById('consumptionDate');
        if (dateInput && !dateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    },

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Form submission
        const form = document.getElementById('reportForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(e);
            });
        }

        // Image upload
        const photoInput = document.getElementById('photoInput');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => {
                this.handleImageUpload(e);
            });
        }

        // Save draft on input change
        const inputs = form?.querySelectorAll('input, textarea');
        inputs?.forEach(input => {
            input.addEventListener('change', () => {
                this.saveDraft();
            });
        });
    },

    /**
     * Handle image upload
     * @param {Event} event - Change event
     */
    handleImageUpload(event) {
        const file = event.target.files[0];
        
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Mohon pilih file gambar');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file terlalu besar. Maksimal 5MB');
            return;
        }

        this.selectedImage = file;

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImg = document.getElementById('previewImg');
            if (previewImg) {
                previewImg.src = e.target.result;
            }

            const uploadPlaceholder = document.getElementById('uploadPlaceholder');
            const imagePreview = document.getElementById('imagePreview');
            const uploadArea = document.getElementById('uploadArea');

            if (uploadPlaceholder) uploadPlaceholder.classList.add('hidden');
            if (imagePreview) imagePreview.classList.remove('hidden');
            if (uploadArea) uploadArea.classList.add('has-image');
        };
        reader.readAsDataURL(file);

        Logger.info('📷 Image selected:', file.name, `(${(file.size / 1024).toFixed(2)}KB)`);
    },

    /**
     * Handle form submission
     * @param {Event} event - Submit event
     */
    async handleSubmit(event) {
        event.preventDefault();

        const date = document.getElementById('consumptionDate')?.value;
        const notes = document.getElementById('notes')?.value;

        // Validation
        if (!date) {
            alert('Mohon pilih tanggal konsumsi');
            return;
        }

        if (!this.selectedImage) {
            alert('Mohon upload bukti foto');
            return;
        }

        try {
            Logger.info('📤 ReportFormScreen: Submitting report');

            // Submit via controller
            const result = await ReportController.submitReport({
                date,
                photo: this.selectedImage,
                notes
            });

            if (result.success) {
                Logger.success('✅ Report submitted successfully');

                // Clear draft
                this.clearDraft();

                // Reset form
                this.resetForm();

                // Show success modal (handled by controller)
                // Navigation will happen when modal is closed
            }

        } catch (error) {
            Logger.error('❌ Report submission failed:', error);
            // Error is handled by controller
        }
    },

    /**
     * Reset form
     */
    resetForm() {
        const form = document.getElementById('reportForm');
        if (form) {
            form.reset();
        }

        this.selectedImage = null;

        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const imagePreview = document.getElementById('imagePreview');
        const uploadArea = document.getElementById('uploadArea');

        if (uploadPlaceholder) uploadPlaceholder.classList.remove('hidden');
        if (imagePreview) imagePreview.classList.add('hidden');
        if (uploadArea) uploadArea.classList.remove('has-image');

        this.setDefaultDate();
    },

    /**
     * Save draft
     */
    saveDraft() {
        const date = document.getElementById('consumptionDate')?.value;
        const notes = document.getElementById('notes')?.value;

        const draft = {
            date,
            notes,
            savedAt: Date.now()
        };

        ReportController.saveReportDraft(draft);
    },

    /**
     * Load draft
     */
    loadDraft() {
        const draft = ReportController.loadReportDraft();

        if (draft) {
            const dateInput = document.getElementById('consumptionDate');
            const notesInput = document.getElementById('notes');

            if (dateInput && draft.date) dateInput.value = draft.date;
            if (notesInput && draft.notes) notesInput.value = draft.notes;

            Logger.info('📥 Draft loaded');
        }
    },

    /**
     * Clear draft
     */
    clearDraft() {
        ReportController.clearReportDraft();
    },

    /**
     * Cleanup
     */
    cleanup() {
        Logger.info('🧹 ReportFormScreen: Cleanup');
        
        // Save draft before leaving
        if (this.selectedImage || document.getElementById('notes')?.value) {
            this.saveDraft();
        }
    }
};

export default ReportFormScreen;