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

            if (response.success && response.data) {
                const user = UserModel.fromAPIResponse(response.data);

                // Update state
                store.dispatch(ActionTypes.USER_SET_PROFILE, user.toJSON());

                // Update storage
                localStorageService.setUserProfile(user.toJSON());

                // Track page view
                analyticsService.trackPageView('profile');

                Logger.success('✅ Profile loaded');
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
            const updatedUser = currentUser.clone().update(updates);
            
            const validation = updatedUser.validate();
            if (!validation.valid) {
                const errorMessage = validation.errors.map(e => e.message).join(', ');
                throw new Error(errorMessage);
            }

            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'updateProfile', isLoading: true });

            const response = await UserAPI.updateProfile(updates);

            if (response.success) {
                // Update state
                store.dispatch(ActionTypes.USER_UPDATE_PROFILE, updates);

                // Update storage
                localStorageService.updateUserProfile(updates);

                // Track analytics
                analyticsService.trackEvent(EventTypes.PROFILE_EDIT, {
                    fields: Object.keys(updates)
                });

                store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                    type: 'success',
                    message: 'Profil berhasil diperbarui'
                });

                Logger.success('✅ Profile updated');
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
     * @returns {UserModel}
     */
    getCurrentUser() {
        const state = store.getState();
        return new UserModel(state.user.profile);
    },

    /**
     * Get user statistics
     * @returns {object} - User statistics
     */
    getUserStatistics() {
        const state = store.getState();
        const user = new UserModel(state.user.profile);

        return {
            name: user.name,
            nisn: user.nisn,
            school: user.school,
            email: user.email,
            height: user.height,
            weight: user.weight,
            bmi: user.getBMI(),
            bmiCategory: user.getBMICategory(),
            age: user.getAge(),
            consumptionCount: state.user.vitaminConsumption.count,
            consumptionTarget: state.user.vitaminConsumption.target,
            consumptionPercentage: user.getConsumptionPercentage(),
            consumptionStatus: user.getConsumptionStatus(),
            currentHB: state.user.hemoglobin.current,
            hbStatus: user.getHBStatus(),
            totalReports: state.user.statistics.totalReports
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
            const currentUser = this.getCurrentUser();
            localStorageService.updateUserProfile({ 
                preferences 
            });

            // Track analytics
            analyticsService.trackEvent(EventTypes.CUSTOM_EVENT, {
                action: 'update_preferences',
                preferences: Object.keys(preferences)
            });

            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'success',
                message: 'Preferensi berhasil diperbarui'
            });

            Logger.success('✅ Preferences updated');

        } catch (error) {
            Logger.error('❌ Failed to update preferences:', error);
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
            const imageValidator = await import('../services/image/validator.js');
            await imageValidator.imageValidator.validate(file);

            // Compress image
            const imageCompressor = await import('../services/image/compressor.js');
            const compressed = await imageCompressor.imageCompressor.compress(file, {
                maxWidth: 200,
                maxHeight: 200,
                quality: 0.8
            });

            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'uploadAvatar', isLoading: true });

            // Upload to API (mock)
            // const response = await UserAPI.uploadAvatar(compressed);

            // For now, create local URL
            const avatarUrl = URL.createObjectURL(compressed);

            // Update profile
            await this.updateProfile({ avatar: avatarUrl });

            Logger.success('✅ Avatar uploaded');

        } catch (error) {
            Logger.error('❌ Failed to upload avatar:', error);

            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'error',
                message: 'Gagal mengupload foto profil'
            });

            throw error;

        } finally {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'uploadAvatar', isLoading: false });
        }
    }
};

export default ProfileController;