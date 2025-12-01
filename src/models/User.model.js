/**
 * Modiva - User Model
 * User data model with validation and transformations
 * @module models/User
 */
import { ValidationConstants, Gender, UserRoles } from '../config/constants.js';
import { Logger } from '../utils/logger.js';
/**
 * User Model Class
 */
export class UserModel {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || null;
        this.nisn = data.nisn || null;
        this.email = data.email || null;
        this.phone = data.phone || null;
        this.school = data.school || null;
        this.schoolId = data.schoolId || null;
        this.address = data.address || null;
        this.birthDate = data.birthDate || data.birth_date || null;
        this.gender = data.gender || null;
        this.height = data.height || null;
        this.weight = data.weight || null;
        this.avatar = data.avatar || null;
        this.role = data.role || UserRoles.STUDENT;
        
        // Health data
        this.hbLast = data.hbLast || data.hb_last || null;
        this.consumptionCount = data.consumptionCount || data.consumption_count || 0;
        this.totalTarget = data.totalTarget || data.total_target || 48;
        
        // Timestamps
        this.createdAt = data.createdAt || data.created_at || null;
        this.updatedAt = data.updatedAt || data.updated_at || null;
    }
    /**
     * Validate user data
     * @returns {object} - { valid: boolean, errors: array }
     */
    validate() {
        const errors = [];
        // Validate name
        if (!this.name || this.name.trim().length < ValidationConstants.NAME_MIN_LENGTH) {
            errors.push({
                field: 'name',
                message: `Nama minimal ${ValidationConstants.NAME_MIN_LENGTH} karakter`
            });
        }
        if (this.name && this.name.length > ValidationConstants.NAME_MAX_LENGTH) {
            errors.push({
                field: 'name',
                message: `Nama maksimal ${ValidationConstants.NAME_MAX_LENGTH} karakter`
            });
        }
        // Validate NISN
        if (!this.nisn || !ValidationConstants.NISN_PATTERN.test(this.nisn)) {
            errors.push({
                field: 'nisn',
                message: `NISN harus ${ValidationConstants.NISN_LENGTH} digit angka`
            });
        }
        // Validate email
        if (this.email && !ValidationConstants.EMAIL_PATTERN.test(this.email)) {
            errors.push({
                field: 'email',
                message: 'Format email tidak valid'
            });
        }
        // Validate phone
        if (this.phone && !ValidationConstants.PHONE_PATTERN.test(this.phone)) {
            errors.push({
                field: 'phone',
                message: 'Format nomor telepon tidak valid'
            });
        }
        // Validate gender
        if (this.gender && !Object.values(Gender).includes(this.gender)) {
            errors.push({
                field: 'gender',
                message: 'Jenis kelamin tidak valid'
            });
        }
        // Validate height
        if (this.height !== null && (this.height < ValidationConstants.MIN_HEIGHT || this.height > ValidationConstants.MAX_HEIGHT)) {
            errors.push({
                field: 'height',
                message: `Tinggi badan harus antara ${ValidationConstants.MIN_HEIGHT}-${ValidationConstants.MAX_HEIGHT} cm`
            });
        }
        // Validate weight
        if (this.weight !== null && (this.weight < ValidationConstants.MIN_WEIGHT || this.weight > ValidationConstants.MAX_WEIGHT)) {
            errors.push({
                field: 'weight',
                message: `Berat badan harus antara ${ValidationConstants.MIN_WEIGHT}-${ValidationConstants.MAX_WEIGHT} kg`
            });
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
    /**
     * Check if user data is complete
     * @returns {boolean}
     */
    isComplete() {
        return !!(
            this.name &&
            this.nisn &&
            this.email &&
            this.school &&
            this.gender &&
            this.height &&
            this.weight
        );
    }
    /**
     * Get user's age
     * @returns {number|null}
     */
    getAge() {
        if (!this.birthDate) return null;
        const birthDate = new Date(this.birthDate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    /**
     * Get BMI (Body Mass Index)
     * @returns {number|null}
     */
    getBMI() {
        if (!this.height || !this.weight) return null;
        const heightInMeters = this.height / 100;
        const bmi = this.weight / (heightInMeters * heightInMeters);
        return Math.round(bmi * 10) / 10; // Round to 1 decimal
    }
    /**
     * Get BMI category
     * @returns {string|null}
     */
    getBMICategory() {
        const bmi = this.getBMI();
        if (bmi === null) return null;
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    }
    /**
     * Get consumption percentage
     * @returns {number}
     */
    getConsumptionPercentage() {
        if (this.totalTarget === 0) return 0;
        return Math.round((this.consumptionCount / this.totalTarget) * 100);
    }
    /**
     * Get consumption status
     * @returns {string}
     */
    getConsumptionStatus() {
        const percentage = this.getConsumptionPercentage();
        
        if (percentage >= 90) return 'excellent';
        if (percentage >= 75) return 'good';
        if (percentage >= 50) return 'moderate';
        return 'low';
    }
    /**
     * Get HB status
     * @returns {string|null}
     */
    getHBStatus() {
        if (this.hbLast === null) return null;
        const normalMin = this.gender === Gender.MALE ? 13.0 : 12.0;
        const normalMax = this.gender === Gender.MALE ? 17.0 : 16.0;
        if (this.hbLast < normalMin - 2) return 'severe';
        if (this.hbLast < normalMin) return 'low';
        if (this.hbLast <= normalMax) return 'normal';
        return 'high';
    }
    /**
     * Get display name
     * @returns {string}
     */
    getDisplayName() {
        return this.name || 'User';
    }
    /**
     * Get initials
     * @returns {string}
     */
    getInitials() {
        if (!this.name) return 'U';
        const parts = this.name.trim().split(' ');
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    /**
     * Convert to JSON
     * @returns {object}
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            nisn: this.nisn,
            email: this.email,
            phone: this.phone,
            school: this.school,
            schoolId: this.schoolId,
            address: this.address,
            birthDate: this.birthDate,
            gender: this.gender,
            height: this.height,
            weight: this.weight,
            avatar: this.avatar,
            role: this.role,
            hbLast: this.hbLast,
            consumptionCount: this.consumptionCount,
            totalTarget: this.totalTarget,
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
            name: this.name,
            nisn: this.nisn,
            email: this.email,
            phone: this.phone,
            school: this.school,
            school_id: this.schoolId,
            address: this.address,
            birth_date: this.birthDate,
            gender: this.gender,
            height: this.height,
            weight: this.weight,
            avatar: this.avatar,
            role: this.role,
            hb_last: this.hbLast,
            consumption_count: this.consumptionCount,
            total_target: this.totalTarget,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        };
    }
    /**
     * Get summary data
     * @returns {object}
     */
    getSummary() {
        return {
            id: this.id,
            name: this.name,
            nisn: this.nisn,
            school: this.school,
            hbLast: this.hbLast,
            hbStatus: this.getHBStatus(),
            consumptionCount: this.consumptionCount,
            consumptionPercentage: this.getConsumptionPercentage(),
            consumptionStatus: this.getConsumptionStatus()
        };
    }
    /**
     * Create from API response
     * @param {object} data - API response data
     * @returns {UserModel}
     */
    static fromAPIResponse(data) {
        return new UserModel({
            id: data.id,
            name: data.name,
            nisn: data.nisn,
            email: data.email,
            phone: data.phone,
            school: data.school,
            schoolId: data.school_id,
            address: data.address,
            birthDate: data.birth_date,
            gender: data.gender,
            height: data.height,
            weight: data.weight,
            avatar: data.avatar,
            role: data.role,
            hbLast: data.hb_last,
            consumptionCount: data.consumption_count,
            totalTarget: data.total_target,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        });
    }
    /**
     * Clone user
     * @returns {UserModel}
     */
    clone() {
        return new UserModel(this.toJSON());
    }
    /**
     * Update fields
     * @param {object} updates - Fields to update
     * @returns {UserModel}
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
     * Log user info (for debugging)
     */
    log() {
        Logger.info('User Model:', this.toJSON());
    }
}
export default UserModel;
