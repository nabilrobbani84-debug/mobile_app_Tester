/**
 * Modiva - Schools API Service
 * API calls untuk data lokasi sekolah
 * @module services/api/school.api
 */
import { API_BASE_URL } from '../../config/api.config.js';
import { Logger } from '../../utils/logger.js';

// ===================================
// MOCK DATA (fallback jika backend offline)
// ===================================
const MOCK_SCHOOLS = [
  {
    id: '1',
    kode: 'SMPN1JKT',
    nama: 'SMPN 1 Jakarta',
    nama_lengkap: 'Sekolah Menengah Pertama Negeri 1 Jakarta',
    alamat: 'Jl. Cikini Raya No.1, Cikini, Menteng, Jakarta Pusat',
    kota: 'Jakarta Pusat',
    provinsi: 'DKI Jakarta',
    kode_pos: '10330',
    telepon: '(021) 3913371',
    email: 'smpn1jkt@disdik.jakarta.go.id',
    kepala_sekolah: 'Drs. H. Ahmad Fauzi, M.Pd',
    akreditasi: 'A',
    npsn: '20100047',
    latitude: -6.196241,
    longitude: 106.836671,
    jumlah_siswa: 1,
    status: 'Negeri',
    jenjang: 'SMP',
  },
  {
    id: '3',
    kode: '20223819',
    nama: 'SMAN 1 KOTA DEPOK',
    nama_lengkap: 'Sekolah Menengah Atas Negeri 1 Kota Depok',
    alamat: 'Jl. Nusantara Raya 317, Depok, Kota Depok',
    kota: 'Kota Depok',
    provinsi: 'Jawa Barat',
    kode_pos: '16431',
    telepon: '(021) 7520137',
    email: 'sman1depokjabar@gmail.com',
    kepala_sekolah: 'Kepala Sekolah SMAN 1 Kota Depok',
    akreditasi: 'A',
    npsn: '20223819',
    latitude: -6.402222,
    longitude: 106.801944,
    jumlah_siswa: 5,
    status: 'Negeri',
    jenjang: 'SMA',
  },
  {
    id: '8',
    kode: '20223818',
    nama: 'SMAN 2 KOTA DEPOK',
    nama_lengkap: 'Sekolah Menengah Atas Negeri 2 Kota Depok',
    alamat: 'Jl. Gede Raya No. 177, Depok Timur, Abadi Jaya, Kota Depok',
    kota: 'Kota Depok',
    provinsi: 'Jawa Barat',
    kode_pos: '16412',
    telepon: '(021) 7708359',
    email: 'sman2.depok@yahoo.com',
    kepala_sekolah: 'Kepala Sekolah SMAN 2 Kota Depok',
    akreditasi: 'A',
    npsn: '20223818',
    latitude: -6.389722,
    longitude: 106.831667,
    jumlah_siswa: 4,
    status: 'Negeri',
    jenjang: 'SMA',
  },
  {
    id: '9',
    kode: '20258460',
    nama: 'SMAN 15 Depok',
    nama_lengkap: 'Sekolah Menengah Atas Negeri 15 Depok',
    alamat: 'Jl. Merdeka No. 78, Abadijaya, Kec. Sukmajaya, Kota Depok',
    kota: 'Kota Depok',
    provinsi: 'Jawa Barat',
    kode_pos: '16417',
    telepon: null,
    email: null,
    kepala_sekolah: 'Kepala Sekolah SMAN 15 Depok',
    akreditasi: 'A',
    npsn: '20258460',
    latitude: -6.381667,
    longitude: 106.8425,
    jumlah_siswa: 8,
    status: 'Negeri',
    jenjang: 'SMA',
  },
  {
    id: '10',
    kode: '20232526',
    nama: 'SMA ISLAM TERPADU RAFLESIA DEPOK',
    nama_lengkap: 'Sekolah Menengah Atas Islam Terpadu Raflesia Depok',
    alamat: 'Mahkota Raya No. 32 B, Pondok Duta, Tugu, Kec. Cimanggis, Depok',
    kota: 'Kota Depok',
    provinsi: 'Jawa Barat',
    kode_pos: '16451',
    telepon: null,
    email: null,
    kepala_sekolah: 'Kepala Sekolah SMA IT Raflesia Depok',
    akreditasi: 'A',
    npsn: '20232526',
    latitude: -6.370833,
    longitude: 106.8625,
    jumlah_siswa: 0,
    status: 'Swasta',
    jenjang: 'SMA',
  },
  {
    id: '11',
    kode: '20229183',
    nama: 'SMAS YAPEMRI DEPOK',
    nama_lengkap: 'Sekolah Menengah Atas Swasta Yapemri Depok',
    alamat: 'Jl. Agung Raya Ujung No. 3 RT 3 RW 19, Abadijaya, Depok',
    kota: 'Kota Depok',
    provinsi: 'Jawa Barat',
    kode_pos: '16417',
    telepon: null,
    email: null,
    kepala_sekolah: 'Kepala Sekolah SMAS Yapemri Depok',
    akreditasi: 'B',
    npsn: '20229183',
    latitude: -6.386111,
    longitude: 106.845556,
    jumlah_siswa: 0,
    status: 'Swasta',
    jenjang: 'SMA',
  },
  {
    id: '12',
    kode: '20223817',
    nama: 'SMAN 3 KOTA DEPOK',
    nama_lengkap: 'Sekolah Menengah Atas Negeri 3 Kota Depok',
    alamat: 'Jl. Raden Saleh No.45, Sukmajaya, Kec. Sukmajaya, Kota Depok',
    kota: 'Kota Depok',
    provinsi: 'Jawa Barat',
    kode_pos: '16412',
    telepon: '021-7700310',
    email: 'SMANTIGADEPOK@YAHOO.COM',
    kepala_sekolah: 'Kepala Sekolah SMAN 3 Kota Depok',
    akreditasi: 'A',
    npsn: '20223817',
    latitude: -6.390833,
    longitude: 106.835556,
    jumlah_siswa: 0,
    status: 'Negeri',
    jenjang: 'SMA',
  },
];

// ===================================
// API Service
// ===================================
export const SchoolAPI = {
  /**
   * Ambil semua sekolah
   * @param {object} params - Query params opsional: { kota, provinsi }
   */
  async getAll(params = {}) {
    Logger.info('🏫 SchoolAPI.getAll()', params);
    try {
      const queryString = Object.entries(params)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&');
      const url = `${API_BASE_URL}/schools${queryString ? '?' + queryString : ''}`;
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      Logger.warn('⚠️ SchoolAPI.getAll fallback to mock', error.message);
      return { success: true, data: MOCK_SCHOOLS, meta: { total: MOCK_SCHOOLS.length, fromMock: true } };
    }
  },

  /**
   * Ambil detail satu sekolah by ID
   * @param {string} sekolahId
   */
  async getById(sekolahId) {
    Logger.info('🏫 SchoolAPI.getById()', sekolahId);
    try {
      const url = `${API_BASE_URL}/schools/${sekolahId}`;
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      Logger.warn('⚠️ SchoolAPI.getById fallback to mock', error.message);
      const found = MOCK_SCHOOLS.find((s) => s.id === sekolahId || s.kode === sekolahId);
      if (found) return { success: true, data: { ...found, siswa: [] } };
      return { success: false, message: 'Sekolah tidak ditemukan' };
    }
  },

  /**
   * Ambil koordinat GPS sekolah (untuk peta)
   * @param {string} sekolahId
   */
  async getLocation(sekolahId) {
    Logger.info('📍 SchoolAPI.getLocation()', sekolahId);
    try {
      const url = `${API_BASE_URL}/schools/${sekolahId}/location`;
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      Logger.warn('⚠️ SchoolAPI.getLocation fallback to mock', error.message);
      const found = MOCK_SCHOOLS.find((s) => s.id === sekolahId || s.kode === sekolahId);
      if (found) {
        return {
          success: true,
          data: {
            id: found.id,
            nama: found.nama,
            alamat: found.alamat,
            kota: found.kota,
            latitude: found.latitude,
            longitude: found.longitude,
            maps_url: `https://www.google.com/maps?q=${found.latitude},${found.longitude}`,
            embed_url: `https://maps.google.com/maps?q=${found.latitude},${found.longitude}&z=16&output=embed`,
          },
        };
      }
      return { success: false, message: 'Sekolah tidak ditemukan' };
    }
  },
};

export default SchoolAPI;
