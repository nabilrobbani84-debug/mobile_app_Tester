/**
 * Modiva - Schools API Service
 * API calls untuk data lokasi sekolah
 * @module services/api/school.api
 */
import { API_BASE_URL } from '../../config/api.config.js';
import { Logger } from '../../utils/logger.js';

export const SchoolAPI = {
  async getAll(params = {}) {
    Logger.info('🏫 SchoolAPI.getAll()', params);
    const queryString = Object.entries(params)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    const url = `${API_BASE_URL}/schools${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  },

  /**
   * Ambil detail satu sekolah by ID
   * @param {string} sekolahId
   */
  async getById(sekolahId) {
    Logger.info('🏫 SchoolAPI.getById()', sekolahId);
    const url = `${API_BASE_URL}/schools/${sekolahId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  },

  /**
   * Ambil koordinat GPS sekolah (untuk peta)
   * @param {string} sekolahId
   */
  async getLocation(sekolahId) {
    Logger.info('📍 SchoolAPI.getLocation()', sekolahId);
    const url = `${API_BASE_URL}/schools/${sekolahId}/location`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  },
};

export default SchoolAPI;
