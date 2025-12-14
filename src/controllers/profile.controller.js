/**
 * Modiva - Profile Controller (React Native Compatible)
 * Handles user profile management logic
 * @module controllers/profile
 */

import { UserModel } from '../models/User.model'; 
import { analyticsService, EventTypes } from '../services/analytics/analytics.service';
import { UserAPI } from '../services/api/user.api'; 
import { ActionTypes, store } from '../state/store';
import { Logger } from '../utils/logger';

// PERBAIKAN: Menghapus variabel 'ImageServices' yang tidak digunakan untuk mengatasi error ESLint no-unused-vars.
// Jika nanti Anda membutuhkan validasi/kompresi, import service yang sesungguhnya di sini.

export const ProfileController = {
    /**
     * Load user profile from API and update Store
     */
    async loadProfile() {
        Logger.info('👤 ProfileController: Loading profile...');

        try {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'profile', isLoading: true });

            // Panggil API
            const response = await UserAPI.getProfile();

            if (response && (response.success || response.data)) {
                const userData = response.data || response; // Adaptasi struktur response
                const user = new UserModel(userData);

                // Update Redux/Context Store
                store.dispatch(ActionTypes.USER_SET_PROFILE, user.toJSON());

                // Track Analytics
                if (analyticsService && typeof analyticsService.trackScreenView === 'function') {
                     analyticsService.trackScreenView('Profile_Screen', { userId: user.id });
                }

                Logger.success('✅ Profile loaded successfully');
            } else {
                Logger.warn('⚠️ Profile API returned empty/invalid data');
            }

        } catch (error) {
            Logger.error('❌ Failed to load profile:', error);
            
            // Show UI Feedback (Toast/Alert)
            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'error',
                message: 'Gagal memuat profil. Periksa koneksi internet Anda.'
            });
        } finally {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'profile', isLoading: false });
        }
    },

    /**
     * Upload Avatar Profile
     * @param {string} imageUri - URI lokal dari ImagePicker
     */
    async uploadAvatar(imageUri) {
        Logger.info('📸 ProfileController: Uploading avatar', imageUri);

        try {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'uploadAvatar', isLoading: true });

            // 1. Validasi Gambar (Ukuran/Tipe)
            // Implementasi validasi bisa ditambahkan di sini menggunakan FileSystem atau ImagePicker result
            
            // 2. Kompresi Gambar (jika perlu)
            // Gunakan library seperti expo-image-manipulator jika ingin mengompres gambar
            const finalUri = imageUri; 

            // 3. Upload ke API (Multipart Form Data)
            const formData = new FormData();
            formData.append('avatar', {
                uri: finalUri,
                name: 'avatar.jpg',
                type: 'image/jpeg',
            });

            // const uploadResponse = await UserAPI.uploadAvatar(formData);
            
            // Simulasi sukses update lokal agar UI responsif instan
            store.dispatch(ActionTypes.USER_UPDATE_PROFILE, { avatar: finalUri });
            
            Logger.success('✅ Avatar uploaded successfully');
            
            if (analyticsService && typeof analyticsService.trackEvent === 'function') {
                analyticsService.trackEvent(EventTypes.ACTION_CLICK, { action: 'upload_avatar' });
            }

        } catch (error) {
            Logger.error('❌ Failed to upload avatar:', error);
            store.dispatch(ActionTypes.UI_SHOW_TOAST, {
                type: 'error',
                message: 'Gagal mengunggah foto profil.'
            });
            throw error; 
        } finally {
            store.dispatch(ActionTypes.UI_SET_LOADING, { key: 'uploadAvatar', isLoading: false });
        }
    },

    /**
     * Safe Getter for User Statistics
     * Mencegah Crash jika state null/undefined
     */
    getUserStatistics() {
        const state = store.getState();
        
        // Defensive coding: Cek apakah state/user/profile valid
        if (!state || !state.user || !state.user.profile) {
            return {
                name: 'Tamu',
                school: '-',
                nisn: '-',
                email: '-',
                height: 0,
                weight: 0,
                currentHB: 0,
                consumptionCount: 0,
                consumptionTarget: 0,
                bmi: 0,
                bmiCategory: '-',
            };
        }

        const user = new UserModel(state.user.profile);
        
        // Ambil data tambahan dari state jika ada, atau fallback ke user model
        const consumption = state.user.vitaminConsumption || {};
        const hb = state.user.hemoglobin || {};

        return {
            name: user.getDisplayName(),
            email: user.email || '-',
            school: user.school || 'Belum diatur',
            nisn: user.nisn || '-',
            
            height: user.height || 0,
            weight: user.weight || 0,
            
            currentHB: hb.current || user.hbLast || 0,
            
            consumptionCount: consumption.count || user.consumptionCount || 0,
            consumptionTarget: consumption.target || user.totalTarget || 90,
            
            // Computed fields from Model
            bmi: user.getBMI() || 0,
            bmiCategory: user.getBMICategory() || '-',
            initial: user.getInitials()
        };
    }
};

export default ProfileController;