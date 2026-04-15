/**
 * Modiva - Authentication API
 * API calls for authentication
 * @module services/api/auth.api
 */
import { ApiEndpoints, MOCK_API_DELAY, USE_MOCK_API } from '../../config/api.config.js';
import { AppConfig } from '../../config/app.config.js';
import { Logger } from '../../utils/logger.js';
import { apiService } from './api.services.js';
import {
    buildMockLoginResponse,
    getMockStudentByCredentials,
    isRecoverableNetworkError,
    normalizeStudentLoginPayload,
    MOCK_SISWA_DB
} from './mock.database.js';

export { MOCK_SISWA_DB };

const MockAuthAPI = {
    async loginSiswa(credentials) {
        await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

        Logger.info('🎭 Mock API: Login Siswa', credentials);

        const submittedNis = String(credentials.nisn || credentials.nis || '').trim();
        const submittedSchoolKey = String(
            credentials.schoolCode ||
            credentials.school_code ||
            credentials.schoolId ||
            credentials.school_id ||
            ''
        ).trim().toUpperCase() || null;

        const matchedUser = getMockStudentByCredentials(credentials);

        if (matchedUser) {
            if (String(matchedUser.nis) !== submittedNis && submittedSchoolKey) {
                Logger.warn('⚠️ Offline login memakai data siswa pertama yang cocok dengan kode sekolah.', {
                    schoolCode: submittedSchoolKey,
                    requestedNis: submittedNis
                });
            }

            Logger.info('✅ Mock: Login berhasil untuk NIS:', submittedNis || matchedUser.nis);
            return buildMockLoginResponse(matchedUser, submittedNis || matchedUser.nis);
        }

        throw {
            status: 401,
            message: 'Invalid credentials',
            userMessage: 'NIS atau Kode Sekolah salah / tidak terdaftar'
        };
    },

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

    async logout() {
        await new Promise(resolve => setTimeout(resolve, 500));
        Logger.info('🎭 Mock API: Logout');
        return { success: true, message: 'Logout successful' };
    },

    async refreshToken() {
        await new Promise(resolve => setTimeout(resolve, 500));
        Logger.info('🎭 Mock API: Refresh Token');
        return {
            success: true,
            token: 'jwt_token_refreshed_' + Date.now(),
            refreshToken: 'refresh_token_new_' + Date.now()
        };
    },

    async verifyToken() {
        await new Promise(resolve => setTimeout(resolve, 300));
        Logger.info('🎭 Mock API: Verify Token');
        return {
            success: true,
            valid: true,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
    },

    async resetPassword(email) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        Logger.info('🎭 Mock API: Reset Password', { email });
        return {
            success: true,
            message: 'Password reset email sent'
        };
    },

    async changePassword() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        Logger.info('🎭 Mock API: Change Password');
        return {
            success: true,
            message: 'Password changed successfully'
        };
    }
};

export const createOfflineStudentSession = (credentials = {}) => {
    const normalizedCredentials = normalizeStudentLoginPayload(credentials);
    return MockAuthAPI.loginSiswa(normalizedCredentials);
};

export const AuthAPI = {
    normalizeStudentLoginPayload,

    extractApiErrorMessage(error) {
        const payload = error?.data;
        const fieldErrors = payload?.errors;

        if (typeof payload?.message === 'string' && payload.message.trim()) {
            return payload.message;
        }

        if (typeof payload?.detail === 'string' && payload.detail.trim()) {
            return payload.detail;
        }

        if (Array.isArray(payload?.detail)) {
            const firstDetail = payload.detail
                .map((item) => item?.msg || item?.message || item?.detail)
                .find(Boolean);

            if (firstDetail) {
                return firstDetail;
            }
        }

        if (fieldErrors && typeof fieldErrors === 'object') {
            const firstFieldError = Object.values(fieldErrors)
                .flat()
                .find(Boolean);

            if (typeof firstFieldError === 'string' && firstFieldError.trim()) {
                return firstFieldError;
            }
        }

        return error?.userMessage || error?.message || 'Login gagal';
    },

    /**
     * Login siswa
     * @param {object} credentials - Login credentials
     * @param {string} credentials.nisn - NISN
     * @param {string} credentials.schoolId - School ID
     * @returns {Promise<object>} - Login response
     */
    async loginSiswa(credentials) {
        const normalizedCredentials = this.normalizeStudentLoginPayload(credentials);

        if (USE_MOCK_API) {
            return await MockAuthAPI.loginSiswa(normalizedCredentials);
        }
        
        const endpoint = ApiEndpoints.auth.loginSiswa;
        try {
            return await apiService.post(endpoint.url, normalizedCredentials, {
                timeout: endpoint.timeout
            });
        } catch (error) {
            error.userMessage = this.extractApiErrorMessage(error);

            const shouldFallbackToMock =
                AppConfig.environment.useMockApi ||
                isRecoverableNetworkError(error);

            if (!shouldFallbackToMock) {
                throw error;
            }

            Logger.warn('⚠️ Login siswa fallback ke Mock API karena backend tidak dapat dijangkau.', {
                reason: error?.message,
                code: error?.code
            });

            return await MockAuthAPI.loginSiswa(normalizedCredentials);
        }
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
