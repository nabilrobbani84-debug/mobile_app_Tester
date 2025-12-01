// src/utils/validators/authValidators.js
// Authentication and login form validators
/**
 * Validation result type
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether validation passed
 * @property {string} error - Error message if validation failed
 */
/**
 * Validate NISN (Nomor Induk Siswa Nasional)
 * NISN consists of exactly 10 digits
 * @param {string} nisn - NISN value
 * @returns {ValidationResult}
 */
export const validateNISN = (nisn) => {
  if (!nisn || nisn.trim() === '') {
    return {
      isValid: false,
      error: 'NISN wajib diisi',
    };
  }
  // Remove any non-digit characters
  const cleanNISN = nisn.replace(/\D/g, '');
  if (cleanNISN.length !== 10) {
    return {
      isValid: false,
      error: 'NISN harus terdiri dari 10 digit angka',
    };
  }
  // Check if all digits
  if (!/^\d{10}$/.test(cleanNISN)) {
    return {
      isValid: false,
      error: 'NISN hanya boleh berisi angka',
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate School ID
 * @param {string} schoolId - School ID value
 * @returns {ValidationResult}
 */
export const validateSchoolId = (schoolId) => {
  if (!schoolId || schoolId.trim() === '') {
    return {
      isValid: false,
      error: 'ID Sekolah wajib diisi',
    };
  }
  const cleanSchoolId = schoolId.trim();
  if (cleanSchoolId.length < 3) {
    return {
      isValid: false,
      error: 'ID Sekolah minimal 3 karakter',
    };
  }
  if (cleanSchoolId.length > 20) {
    return {
      isValid: false,
      error: 'ID Sekolah maksimal 20 karakter',
    };
  }
  // Allow alphanumeric and some special characters
  if (!/^[a-zA-Z0-9_-]+$/.test(cleanSchoolId)) {
    return {
      isValid: false,
      error: 'ID Sekolah hanya boleh berisi huruf, angka, underscore, dan dash',
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate password
 * @param {string} password - Password value
 * @param {object} options - Validation options
 * @returns {ValidationResult}
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    maxLength = 50,
    requireUppercase = false,
    requireLowercase = false,
    requireNumber = false,
    requireSpecial = false,
  } = options;
  if (!password || password === '') {
    return {
      isValid: false,
      error: 'Password wajib diisi',
    };
  }
  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password minimal ${minLength} karakter`,
    };
  }
  if (password.length > maxLength) {
    return {
      isValid: false,
      error: `Password maksimal ${maxLength} karakter`,
    };
  }
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password harus mengandung huruf besar',
    };
  }
  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password harus mengandung huruf kecil',
    };
  }
  if (requireNumber && !/\d/.test(password)) {
    return {
      isValid: false,
      error: 'Password harus mengandung angka',
    };
  }
  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: 'Password harus mengandung karakter khusus',
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {ValidationResult}
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword === '') {
    return {
      isValid: false,
      error: 'Konfirmasi password wajib diisi',
    };
  }
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Password dan konfirmasi password tidak cocok',
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate email
 * @param {string} email - Email value
 * @returns {ValidationResult}
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email wajib diisi',
    };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      error: 'Format email tidak valid',
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate phone number (Indonesian format)
 * @param {string} phone - Phone number
 * @returns {ValidationResult}
 */
export const validatePhoneNumber = (phone) => {
  if (!phone || phone.trim() === '') {
    return {
      isValid: false,
      error: 'Nomor telepon wajib diisi',
    };
  }
  // Remove spaces, dashes, and parentheses
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  // Indonesian phone number patterns
  // Can start with 08, +62, or 62
  const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return {
      isValid: false,
      error: 'Format nomor telepon tidak valid',
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate login form
 * @param {object} formData - { nisn, schoolId }
 * @returns {object} { isValid, errors }
 */
export const validateLoginForm = (formData) => {
  const errors = {};
  const nisnValidation = validateNISN(formData.nisn);
  if (!nisnValidation.isValid) {
    errors.nisn = nisnValidation.error;
  }
  const schoolIdValidation = validateSchoolId(formData.schoolId);
  if (!schoolIdValidation.isValid) {
    errors.schoolId = schoolIdValidation.error;
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
/**
 * Validate registration form
 * @param {object} formData - Registration form data
 * @returns {object} { isValid, errors }
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};
  // Validate name
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Nama wajib diisi';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Nama minimal 2 karakter';
  }
  // Validate NISN
  const nisnValidation = validateNISN(formData.nisn);
  if (!nisnValidation.isValid) {
    errors.nisn = nisnValidation.error;
  }
  // Validate School ID
  const schoolIdValidation = validateSchoolId(formData.schoolId);
  if (!schoolIdValidation.isValid) {
    errors.schoolId = schoolIdValidation.error;
  }
  // Validate Email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  // Validate Password
  const passwordValidation = validatePassword(formData.password, {
    minLength: 8,
    requireNumber: true,
  });
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }
  // Validate Password Confirmation
  const confirmValidation = validatePasswordConfirmation(
    formData.password,
    formData.confirmPassword
  );
  if (!confirmValidation.isValid) {
    errors.confirmPassword = confirmValidation.error;
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
/**
 * Validate forgot password form
 * @param {object} formData - { email or nisn }
 * @returns {object} { isValid, errors }
 */
export const validateForgotPasswordForm = (formData) => {
  const errors = {};
  if (formData.email) {
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
    }
  } else if (formData.nisn) {
    const nisnValidation = validateNISN(formData.nisn);
    if (!nisnValidation.isValid) {
      errors.nisn = nisnValidation.error;
    }
  } else {
    errors.identifier = 'Email atau NISN wajib diisi';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
/**
 * Get password strength
 * @param {string} password - Password to check
 * @returns {object} { score, label, color }
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { score: 0, label: 'Masukkan password', color: 'gray' };
  }
  let score = 0;
  // Length checks
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  // Character type checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  // Calculate strength level
  if (score <= 2) {
    return { score, label: 'Lemah', color: 'danger' };
  } else if (score <= 4) {
    return { score, label: 'Sedang', color: 'warning' };
  } else if (score <= 6) {
    return { score, label: 'Kuat', color: 'success' };
  } else {
    return { score, label: 'Sangat Kuat', color: 'success' };
  }
};
export default {
  validateNISN,
  validateSchoolId,
  validatePassword,
  validatePasswordConfirmation,
  validateEmail,
  validatePhoneNumber,
  validateLoginForm,
  validateRegistrationForm,
  validateForgotPasswordForm,
  getPasswordStrength,
};