/**
 * Modiva - User API
 * API calls for user/profile management
 * @module services/api/user.api
 */
import { ApiEndpoints, USE_MOCK_API } from '../../config/api.config.js';
import { Logger } from '../../utils/logger.js';
import { apiService } from './api.services.js';

import { store } from '../../state/store.js';
import { MOCK_SISWA_DB } from './auth.api.js';

/*
 * Mock User API
 */
const MockUserAPI = {
    /*
     * Mock get profile
     */
    async getProfile() {
        await new Promise(resolve => setTimeout(resolve, 500));
        Logger.info('🎭 Mock API: Get Profile');
        
        // Get current user ID from store
        const state = store.getState();
        const currentUserId = state.user?.profile?.id;
        
        // Find in mock DB
        const user = MOCK_SISWA_DB.find(u => u.id.toString() === currentUserId?.toString());
        
        if (user) {
             return {
                success: true,
                data: {
                    id: user.id.toString(),
                    name: user.nama,
                    nisn: user.nis,
                    school: user.sekolah_nama || `Sekolah ID ${user.sekolah_id}`,
                    email: user.email,
                    phone: '081234567890',
                    address: 'Alamat Siswa',
                    birth_date: user.tgl_lahir,
                    gender: user.gender === 'P' ? 'F' : 'M',
                    height: user.height || 160,
                    weight: user.weight || 50,
                    hb_last: user.hb_last || 12.5,
                    consumption_count: user.consumption_count || 0,
                    total_target: user.total_target || 90,
                    avatar: user.avatar || null,
                    created_at: '2023-10-01T00:00:00Z',
                    updated_at: new Date().toISOString()
                }
            };
        }

        // Fallback for demo if no login state
        return {
            success: true,
            data: {
                id: '20231001',
                name: 'Aisyah',
                nisn: '0110222079',
                school: 'SMPN 1 Jakarta',
                email: 'aisyah@email.com',
                phone: '081234567890',
                address: 'Jakarta Selatan',
                birth_date: '2008-05-15',
                gender: 'F',
                height: 176,
                weight: 65,
                hb_last: 12.5,
                consumption_count: 8,
                total_target: 48,
                avatar: null,
                created_at: '2023-10-01T00:00:00Z',
                updated_at: new Date().toISOString()
            }
        };
    },

    /**
     * Mock update profile
     */
    async updateProfile(data) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        Logger.info('🎭 Mock API: Update Profile with data:', data);
        
        // Update MOCK_SISWA_DB if possible
        const state = store.getState();
        const currentUserId = state.user?.profile?.id;
        
        const userIndex = MOCK_SISWA_DB.findIndex(u => u.id.toString() === currentUserId?.toString());
        
        if (userIndex !== -1) {
            // Map frontend fields back to DB fields
            const dbUser = MOCK_SISWA_DB[userIndex];
            
            if (data.name) dbUser.nama = data.name;
            if (data.school) dbUser.sekolah_nama = data.school; // Update school name
            if (data.height) dbUser.height = parseFloat(data.height);
            if (data.weight) dbUser.weight = parseFloat(data.weight);
            if (data.birthPlace) dbUser.tmp_lahir = data.birthPlace;
            if (data.avatar) dbUser.avatar = data.avatar; // Update avatar
            // Add other fields as needed
            
            Logger.info('✅ Mock DB Updated:', dbUser);
        }

        return {
            success: true,
            message: 'Profile updated successfully',
            data: {
                ...data,
                updated_at: new Date().toISOString()
            }
        };
    }
};

/**
 * User API
 */
export const UserAPI = {
    /*
     * Get user profile
     * @returns {Promise<object>} - Profile data
     */
    async getProfile() {
        if (USE_MOCK_API) {
            return await MockUserAPI.getProfile();
        }
        const endpoint = ApiEndpoints.user.getProfile;
        return await apiService.get(endpoint.url, {
            timeout: endpoint.timeout
        });
    },

    /**
     * Update user profile
     * @param {object} data - Profile data to update
     * @returns {Promise<object>} - Updated profile
     */
    async updateProfile(data) {
        if (USE_MOCK_API) {
            return await MockUserAPI.updateProfile(data);
        }
        const endpoint = ApiEndpoints.user.updateProfile;
        return await apiService.put(endpoint.url, data, {
            timeout: endpoint.timeout
        });
    }
};

export default UserAPI;