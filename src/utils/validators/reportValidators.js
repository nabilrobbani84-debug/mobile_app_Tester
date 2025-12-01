// src/utils/validators/reportValidators.js
// Report form and data validators
/**
 * Validation result type
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether validation passed
 * @property {string} error - Error message if validation failed
 */
/**
 * Validate consumption date
 * @param {Date|string} date - Date to validate
 * @param {object} options - Validation options
 * @returns {ValidationResult}
 */
export const validateConsumptionDate = (date, options = {}) => {
  const {
    allowFuture = false,
    maxDaysAgo = 7,
  } = options;
  if (!date) {
    return {
      isValid: false,
      error: 'Tanggal konsumsi wajib dipilih',
    };
  }
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  // Check if valid date
  if (isNaN(selectedDate.getTime())) {
    return {
      isValid: false,
      error: 'Format tanggal tidak valid',
    };
  }
  // Check future date
  if (!allowFuture && selectedDate > today) {
    return {
      isValid: false,
      error: 'Tanggal tidak boleh di masa depan',
    };
  }
  // Check max days ago
  if (maxDaysAgo > 0) {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - maxDaysAgo);
    minDate.setHours(0, 0, 0, 0);
    if (selectedDate < minDate) {
      return {
        isValid: false,
        error: `Tanggal maksimal ${maxDaysAgo} hari yang lalu`,
      };
    }
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate image upload
 * @param {object} image - Image object { uri, type, name, size }
 * @param {object} options - Validation options
 * @returns {ValidationResult}
 */
export const validateImageUpload = (image, options = {}) => {
  const {
    required = true,
    maxSizeBytes = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'],
  } = options;
  if (!image || !image.uri) {
    if (required) {
      return {
        isValid: false,
        error: 'Bukti foto wajib diupload',
      };
    }
    return {
      isValid: true,
      error: '',
    };
  }
  // Check file type
  if (image.type && allowedTypes.length > 0) {
    if (!allowedTypes.includes(image.type.toLowerCase())) {
      return {
        isValid: false,
        error: 'Format gambar harus JPG atau PNG',
      };
    }
  }
  // Check file size
  if (image.size && image.size > maxSizeBytes) {
    const maxSizeMB = (maxSizeBytes / 1024 / 1024).toFixed(0);
    return {
      isValid: false,
      error: `Ukuran gambar maksimal ${maxSizeMB}MB`,
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate hemoglobin value
 * @param {number|string} hbValue - HB value
 * @param {object} options - Validation options
 * @returns {ValidationResult}
 */
export const validateHbValue = (hbValue, options = {}) => {
  const {
    required = false,
    minValue = 5.0,
    maxValue = 20.0,
  } = options;
  if (hbValue === null || hbValue === undefined || hbValue === '') {
    if (required) {
      return {
        isValid: false,
        error: 'Nilai HB wajib diisi',
      };
    }
    return {
      isValid: true,
      error: '',
    };
  }
  const numValue = parseFloat(hbValue);
  if (isNaN(numValue)) {
    return {
      isValid: false,
      error: 'Nilai HB harus berupa angka',
    };
  }
  if (numValue < minValue) {
    return {
      isValid: false,
      error: `Nilai HB minimal ${minValue} g/dL`,
    };
  }
  if (numValue > maxValue) {
    return {
      isValid: false,
      error: `Nilai HB maksimal ${maxValue} g/dL`,
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate notes/comments
 * @param {string} notes - Notes text
 * @param {object} options - Validation options
 * @returns {ValidationResult}
 */
export const validateNotes = (notes, options = {}) => {
  const {
    required = false,
    maxLength = 500,
    minLength = 0,
  } = options;
  if (!notes || notes.trim() === '') {
    if (required) {
      return {
        isValid: false,
        error: 'Catatan wajib diisi',
      };
    }
    return {
      isValid: true,
      error: '',
    };
  }
  const trimmedNotes = notes.trim();
  if (trimmedNotes.length < minLength) {
    return {
      isValid: false,
      error: `Catatan minimal ${minLength} karakter`,
    };
  }
  if (trimmedNotes.length > maxLength) {
    return {
      isValid: false,
      error: `Catatan maksimal ${maxLength} karakter`,
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate vitamin type selection
 * @param {string} vitaminType - Selected vitamin type
 * @param {string[]} validTypes - Array of valid vitamin types
 * @returns {ValidationResult}
 */
export const validateVitaminType = (vitaminType, validTypes = []) => {
  if (!vitaminType || vitaminType.trim() === '') {
    return {
      isValid: false,
      error: 'Jenis vitamin wajib dipilih',
    };
  }
  if (validTypes.length > 0 && !validTypes.includes(vitaminType)) {
    return {
      isValid: false,
      error: 'Jenis vitamin tidak valid',
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate vitamin consumption report form
 * @param {object} formData - Report form data
 * @returns {object} { isValid, errors }
 */
export const validateReportForm = (formData) => {
  const errors = {};
  // Validate consumption date
  const dateValidation = validateConsumptionDate(formData.consumptionDate, {
    maxDaysAgo: 7,
  });
  if (!dateValidation.isValid) {
    errors.consumptionDate = dateValidation.error;
  }
  // Validate image upload
  const imageValidation = validateImageUpload(formData.image, {
    required: true,
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
  });
  if (!imageValidation.isValid) {
    errors.image = imageValidation.error;
  }
  // Validate notes (optional)
  const notesValidation = validateNotes(formData.notes, {
    required: false,
    maxLength: 500,
  });
  if (!notesValidation.isValid) {
    errors.notes = notesValidation.error;
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
/**
 * Validate HB check report form
 * @param {object} formData - HB check form data
 * @returns {object} { isValid, errors }
 */
export const validateHbCheckForm = (formData) => {
  const errors = {};
  // Validate check date
  const dateValidation = validateConsumptionDate(formData.checkDate, {
    maxDaysAgo: 30,
  });
  if (!dateValidation.isValid) {
    errors.checkDate = dateValidation.error;
  }
  // Validate HB value
  const hbValidation = validateHbValue(formData.hbValue, {
    required: true,
  });
  if (!hbValidation.isValid) {
    errors.hbValue = hbValidation.error;
  }
  // Validate notes (optional)
  const notesValidation = validateNotes(formData.notes, {
    required: false,
    maxLength: 500,
  });
  if (!notesValidation.isValid) {
    errors.notes = notesValidation.error;
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
/**
 * Check if report can be edited
 * @param {object} report - Report object
 * @param {number} maxHoursAfterSubmission - Hours allowed to edit after submission
 * @returns {object} { canEdit, reason }
 */
export const canEditReport = (report, maxHoursAfterSubmission = 24) => {
  if (!report || !report.submittedAt) {
    return {
      canEdit: false,
      reason: 'Laporan tidak ditemukan',
    };
  }
  const submittedAt = new Date(report.submittedAt);
  const now = new Date();
  const diffHours = (now - submittedAt) / (1000 * 60 * 60);
  if (diffHours > maxHoursAfterSubmission) {
    return {
      canEdit: false,
      reason: `Laporan hanya bisa diedit dalam ${maxHoursAfterSubmission} jam setelah pengiriman`,
    };
  }
  if (report.status === 'verified') {
    return {
      canEdit: false,
      reason: 'Laporan yang sudah diverifikasi tidak bisa diedit',
    };
  }
  return {
    canEdit: true,
    reason: '',
  };
};
/**
 * Check if report can be deleted
 * @param {object} report - Report object
 * @returns {object} { canDelete, reason }
 */
export const canDeleteReport = (report) => {
  if (!report) {
    return {
      canDelete: false,
      reason: 'Laporan tidak ditemukan',
    };
  }
  if (report.status === 'verified') {
    return {
      canDelete: false,
      reason: 'Laporan yang sudah diverifikasi tidak bisa dihapus',
    };
  }
  return {
    canDelete: true,
    reason: '',
  };
};
/**
 * Validate report date range for filtering
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {ValidationResult}
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) {
    return {
      isValid: true,
      error: '',
    };
  }
  if (startDate && !endDate) {
    return {
      isValid: false,
      error: 'Tanggal akhir wajib diisi',
    };
  }
  if (!startDate && endDate) {
    return {
      isValid: false,
      error: 'Tanggal awal wajib diisi',
    };
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      isValid: false,
      error: 'Format tanggal tidak valid',
    };
  }
  if (start > end) {
    return {
      isValid: false,
      error: 'Tanggal awal tidak boleh lebih dari tanggal akhir',
    };
  }
  // Max 6 months range
  const maxRangeMs = 6 * 30 * 24 * 60 * 60 * 1000;
  if (end - start > maxRangeMs) {
    return {
      isValid: false,
      error: 'Rentang tanggal maksimal 6 bulan',
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Check if already reported today
 * @param {array} reports - Array of user's reports
 * @returns {boolean}
 */
export const hasReportedToday = (reports) => {
  if (!reports || reports.length === 0) {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return reports.some((report) => {
    const reportDate = new Date(report.consumptionDate || report.createdAt);
    reportDate.setHours(0, 0, 0, 0);
    return reportDate.getTime() === today.getTime();
  });
};
export default {
  validateConsumptionDate,
  validateImageUpload,
  validateHbValue,
  validateNotes,
  validateVitaminType,
  validateReportForm,
  validateHbCheckForm,
  canEditReport,
  canDeleteReport,
  validateDateRange,
  hasReportedToday,
};