/**
 * Modiva - Profile Controller
 * Handles user profile management
 * @module controllers/profile
 */

import { UserModel } from '../models/User.model.js';
import { analyticsService, EventTypes } from '../services/analytics/analytics.service.js';
import { UserAPI } from '../services/api/user.api.js';
import { localStorageService } from '../services/storage/local.storage.js';
import { ActionTypes, store } from '../state/store.js';
import { Logger } from '../utils/logger.js';
import { imageValidator } from '../services/image/validator.js'; // Import directly if possible
import { imageCompressor } from '../services/image/compressor.js'; // Import directly if possible

/**
 * Profile Controller
 */
export const ProfileController = {
    /**
     * Load user profile
     * @returns {Promise<void>}
     */
    async loadProfile() {
        Logger.info('👤 ProfileController: Loading profile');

        try {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'profile', isLoading: true });

            const response = await UserAPI.getProfile();

            // FIX: Added safer check for response structure
            if (response && response.success && response.data) {
                // Ensure data is passed correctly to UserModel
                const user = UserModel.fromAPIResponse(response.data);

                // Update state
                store.dispatch(ActionTypes.USER_SET_PROFILE, user.toJSON());

                // Update storage
                localStorageService.setUserProfile(user.toJSON());

                // Track page view
                if (analyticsService && typeof analyticsService.trackPageView === 'function') {
                    analyticsService.trackPageView('profile');
                }

                Logger.success('✅ Profile loaded');
            } else {
                Logger.warn('⚠️ Profile API response invalid or empty');
            }

        } catch (error) {
            Logger.error('❌ Failed to load profile:', error);

            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'error',
                message: 'Gagal memuat profil'
            });

        } finally {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'profile', isLoading: false });
        }
    },

    /**
     * Update user profile
     * @param {object} updates - Profile updates
     * @returns {Promise<void>}
     */
    async updateProfile(updates) {
        Logger.info('✏️ ProfileController: Updating profile');

        try {
            // Validate updates
            const currentUser = this.getCurrentUser();
            
            // FIX: Check if currentUser exists before cloning
            if (!currentUser) {
                throw new Error('Data pengguna tidak ditemukan');
            }

            const updatedUser = currentUser.clone().update(updates);
            
            const validation = updatedUser.validate();
            if (!validation.valid) {
                const errorMessage = validation.errors.map(e => e.message).join(', ');
                throw new Error(errorMessage);
            }

            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'updateProfile', isLoading: true });

            const response = await UserAPI.updateProfile(updates);

            if (response && response.success) {
                // Update state
                store.dispatch(ActionTypes.USER_UPDATE_PROFILE, updates);

                // Update storage
                localStorageService.updateUserProfile(updates);

                // Track analytics
                if (analyticsService) {
                    analyticsService.trackEvent(EventTypes.PROFILE_EDIT, {
                        fields: Object.keys(updates)
                    });
                }

                store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                    type: 'success',
                    message: 'Profil berhasil diperbarui'
                });

                Logger.success('✅ Profile updated');
            } else {
                throw new Error('Gagal menyimpan perubahan ke server');
            }

        } catch (error) {
            Logger.error('❌ Failed to update profile:', error);

            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'error',
                message: error.message || 'Gagal memperbarui profil'
            });

            throw error;

        } finally {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'updateProfile', isLoading: false });
        }
    },

    /**
     * Get current user from state
     * @returns {UserModel|null}
     */
    getCurrentUser() {
        const state = store.getState();
        // FIX: Return null if state or profile is missing, preventing crash
        if (!state || !state.user || !state.user.profile) {
            return null; 
        }
        return new UserModel(state.user.profile);
    },

    /**
     * Get user statistics
     * @returns {object} - User statistics
     */
    getUserStatistics() {
        const state = store.getState();
        
        // FIX: Add Safe Fallback if user data is missing
        if (!state || !state.user || !state.user.profile) {
            return {
                name: 'Pengguna',
                consumptionPercentage: 0,
                currentHB: 0,
                // ... default values for other fields to prevent UI crash
            };
        }

        const user = new UserModel(state.user.profile);
        const vitaminConsumption = state.user.vitaminConsumption || { count: 0, target: 0 };
        const hemoglobin = state.user.hemoglobin || { current: 0 };
        const statistics = state.user.statistics || { totalReports: 0 };

        return {
            name: user.name || 'Pengguna',
            nisn: user.nisn || '-',
            school: user.school || '-',
            email: user.email || '-',
            height: user.height || 0,
            weight: user.weight || 0,
            bmi: typeof user.getBMI === 'function' ? user.getBMI() : 0,
            bmiCategory: typeof user.getBMICategory === 'function' ? user.getBMICategory() : 'Normal',
            age: typeof user.getAge === 'function' ? user.getAge() : 0,
            
            // FIX: Safely access nested properties
            consumptionCount: vitaminConsumption.count,
            consumptionTarget: vitaminConsumption.target,
            consumptionPercentage: typeof user.getConsumptionPercentage === 'function' ? user.getConsumptionPercentage() : 0,
            consumptionStatus: typeof user.getConsumptionStatus === 'function' ? user.getConsumptionStatus() : 'normal',
            
            currentHB: hemoglobin.current,
            hbStatus: typeof user.getHBStatus === 'function' ? user.getHBStatus() : 'normal',
            totalReports: statistics.totalReports
        };
    },

    /**
     * Update user preferences
     * @param {object} preferences - User preferences
     * @returns {Promise<void>}
     */
    async updatePreferences(preferences) {
        Logger.info('⚙️ ProfileController: Updating preferences');

        try {
            // Update state
            store.dispatch(ActionTypes.USER_SET_PREFERENCES, preferences);

            // Update storage
            // FIX: Ensure this logic aligns with your storage service structure
            localStorageService.updateUserProfile({ 
                preferences 
            });

            // Track analytics
            if (analyticsService) {
                analyticsService.trackEvent(EventTypes.CUSTOM_EVENT, {
                    action: 'update_preferences',
                    preferences: Object.keys(preferences)
                });
            }

            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'success',
                message: 'Preferensi berhasil diperbarui'
            });

            Logger.success('✅ Preferences updated');

        } catch (error) {
            Logger.error('❌ Failed to update preferences:', error);
            // Optional: Revert state if storage fails (advanced handling)
            throw error;
        }
    },

    /**
     * Upload avatar
     * @param {File} file - Avatar image file
     * @returns {Promise<void>}
     */
    async uploadAvatar(file) {
        Logger.info('📸 ProfileController: Uploading avatar');

        try {
            // Validate image
            // FIX: Use imported validator directly if static import works, or keep dynamic import if needed for code splitting
            // const imageValidator = await import('../services/image/validator.js'); 
            await imageValidator.validate(file);

            // Compress image
            // const imageCompressor = await import('../services/image/compressor.js');
            const compressed = await imageCompressor.compress(file, {
                maxWidth: 200,
                maxHeight: 200,
                quality: 0.8
            });

            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'uploadAvatar', isLoading: true });

            // Create local URL (Temporary solution as noted in original code)
            const avatarUrl = URL.createObjectURL(compressed);

            // Update profile
            await this.updateProfile({ avatar: avatarUrl });

            Logger.success('✅ Avatar uploaded');

        } catch (error) {
            Logger.error('❌ Failed to upload avatar:', error);

            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'error',
                message: error.message || 'Gagal mengupload foto profil'
            });

            throw error;

        } finally {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'uploadAvatar', isLoading: false });
        }
    }
};

export default ProfileController;