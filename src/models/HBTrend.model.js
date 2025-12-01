/**
 * Modiva - HB Trend Model
 * Hemoglobin trend data model with validation and calculations
 * @module models/HBTrend
 */
import { HemoglobinConstants, Gender } from '../config/constants.js';
import { Logger } from '../utils/logger.js';
/**
 * HB Trend Model Class
 */
export class HBTrendModel {
    constructor(data = {}) {
        this.id = data.id || null;
        this.userId = data.userId || data.user_id || null;
        this.value = data.value || null;
        this.date = data.date || null;
        this.measurementMethod = data.measurementMethod || data.measurement_method || 'lab';
        this.notes = data.notes || '';
        this.createdAt = data.createdAt || data.created_at || null;
        this.updatedAt = data.updatedAt || data.updated_at || null;
    }
    /**
     * Validate HB trend data
     * @returns {object} - { valid: boolean, errors: array }
     */
    validate() {
        const errors = [];
        // Validate value
        if (this.value === null || this.value === undefined) {
            errors.push({
                field: 'value',
                message: 'Nilai HB harus diisi'
            });
        } else if (this.value < 0 || this.value > 25) {
            errors.push({
                field: 'value',
                message: 'Nilai HB harus antara 0-25 g/dL'
            });
        }
        // Validate date
        if (!this.date) {
            errors.push({
                field: 'date',
                message: 'Tanggal pengukuran harus diisi'
            });
        } else {
            const measurementDate = new Date(this.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (measurementDate > today) {
                errors.push({
                    field: 'date',
                    message: 'Tanggal pengukuran tidak boleh di masa depan'
                });
            }
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
    /**
     * Get HB status based on gender
     * @param {string} gender - Gender (M/F)
     * @returns {string}
     */
    getStatus(gender = Gender.FEMALE) {
        if (this.value === null) return 'unknown';
        const normalMin = gender === Gender.MALE 
            ? HemoglobinConstants.NORMAL_MIN_MALE 
            : HemoglobinConstants.NORMAL_MIN_FEMALE;
        
        const normalMax = gender === Gender.MALE 
            ? HemoglobinConstants.NORMAL_MAX_MALE 
            : HemoglobinConstants.NORMAL_MAX_FEMALE;
        if (this.value < HemoglobinConstants.SEVERE_ANEMIA) {
            return HemoglobinConstants.STATUS_SEVERE;
        } else if (this.value < HemoglobinConstants.MODERATE_ANEMIA) {
            return HemoglobinConstants.STATUS_MODERATE;
        } else if (this.value < normalMin) {
            return HemoglobinConstants.STATUS_MILD;
        } else if (this.value <= normalMax) {
            return HemoglobinConstants.STATUS_NORMAL;
        } else {
            return HemoglobinConstants.STATUS_HIGH;
        }
    }
    /**
     * Get status color
     * @param {string} gender - Gender
     * @returns {string}
     */
    getStatusColor(gender = Gender.FEMALE) {
        const status = this.getStatus(gender);
        switch (status) {
            case HemoglobinConstants.STATUS_SEVERE:
            case HemoglobinConstants.STATUS_MODERATE:
                return '#ef4444'; // Red
            case HemoglobinConstants.STATUS_MILD:
                return '#f59e0b'; // Yellow/Orange
            case HemoglobinConstants.STATUS_NORMAL:
                return '#10b981'; // Green
            case HemoglobinConstants.STATUS_HIGH:
                return '#3b82f6'; // Blue
            default:
                return '#6b7280'; // Gray
        }
    }
    /**
     * Get status label
     * @param {string} gender - Gender
     * @returns {string}
     */
    getStatusLabel(gender = Gender.FEMALE) {
        const status = this.getStatus(gender);
        switch (status) {
            case HemoglobinConstants.STATUS_SEVERE:
                return 'Anemia Berat';
            case HemoglobinConstants.STATUS_MODERATE:
                return 'Anemia Sedang';
            case HemoglobinConstants.STATUS_MILD:
                return 'Anemia Ringan';
            case HemoglobinConstants.STATUS_NORMAL:
                return 'Normal';
            case HemoglobinConstants.STATUS_HIGH:
                return 'Tinggi';
            default:
                return 'Tidak Diketahui';
        }
    }
    /**
     * Check if anemic
     * @param {string} gender - Gender
     * @returns {boolean}
     */
    isAnemic(gender = Gender.FEMALE) {
        const status = this.getStatus(gender);
        return [
            HemoglobinConstants.STATUS_SEVERE,
            HemoglobinConstants.STATUS_MODERATE,
            HemoglobinConstants.STATUS_MILD
        ].includes(status);
    }
    /**
     * Get formatted value
     * @returns {string}
     */
    getFormattedValue() {
        if (this.value === null) return '-';
        return `${this.value.toFixed(1)} g/dL`;
    }
    /**
     * Get formatted date
     * @returns {string}
     */
    getFormattedDate() {
        if (!this.date) return '-';
        const date = new Date(this.date);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    /**
     * Get days since measurement
     * @returns {number}
     */
    getDaysSinceMeasurement() {
        if (!this.date) return 0;
        const measurementDate = new Date(this.date);
        const today = new Date();
        const diffTime = Math.abs(today - measurementDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    /**
     * Check if measurement is recent (within 30 days)
     * @returns {boolean}
     */
    isRecent() {
        return this.getDaysSinceMeasurement() <= 30;
    }
    /**
     * Compare with another HB value
     * @param {number} previousValue - Previous HB value
     * @returns {object} - { trend: string, difference: number, percentage: number }
     */
    compareWith(previousValue) {
        if (this.value === null || previousValue === null) {
            return {
                trend: 'stable',
                difference: 0,
                percentage: 0
            };
        }
        const difference = this.value - previousValue;
        const percentage = ((difference / previousValue) * 100).toFixed(1);
        let trend = 'stable';
        if (difference > 0.2) trend = 'up';
        else if (difference < -0.2) trend = 'down';
        return {
            trend,
            difference: parseFloat(difference.toFixed(1)),
            percentage: parseFloat(percentage)
        };
    }
    /**
     * Get trend icon
     * @param {number} previousValue - Previous HB value
     * @returns {string}
     */
    getTrendIcon(previousValue) {
        const comparison = this.compareWith(previousValue);
        switch (comparison.trend) {
            case 'up':
                return '↑';
            case 'down':
                return '↓';
            default:
                return '→';
        }
    }
    /**
     * Get trend color
     * @param {number} previousValue - Previous HB value
     * @returns {string}
     */
    getTrendColor(previousValue) {
        const comparison = this.compareWith(previousValue);
        switch (comparison.trend) {
            case 'up':
                return '#10b981'; // Green
            case 'down':
                return '#ef4444'; // Red
            default:
                return '#6b7280'; // Gray
        }
    }
    /**
     * Convert to JSON
     * @returns {object}
     */
    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            value: this.value,
            date: this.date,
            measurementMethod: this.measurementMethod,
            notes: this.notes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
    /**
     * Convert to API format (snake_case)
     * @returns {object}
     */
    toAPIFormat() {
        return {
            id: this.id,
            user_id: this.userId,
            value: this.value,
            date: this.date,
            measurement_method: this.measurementMethod,
            notes: this.notes,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        };
    }
    /**
     * Get summary data
     * @param {string} gender - Gender
     * @returns {object}
     */
    getSummary(gender = Gender.FEMALE) {
        return {
            id: this.id,
            value: this.value,
            formattedValue: this.getFormattedValue(),
            date: this.getFormattedDate(),
            status: this.getStatusLabel(gender),
            statusColor: this.getStatusColor(gender),
            isAnemic: this.isAnemic(gender),
            isRecent: this.isRecent()
        };
    }
    /**
     * Create from API response
     * @param {object} data - API response data
     * @returns {HBTrendModel}
     */
    static fromAPIResponse(data) {
        return new HBTrendModel({
            id: data.id,
            userId: data.user_id,
            value: data.value,
            date: data.date,
            measurementMethod: data.measurement_method,
            notes: data.notes,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        });
    }
    /**
     * Create from simple value and date
     * @param {number} value - HB value
     * @param {string} date - Measurement date
     * @returns {HBTrendModel}
     */
    static fromValue(value, date) {
        return new HBTrendModel({
            value,
            date,
            createdAt: new Date().toISOString()
        });
    }
    /**
     * Clone HB trend
     * @returns {HBTrendModel}
     */
    clone() {
        return new HBTrendModel(this.toJSON());
    }
    /**
     * Update fields
     * @param {object} updates - Fields to update
     * @returns {HBTrendModel}
     */
    update(updates) {
        Object.keys(updates).forEach(key => {
            if (this.hasOwnProperty(key)) {
                this[key] = updates[key];
            }
        });
        this.updatedAt = new Date().toISOString();
        return this;
    }
    /**
     * Log HB trend info (for debugging)
     */
    log() {
        Logger.info('HB Trend Model:', this.toJSON());
    }
    /**
     * Calculate average from multiple HB trends
     * @param {HBTrendModel[]} trends - Array of HB trends
     * @returns {number|null}
     */
    static calculateAverage(trends) {
        if (!trends || trends.length === 0) return null;
        const values = trends.map(t => t.value).filter(v => v !== null);
        if (values.length === 0) return null;
        const sum = values.reduce((acc, val) => acc + val, 0);
        return parseFloat((sum / values.length).toFixed(1));
    }
    /**
     * Get trend direction from multiple HB trends
     * @param {HBTrendModel[]} trends - Array of HB trends (chronological order)
     * @returns {string} - 'up', 'down', or 'stable'
     */
    static getTrendDirection(trends) {
        if (!trends || trends.length < 2) return 'stable';
        const values = trends.map(t => t.value).filter(v => v !== null);
        if (values.length < 2) return 'stable';
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));
        const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        const difference = avgSecond - avgFirst;
        if (difference > 0.2) return 'up';
        if (difference < -0.2) return 'down';
        return 'stable';
    }
    /**
     * Get min and max from multiple HB trends
     * @param {HBTrendModel[]} trends - Array of HB trends
     * @returns {object} - { min: number, max: number }
     */
    static getMinMax(trends) {
        if (!trends || trends.length === 0) {
            return { min: null, max: null };
        }
        const values = trends.map(t => t.value).filter(v => v !== null);
        if (values.length === 0) {
            return { min: null, max: null };
        }
        return {
            min: Math.min(...values),
            max: Math.max(...values)
        };
    }
}
export default HBTrendModel;
