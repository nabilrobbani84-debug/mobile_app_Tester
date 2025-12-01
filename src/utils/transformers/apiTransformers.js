// src/utils/transformers/apiTransformers.js
// Transform data between API responses and app models
import { formatShortDate, formatISODate } from '../helpers/dateHelpers';
/**
 * Transform API user response to app user model
 * @param {object} apiUser - User data from API
 * @returns {object} Transformed user object
 */
export const transformUserFromAPI = (apiUser) => {
  if (!apiUser) return null;
  return {
    id: apiUser.id || apiUser._id || apiUser.user_id,
    name: apiUser.name || apiUser.nama || apiUser.full_name || '',
    nisn: apiUser.nisn || apiUser.NISN || '',
    email: apiUser.email || '',
    phone: apiUser.phone || apiUser.phone_number || apiUser.telepon || '',
    schoolId: apiUser.school_id || apiUser.schoolId || apiUser.id_sekolah || '',
    schoolName: apiUser.school_name || apiUser.schoolName || apiUser.nama_sekolah || '',
    className: apiUser.class_name || apiUser.className || apiUser.kelas || '',
    // Health data
    lastHbValue: parseFloat(apiUser.hb_last || apiUser.lastHbValue || apiUser.hb_terakhir || 0),
    height: parseFloat(apiUser.height || apiUser.tinggi_badan || 0),
    weight: parseFloat(apiUser.weight || apiUser.berat_badan || 0),
    birthDate: apiUser.birth_date || apiUser.birthDate || apiUser.tanggal_lahir || null,
    gender: apiUser.gender || apiUser.jenis_kelamin || '',
    bloodType: apiUser.blood_type || apiUser.bloodType || apiUser.golongan_darah || '',
    // Vitamin tracking
    consumptionCount: parseInt(apiUser.consumption_count || apiUser.consumptionCount || apiUser.jumlah_konsumsi || 0, 10),
    totalTarget: parseInt(apiUser.total_target || apiUser.totalTarget || apiUser.target_total || 48, 10),
    // Profile image
    avatar: apiUser.avatar || apiUser.profile_image || apiUser.foto_profil || null,
    // Meta
    createdAt: apiUser.created_at || apiUser.createdAt || null,
    updatedAt: apiUser.updated_at || apiUser.updatedAt || null,
    isActive: apiUser.is_active !== undefined ? apiUser.is_active : true,
    role: apiUser.role || 'student',
  };
};
/**
 * Transform app user model to API request format
 * @param {object} user - App user object
 * @returns {object} API-formatted user object
 */
export const transformUserToAPI = (user) => {
  if (!user) return null;
  return {
    name: user.name,
    nisn: user.nisn,
    email: user.email,
    phone: user.phone,
    school_id: user.schoolId,
    school_name: user.schoolName,
    class_name: user.className,
    height: user.height,
    weight: user.weight,
    birth_date: user.birthDate ? formatISODate(user.birthDate) : null,
    gender: user.gender,
    blood_type: user.bloodType,
    avatar: user.avatar,
  };
};
/**
 * Transform API report response to app report model
 * @param {object} apiReport - Report data from API
 * @returns {object} Transformed report object
 */
export const transformReportFromAPI = (apiReport) => {
  if (!apiReport) return null;
  return {
    id: apiReport.id || apiReport._id || apiReport.report_id,
    userId: apiReport.user_id || apiReport.userId || apiReport.id_siswa,
    // Dates
    consumptionDate: apiReport.consumption_date || apiReport.consumptionDate || apiReport.tanggal_konsumsi,
    submittedAt: apiReport.submitted_at || apiReport.submittedAt || apiReport.tanggal_submit || apiReport.created_at,
    // Health data
    hbValue: parseFloat(apiReport.hb_value || apiReport.hbValue || apiReport.nilai_hb || 0),
    vitaminType: apiReport.vitamin_type || apiReport.vitaminType || apiReport.jenis_vitamin || 'TTD',
    // Image
    imageUrl: apiReport.image_url || apiReport.imageUrl || apiReport.foto_bukti || null,
    imageThumbnail: apiReport.image_thumbnail || apiReport.imageThumbnail || null,
    // Notes
    notes: apiReport.notes || apiReport.catatan || '',
    // Status
    status: apiReport.status || 'pending',
    verifiedAt: apiReport.verified_at || apiReport.verifiedAt || null,
    verifiedBy: apiReport.verified_by || apiReport.verifiedBy || null,
    // Meta
    createdAt: apiReport.created_at || apiReport.createdAt,
    updatedAt: apiReport.updated_at || apiReport.updatedAt,
  };
};
/**
 * Transform app report model to API request format
 * @param {object} report - App report object
 * @returns {object} API-formatted report object
 */
export const transformReportToAPI = (report) => {
  if (!report) return null;
  return {
    consumption_date: report.consumptionDate ? formatISODate(report.consumptionDate) : null,
    hb_value: report.hbValue || null,
    vitamin_type: report.vitaminType || 'TTD',
    notes: report.notes || '',
    // Image will be handled separately in form data
  };
};
/**
 * Transform array of API reports to app models
 * @param {array} apiReports - Array of reports from API
 * @returns {array} Transformed reports array
 */
export const transformReportsFromAPI = (apiReports) => {
  if (!Array.isArray(apiReports)) return [];
  return apiReports.map(transformReportFromAPI).filter(Boolean);
};
/**
 * Transform API notification to app model
 * @param {object} apiNotification - Notification from API
 * @returns {object} Transformed notification object
 */
export const transformNotificationFromAPI = (apiNotification) => {
  if (!apiNotification) return null;
  return {
    id: apiNotification.id || apiNotification._id || apiNotification.notification_id,
    userId: apiNotification.user_id || apiNotification.userId,
    // Content
    title: apiNotification.title || apiNotification.judul || '',
    message: apiNotification.message || apiNotification.body || apiNotification.pesan || '',
    type: apiNotification.type || apiNotification.tipe || 'general',
    // Meta
    isRead: apiNotification.is_read || apiNotification.isRead || apiNotification.sudah_dibaca || false,
    readAt: apiNotification.read_at || apiNotification.readAt || null,
    createdAt: apiNotification.created_at || apiNotification.createdAt,
    // Action
    actionUrl: apiNotification.action_url || apiNotification.actionUrl || null,
    actionData: apiNotification.action_data || apiNotification.actionData || null,
    // Visual
    icon: apiNotification.icon || getNotificationIcon(apiNotification.type),
    color: apiNotification.color || getNotificationColor(apiNotification.type),
  };
};
/**
 * Transform array of API notifications to app models
 * @param {array} apiNotifications - Array of notifications from API
 * @returns {array} Transformed notifications array
 */
export const transformNotificationsFromAPI = (apiNotifications) => {
  if (!Array.isArray(apiNotifications)) return [];
  return apiNotifications.map(transformNotificationFromAPI).filter(Boolean);
};
/**
 * Transform API health tip to app model
 * @param {object} apiTip - Health tip from API
 * @returns {object} Transformed health tip object
 */
export const transformHealthTipFromAPI = (apiTip) => {
  if (!apiTip) return null;
  return {
    id: apiTip.id || apiTip._id || apiTip.tip_id,
    title: apiTip.title || apiTip.judul || '',
    summary: apiTip.summary || apiTip.ringkasan || apiTip.excerpt || '',
    content: apiTip.content || apiTip.konten || apiTip.body || '',
    imageUrl: apiTip.image_url || apiTip.imageUrl || apiTip.gambar || null,
    category: apiTip.category || apiTip.kategori || 'general',
    tags: apiTip.tags || apiTip.label || [],
    // Meta
    author: apiTip.author || apiTip.penulis || null,
    publishedAt: apiTip.published_at || apiTip.publishedAt || apiTip.tanggal_publish,
    readTime: apiTip.read_time || apiTip.readTime || apiTip.waktu_baca || '3 menit',
    viewCount: parseInt(apiTip.view_count || apiTip.viewCount || 0, 10),
  };
};
/**
 * Transform array of API health tips to app models
 * @param {array} apiTips - Array of health tips from API
 * @returns {array} Transformed health tips array
 */
export const transformHealthTipsFromAPI = (apiTips) => {
  if (!Array.isArray(apiTips)) return [];
  return apiTips.map(transformHealthTipFromAPI).filter(Boolean);
};
/**
 * Transform API HB record to chart data point
 * @param {object} apiHbRecord - HB record from API
 * @returns {object} Chart data point
 */
export const transformHbRecordToChartData = (apiHbRecord) => {
  if (!apiHbRecord) return null;
  const date = new Date(apiHbRecord.date || apiHbRecord.tanggal || apiHbRecord.created_at);
  
  return {
    x: date,
    y: parseFloat(apiHbRecord.value || apiHbRecord.nilai || apiHbRecord.hb_value || 0),
    label: formatShortDate(date),
    formattedValue: `${parseFloat(apiHbRecord.value || apiHbRecord.nilai || 0).toFixed(1)} g/dL`,
  };
};
/**
 * Transform array of HB records to chart data
 * @param {array} apiHbRecords - Array of HB records from API
 * @returns {array} Chart data points
 */
export const transformHbRecordsToChartData = (apiHbRecords) => {
  if (!Array.isArray(apiHbRecords)) return [];
  return apiHbRecords
    .map(transformHbRecordToChartData)
    .filter(Boolean)
    .sort((a, b) => a.x - b.x);
};
/**
 * Transform API consumption stats to app model
 * @param {object} apiStats - Consumption statistics from API
 * @returns {object} Transformed stats object
 */
export const transformConsumptionStatsFromAPI = (apiStats) => {
  if (!apiStats) return null;
  return {
    period: apiStats.period || apiStats.periode || 'monthly',
    total: parseInt(apiStats.total || apiStats.jumlah || 0, 10),
    target: parseInt(apiStats.target || apiStats.target_konsumsi || 48, 10),
    percentage: parseFloat(apiStats.percentage || apiStats.persentase || 0),
    streak: parseInt(apiStats.streak || apiStats.berturut || 0, 10),
    lastConsumption: apiStats.last_consumption || apiStats.lastConsumption || apiStats.konsumsi_terakhir,
    breakdown: apiStats.breakdown || apiStats.rincian || [],
  };
};
/**
 * Transform API error response to app error model
 * @param {object} apiError - Error from API
 * @returns {object} Standardized error object
 */
export const transformErrorFromAPI = (apiError) => {
  if (!apiError) {
    return {
      code: 'UNKNOWN_ERROR',
      message: 'Terjadi kesalahan yang tidak diketahui',
      details: null,
    };
  }
  // Handle different error formats
  const errorMessage = 
    apiError.message || 
    apiError.error || 
    apiError.msg || 
    apiError.pesan ||
    (typeof apiError === 'string' ? apiError : 'Terjadi kesalahan');
  const errorCode = 
    apiError.code || 
    apiError.error_code || 
    apiError.kode ||
    'API_ERROR';
  return {
    code: errorCode,
    message: errorMessage,
    details: apiError.details || apiError.errors || null,
    statusCode: apiError.status || apiError.statusCode || null,
  };
};
/**
 * Get notification icon based on type
 * @param {string} type - Notification type
 * @returns {string} Icon name
 */
const getNotificationIcon = (type) => {
  const icons = {
    reminder: 'alarm-outline',
    vitamin_reminder: 'medical-outline',
    motivational: 'heart-outline',
    achievement: 'trophy-outline',
    health_tip: 'bulb-outline',
    system: 'information-circle-outline',
    warning: 'warning-outline',
    success: 'checkmark-circle-outline',
  };
  return icons[type] || 'notifications-outline';
};
/**
 * Get notification color based on type
 * @param {string} type - Notification type
 * @returns {string} Color name
 */
const getNotificationColor = (type) => {
  const colors = {
    reminder: 'primary',
    vitamin_reminder: 'primary',
    motivational: 'success',
    achievement: 'warning',
    health_tip: 'info',
    system: 'gray',
    warning: 'warning',
    success: 'success',
  };
  return colors[type] || 'primary';
};
/**
 * Transform login credentials for API
 * @param {object} credentials - { nisn, schoolId }
 * @returns {object} API-formatted credentials
 */
export const transformLoginCredentialsToAPI = (credentials) => {
  return {
    nisn: credentials.nisn?.replace(/\D/g, ''),
    school_id: credentials.schoolId?.trim(),
    // Include device info for security
    device_info: {
      platform: 'mobile',
      app_version: '1.0.0',
    },
  };
};
/**
 * Transform API login response
 * @param {object} apiResponse - Login response from API
 * @returns {object} Transformed auth data
 */
export const transformLoginResponseFromAPI = (apiResponse) => {
  if (!apiResponse) return null;
  return {
    token: apiResponse.token || apiResponse.access_token || apiResponse.jwt,
    refreshToken: apiResponse.refresh_token || apiResponse.refreshToken || null,
    expiresIn: apiResponse.expires_in || apiResponse.expiresIn || 3600,
    user: transformUserFromAPI(apiResponse.user || apiResponse.data?.user),
  };
};
export default {
  transformUserFromAPI,
  transformUserToAPI,
  transformReportFromAPI,
  transformReportToAPI,
  transformReportsFromAPI,
  transformNotificationFromAPI,
  transformNotificationsFromAPI,
  transformHealthTipFromAPI,
  transformHealthTipsFromAPI,
  transformHbRecordToChartData,
  transformHbRecordsToChartData,
  transformConsumptionStatsFromAPI,
  transformErrorFromAPI,
  transformLoginCredentialsToAPI,
  transformLoginResponseFromAPI,
};