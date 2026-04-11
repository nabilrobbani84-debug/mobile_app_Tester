/**
 * Modiva - Authentication API
 * API calls for authentication
 * @module services/api/auth.api
 */
import { ApiEndpoints, MOCK_API_DELAY, USE_MOCK_API } from '../../config/api.config.js';
import { isDevelopment } from '../../config/app.config.js';
import { Logger } from '../../utils/logger.js';
import { apiService } from './api.services.js';
/**
 * Mock Database from Screenshot
 * Exporting it for use in UserAPI
 */
export const MOCK_SISWA_DB = [
    { 
        id: 1, nis: '10001', nama: 'Gita Hidayat', tmp_lahir: 'Depok', email: 'gita.hidayat@outlook.com', gender: 'L', tgl_lahir: '2010-05-25', sekolah_id: '3', sekolah_kode: '20223819', sekolah_nama: 'SMAN 1 KOTA DEPOK',
        height: 155, weight: 45, hb_last: 12.0, consumption_count: 5, total_target: 90
    },
    { 
        id: 2, nis: '10002', nama: 'Nanda Lestari', tmp_lahir: 'Bekasi', email: 'nanda.lestari@yahoo.com', gender: 'L', tgl_lahir: '2006-06-18', sekolah_id: '3', sekolah_kode: '20223819', sekolah_nama: 'SMAN 1 KOTA DEPOK',
        height: 158, weight: 48, hb_last: 11.5, consumption_count: 10, total_target: 90 
    },
    { 
        id: 3, nis: '10003', nama: 'Maya Hidayat', tmp_lahir: 'Bogor', email: 'maya.hidayat@yahoo.com', gender: 'L', tgl_lahir: '2010-01-13', sekolah_id: '3', sekolah_kode: '20223819', sekolah_nama: 'SMAN 1 KOTA DEPOK',
        height: 152, weight: 42, hb_last: 12.2, consumption_count: 2, total_target: 90
    },
    { 
        id: 4, nis: '10004', nama: 'Kartika Anggraini', tmp_lahir: 'Bandung', email: 'kartika.anggraini@gmail.com', gender: 'L', tgl_lahir: '2005-08-12', sekolah_id: '3', sekolah_kode: '20223819', sekolah_nama: 'SMAN 1 KOTA DEPOK',
        height: 160, weight: 50, hb_last: 12.5, consumption_count: 0, total_target: 90
    },
    { id: 5, nis: '10005', nama: 'Toni Permata', tmp_lahir: 'Bandung', email: 'toni.permata@yahoo.com', gender: 'L', tgl_lahir: '2006-07-26', sekolah_id: '3', sekolah_kode: '20223819', sekolah_nama: 'SMAN 1 KOTA DEPOK' },
    { id: 6, nis: '10006', nama: 'Indra Wijaya', tmp_lahir: 'Bekasi', email: 'indra.wijaya@outlook.com', gender: 'P', tgl_lahir: '2009-09-06', sekolah_id: '8', sekolah_kode: '20223818', sekolah_nama: 'SMAN 2 KOTA DEPOK' },
    { id: 7, nis: '10007', nama: 'Lia Saputra', tmp_lahir: 'Bandung', email: 'lia.saputra@outlook.com', gender: 'P', tgl_lahir: '2008-03-03', sekolah_id: '8', sekolah_kode: '20223818', sekolah_nama: 'SMAN 2 KOTA DEPOK' },
    { id: 8, nis: '10008', nama: 'Vina Lestari', tmp_lahir: 'Bogor', email: 'vina.lestari@gmail.com', gender: 'L', tgl_lahir: '2006-06-20', sekolah_id: '8', sekolah_kode: '20223818', sekolah_nama: 'SMAN 2 KOTA DEPOK' },
    { id: 9, nis: '10009', nama: 'Eka Wijaya', tmp_lahir: 'Bandung', email: 'eka.wijaya@gmail.com', gender: 'L', tgl_lahir: '2008-06-07', sekolah_id: '8', sekolah_kode: '20223818', sekolah_nama: 'SMAN 2 KOTA DEPOK' },
    { id: 10, nis: '10010', nama: 'Budi Wijaya', tmp_lahir: 'Tangerang', email: 'budi.wijaya@outlook.com', gender: 'P', tgl_lahir: '2005-07-13', sekolah_id: '12', sekolah_kode: '20223817', sekolah_nama: 'SMAN 3 KOTA DEPOK' },
    { id: 11, nis: '10011', nama: 'Gita Santoso', tmp_lahir: 'Bekasi', email: 'gita.santoso@gmail.com', gender: 'P', tgl_lahir: '2010-08-07', sekolah_id: '8', sekolah_kode: '20223818', sekolah_nama: 'SMAN 2 KOTA DEPOK' },
    { id: 12, nis: '10012', nama: 'Andi Syahputra', tmp_lahir: 'Tangerang', email: 'andi.syahputra@gmail.com', gender: 'P', tgl_lahir: '2008-04-10', sekolah_id: '12', sekolah_kode: '20223817', sekolah_nama: 'SMAN 3 KOTA DEPOK' },
    { id: 13, nis: '10013', nama: 'Andi Santoso', tmp_lahir: 'Bogor', email: 'andi.santoso@gmail.com', gender: 'P', tgl_lahir: '2009-02-03', sekolah_id: '9', sekolah_kode: '20258460', sekolah_nama: 'SMAN 15 Depok' },
    { id: 14, nis: '10014', nama: 'Gita Wijaya', tmp_lahir: 'Bogor', email: 'gita.wijaya@yahoo.com', gender: 'P', tgl_lahir: '2010-05-08', sekolah_id: '9', sekolah_kode: '20258460', sekolah_nama: 'SMAN 15 Depok' },
    { id: 15, nis: '10015', nama: 'Sinta Pratama', tmp_lahir: 'Depok', email: 'sinta.pratama@gmail.com', gender: 'L', tgl_lahir: '2005-12-17', sekolah_id: '9', sekolah_kode: '20258460', sekolah_nama: 'SMAN 15 Depok' },
    { id: 16, nis: '10016', nama: 'Indra Wijaya', tmp_lahir: 'Surabaya', email: 'indra.wijaya@outlook.com', gender: 'P', tgl_lahir: '2005-12-23', sekolah_id: '9', sekolah_kode: '20258460', sekolah_nama: 'SMAN 15 Depok' },
    { id: 17, nis: '10017', nama: 'Toni Permata', tmp_lahir: 'Jakarta', email: 'toni.permata@gmail.com', gender: 'L', tgl_lahir: '2010-05-02', sekolah_id: '9', sekolah_kode: '20258460', sekolah_nama: 'SMAN 15 Depok' },
    { id: 18, nis: '10018', nama: 'Kartika Lestari', tmp_lahir: 'Depok', email: 'kartika.lestari@yahoo.com', gender: 'L', tgl_lahir: '2005-12-17', sekolah_id: '9', sekolah_kode: '20258460', sekolah_nama: 'SMAN 15 Depok' },
    { id: 19, nis: '10019', nama: 'Citra Lestari', tmp_lahir: 'Bekasi', email: 'citra.lestari@yahoo.com', gender: 'P', tgl_lahir: '2007-02-14', sekolah_id: '9', sekolah_kode: '20258460', sekolah_nama: 'SMAN 15 Depok' },
    { id: 20, nis: '10020', nama: 'Dewi Wijaya', tmp_lahir: 'Bandung', email: 'dewi.wijaya@gmail.com', gender: 'L', tgl_lahir: '2006-05-12', sekolah_id: '9', sekolah_kode: '20258460', sekolah_nama: 'SMAN 15 Depok' },
    // User Sesuai Hint di Login Screen
    { 
        id: 99, nis: '0110222079', nama: 'Rizky Pratama', tmp_lahir: 'Jakarta', email: 'rizky.pratama@modiva.id', gender: 'L', tgl_lahir: '2008-08-17', sekolah_id: '1', sekolah_kode: 'SMPN1JKT', sekolah_nama: 'SMPN 1 Jakarta',
        height: 170, weight: 60, hb_last: 13.5, consumption_count: 15, total_target: 90
    }
];

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

        // Mock Database from Screenshot
        // Use global MOCK_SISWA_DB defined at top of file

        const submittedNis = String(credentials.nisn || credentials.nis || '').trim();
        const submittedSchoolKey = String(
            credentials.schoolCode ||
            credentials.school_code ||
            credentials.schoolId ||
            credentials.school_id ||
            ''
        ).trim().toUpperCase() || null;

        // Find user by NISN (school code optional)
        const matchedUser = MOCK_SISWA_DB.find(u => {
            if (String(u.nis) !== submittedNis) return false;
            if (!submittedSchoolKey) return true;

            return (
                String(u.sekolah_kode || '').toUpperCase() === submittedSchoolKey ||
                String(u.sekolah_id || '').toUpperCase() === submittedSchoolKey
            );
        });
        
        if (matchedUser) {
            return {
                success: true,
                token: 'jwt_siswa_token_' + matchedUser.id + '_' + Date.now(),
                refreshToken: 'refresh_token_' + matchedUser.id + '_' + Date.now(),
                user: {
                    id: matchedUser.id.toString(),
                    name: matchedUser.nama,
                    nisn: matchedUser.nis,
                    school: matchedUser.sekolah_nama || `Sekolah ID ${matchedUser.sekolah_id}`, 
                    schoolId: matchedUser.sekolah_id,
                    schoolCode: matchedUser.sekolah_kode,
                    role: 'siswa',
                    hbLast: matchedUser.hb_last || 12.5, 
                    consumptionCount: matchedUser.consumption_count || 0,
                    totalTarget: matchedUser.total_target || 90,
                    email: matchedUser.email,
                    phone: '081234567890', // Default
                    address: 'Alamat Siswa', // Default
                    birthPlace: matchedUser.tmp_lahir,
                    birthDate: matchedUser.tgl_lahir,
                    gender: matchedUser.gender === 'P' ? 'F' : 'M', // Map L/P to M/F
                    height: matchedUser.height || 160,
                    weight: matchedUser.weight || 50,
                    avatar: null,
                    createdAt: '2025-08-11T03:12:35.000000', // From screenshot
                    updatedAt: new Date().toISOString()
                }
            };
        }
        
        // Simulate failed login
        throw {
            status: 401,
            message: 'Invalid credentials',
            userMessage: 'NISN atau Kode Sekolah salah / tidak terdaftar'
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
    normalizeStudentLoginPayload(credentials = {}) {
        const nis = String(credentials.nis || credentials.nisn || '').trim();
        const schoolKey = String(
            credentials.schoolId ||
            credentials.school_id ||
            credentials.schoolCode ||
            credentials.school_code ||
            ''
        ).trim();

        return {
            nis,
            nisn: nis,
            schoolId: schoolKey,
            school_id: schoolKey,
            schoolCode: schoolKey.toUpperCase(),
            school_code: schoolKey.toUpperCase()
        };
    },

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
                isDevelopment() &&
                (error?.isTimeout ||
                 error?.code === 'TIMEOUT_ERROR' ||
                 error?.code === 'NETWORK_ERROR' ||
                 error?.message === 'Waktu permintaan habis' ||
                 error?.message === 'Gangguan koneksi internet');

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
