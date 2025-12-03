/**
 * Modiva - User API
 * API calls for user/profile management
 * @module services/api/user.api
 */
import { apiService } from './api.services.js';
import { ApiEndpoints, USE_MOCK_API, MOCK_API_DELAY } from '../../config/api.config.js';
import { Logger } from '../../utils/logger.js';

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
        Logger.info('🎭 Mock API: Update Profile', data);
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