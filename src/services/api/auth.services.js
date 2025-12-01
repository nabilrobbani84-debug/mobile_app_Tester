/**
 * Modiva - Authentication API
 * API calls for authentication
 * @module services/api/auth.api
 */
import { apiService } from './api.service.js';
import { ApiEndpoints } from '../../config/api.config.js';
import { USE_MOCK_API, MOCK_API_DELAY } from '../../config/api.config.js';
import { Logger } from '../../utils/logger.js';
/**
 * Mock API responses for development
 */
const MockAuthAPI = {
    /**
     * Mock login siswa
     * @param {object} credentials - Login credentials
     * @returns {Promise<object>} - Mock response
     */
    async loginSiswa(credentials) {
        await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
        
        Logger.info('🎭 Mock API: Login Siswa', credentials);
        
        // Simulate successful login
        if (credentials.nisn && credentials.schoolId) {
            return {
                success: true,
                token: 'jwt_siswa_token_' + Date.now(),
                refreshToken: 'refresh_token_' + Date.now(),
                user: {
                    id: '20231001',
                    name: 'Aisyah',
                    nisn: credentials.nisn,
                    school: 'SMPN 1 Jakarta',
                    schoolId: credentials.schoolId,
                    role: 'siswa',
                    hb_last: 12.5,
                    consumption_count: 8,
                    total_target: 48,
                    email: 'aisyah@email.com',
                    phone: '081234567890',
                    address: 'Jakarta Selatan',
                    birth_date: '2008-05-15',
                    gender: 'F',
                    height: 176,
                    weight: 65,
                    avatar: null,
                    created_at: '2023-10-01T00:00:00Z',
                    updated_at: new Date().toISOString()
                }
            };
        }
        
        // Simulate failed login
        throw {
            status: 401,
            message: 'Invalid credentials',
            userMessage: 'NISN atau ID Sekolah salah'
        };
    },
    /**
     * Mock login guru
     * @param {object} credentials - Login credentials
     * @returns {Promise<object>} - Mock response
     */
    async loginGuru(credentials) {
        await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
        
        Logger.info('🎭 Mock API: Login Guru', credentials);
        
        return {
            success: true,
            token: 'jwt_guru_token_' + Date.now(),
            refreshToken: 'refresh_token_' + Date.now(),
            user: {
                id: 'GURU001',
                name: 'Ibu Sarah',
                nip: credentials.nip,
                school: 'SMPN 1 Jakarta',
                role: 'guru',
                email: credentials.email,
                phone: '081234567890'
            }
        };
    },
    /**
     * Mock logout
     * @returns {Promise<object>} - Mock response
     */
    async logout() {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        Logger.info('🎭 Mock API: Logout');
        
        return {
            success: true,
            message: 'Logout successful'
        };
    },
    /**
     * Mock refresh token
     * @param {string} refreshToken - Refresh token
     * @returns {Promise<object>} - Mock response
     */
    async refreshToken(refreshToken) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        Logger.info('🎭 Mock API: Refresh Token');
        
        return {
            success: true,
            token: 'jwt_token_refreshed_' + Date.now(),
            refreshToken: 'refresh_token_new_' + Date.now()
        };
    },
    /**
     * Mock verify token
     * @returns {Promise<object>} - Mock response
     */
    async verifyToken() {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        Logger.info('🎭 Mock API: Verify Token');
        
        return {
            success: true,
            valid: true,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
    },
    /**
     * Mock reset password
     * @param {string} email - Email address
     * @returns {Promise<object>} - Mock response
     */
    async resetPassword(email) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        Logger.info('🎭 Mock API: Reset Password', { email });
        
        return {
            success: true,
            message: 'Password reset email sent'
        };
    },
    /**
     * Mock change password
     * @param {object} data - Password data
     * @returns {Promise<object>} - Mock response
     */
    async changePassword(data) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        Logger.info('🎭 Mock API: Change Password');
        
        return {
            success: true,
            message: 'Password changed successfully'
        };
    }
};
/**
 * Authentication API
 */
export const AuthAPI = {
    /**
     * Login siswa
     * @param {object} credentials - Login credentials
     * @param {string} credentials.nisn - NISN
     * @param {string} credentials.schoolId - School ID
     * @returns {Promise<object>} - Login response
     */
    async loginSiswa(credentials) {
        if (USE_MOCK_API) {
            return await MockAuthAPI.loginSiswa(credentials);
        }
        
        const endpoint = ApiEndpoints.auth.loginSiswa;
        return await apiService.post(endpoint.url, credentials, {
            timeout: endpoint.timeout
        });
    },
    /**
     * Login guru
     * @param {object} credentials - Login credentials
     * @param {string} credentials.nip - NIP
     * @param {string} credentials.email - Email
     * @param {string} credentials.password - Password
     * @returns {Promise<object>} - Login response
     */
    async loginGuru(credentials) {
        if (USE_MOCK_API) {
            return await MockAuthAPI.loginGuru(credentials);
        }
        
        const endpoint = ApiEndpoints.auth.loginGuru;
        return await apiService.post(endpoint.url, credentials, {
            timeout: endpoint.timeout
        });
    },
    /**
     * Login admin
     * @param {object} credentials - Login credentials
     * @param {string} credentials.username - Username
     * @param {string} credentials.password - Password
     * @returns {Promise<object>} - Login response
     */
    async loginAdmin(credentials) {
        const endpoint = ApiEndpoints.auth.loginAdmin;
        return await apiService.post(endpoint.url, credentials, {
            timeout: endpoint.timeout
        });
    },
    /**
     * Logout
     * @returns {Promise<object>} - Logout response
     */
    async logout() {
        if (USE_MOCK_API) {
            return await MockAuthAPI.logout();
        }
        
        const endpoint = ApiEndpoints.auth.logout;
        return await apiService.post(endpoint.url, {}, {
            timeout: endpoint.timeout
        });
    },
    /**
     * Refresh token
     * @param {string} refreshToken - Refresh token
     * @returns {Promise<object>} - Token response
     */
    async refreshToken(refreshToken) {
        if (USE_MOCK_API) {
            return await MockAuthAPI.refreshToken(refreshToken);
        }
        
        const endpoint = ApiEndpoints.auth.refreshToken;
        return await apiService.post(endpoint.url, { refreshToken }, {
            timeout: endpoint.timeout
        });
    },
    /**
     * Verify token
     * @returns {Promise<object>} - Verification response
     */
    async verifyToken() {
        if (USE_MOCK_API) {
            return await MockAuthAPI.verifyToken();
        }
        
        const endpoint = ApiEndpoints.auth.verifyToken;
        return await apiService.get(endpoint.url, {
            timeout: endpoint.timeout
        });
    },
    /**
     * Reset password
     * @param {string} email - Email address
     * @returns {Promise<object>} - Reset response
     */
    async resetPassword(email) {
        if (USE_MOCK_API) {
            return await MockAuthAPI.resetPassword(email);
        }
        
        const endpoint = ApiEndpoints.auth.resetPassword;
        return await apiService.post(endpoint.url, { email }, {
            timeout: endpoint.timeout
        });
    },
    /**
     * Change password
     * @param {object} data - Password data
     * @param {string} data.oldPassword - Old password
     * @param {string} data.newPassword - New password
     * @returns {Promise<object>} - Change response
     */
    async changePassword(data) {
        if (USE_MOCK_API) {
            return await MockAuthAPI.changePassword(data);
        }
        
        const endpoint = ApiEndpoints.auth.changePassword;
        return await apiService.put(endpoint.url, data, {
            timeout: endpoint.timeout
        });
    }
};
export default AuthAPI;