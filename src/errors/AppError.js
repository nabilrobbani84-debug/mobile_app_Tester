// src/errors/AppError.js
// Base application error class and common error types
/**
 * Base Application Error
 * All custom errors should extend this class
 */
export class AppError extends Error {
  constructor(message, code = 'APP_ERROR', statusCode = 500, details = null) {
    super(message);
    
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.isOperational = true; // Distinguishes operational errors from programming errors
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
  /**
   * Convert error to JSON for logging/API responses
   * @returns {object}
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
      stack: __DEV__ ? this.stack : undefined,
    };
  }
  /**
   * Get user-friendly error message
   * @returns {string}
   */
  getUserMessage() {
    return this.message || 'Terjadi kesalahan. Silakan coba lagi.';
  }
  /**
   * Check if error is of specific type
   * @param {string} code - Error code to check
   * @returns {boolean}
   */
  isType(code) {
    return this.code === code;
  }
}
/**
 * Validation Error
 * For form validation and data validation errors
 */
export class ValidationError extends AppError {
  constructor(message, field = null, details = null) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
    this.field = field;
  }
  /**
   * Create from validation result object
   * @param {object} validationResult - { isValid, errors }
   * @returns {ValidationError}
   */
  static fromValidationResult(validationResult) {
    const fields = Object.keys(validationResult.errors || {});
    const firstError = fields.length > 0 
      ? validationResult.errors[fields[0]] 
      : 'Validasi gagal';
    
    return new ValidationError(firstError, fields[0], validationResult.errors);
  }
}
/**
 * Authentication Error
 * For login, session, and permission errors
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Autentikasi gagal', code = 'AUTH_ERROR', details = null) {
    super(message, code, 401, details);
    this.name = 'AuthenticationError';
  }
  /**
   * Create invalid credentials error
   * @returns {AuthenticationError}
   */
  static invalidCredentials() {
    return new AuthenticationError(
      'NISN atau ID Sekolah tidak valid',
      'INVALID_CREDENTIALS'
    );
  }
  /**
   * Create session expired error
   * @returns {AuthenticationError}
   */
  static sessionExpired() {
    return new AuthenticationError(
      'Sesi Anda telah berakhir. Silakan login kembali.',
      'SESSION_EXPIRED'
    );
  }
  /**
   * Create unauthorized error
   * @returns {AuthenticationError}
   */
  static unauthorized() {
    return new AuthenticationError(
      'Anda tidak memiliki akses ke halaman ini',
      'UNAUTHORIZED',
      403
    );
  }
}
/**
 * Network Error
 * For connectivity and API communication errors
 */
export class NetworkError extends AppError {
  constructor(message = 'Kesalahan jaringan', code = 'NETWORK_ERROR', details = null) {
    super(message, code, 0, details);
    this.name = 'NetworkError';
    this.isNetworkError = true;
  }
  /**
   * Create offline error
   * @returns {NetworkError}
   */
  static offline() {
    return new NetworkError(
      'Tidak ada koneksi internet. Periksa jaringan Anda.',
      'OFFLINE'
    );
  }
  /**
   * Create timeout error
   * @returns {NetworkError}
   */
  static timeout() {
    return new NetworkError(
      'Permintaan timeout. Server tidak merespon.',
      'TIMEOUT'
    );
  }
  /**
   * Create server error
   * @param {number} statusCode - HTTP status code
   * @returns {NetworkError}
   */
  static serverError(statusCode = 500) {
    return new NetworkError(
      'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
      'SERVER_ERROR',
      { statusCode }
    );
  }
}
/**
 * API Error
 * For specific API response errors
 */
export class APIError extends AppError {
  constructor(message, code = 'API_ERROR', statusCode = 500, response = null) {
    super(message, code, statusCode, response);
    this.name = 'APIError';
    this.response = response;
  }
  /**
   * Create from axios error
   * @param {object} axiosError - Axios error object
   * @returns {APIError}
   */
  static fromAxiosError(axiosError) {
    const response = axiosError.response;
    
    if (!response) {
      // Network error (no response)
      return new NetworkError(
        axiosError.message || 'Kesalahan jaringan',
        'NETWORK_ERROR'
      );
    }
    const statusCode = response.status;
    const data = response.data;
    
    // Extract message from various response formats
    const message = data?.message || data?.error || data?.msg || 
      getStatusMessage(statusCode);
    
    const code = data?.code || data?.error_code || `HTTP_${statusCode}`;
    // Handle specific status codes
    if (statusCode === 401) {
      return new AuthenticationError(message, 'UNAUTHORIZED');
    }
    
    if (statusCode === 403) {
      return AuthenticationError.unauthorized();
    }
    
    if (statusCode === 404) {
      return new APIError('Data tidak ditemukan', 'NOT_FOUND', 404, data);
    }
    
    if (statusCode === 422) {
      return new ValidationError(message, null, data?.errors);
    }
    return new APIError(message, code, statusCode, data);
  }
}
/**
 * Storage Error
 * For AsyncStorage and local data errors
 */
export class StorageError extends AppError {
  constructor(message = 'Kesalahan penyimpanan', code = 'STORAGE_ERROR', details = null) {
    super(message, code, 500, details);
    this.name = 'StorageError';
  }
  /**
   * Create read error
   * @param {string} key - Storage key
   * @returns {StorageError}
   */
  static readError(key) {
    return new StorageError(
      `Gagal membaca data: ${key}`,
      'STORAGE_READ_ERROR',
      { key }
    );
  }
  /**
   * Create write error
   * @param {string} key - Storage key
   * @returns {StorageError}
   */
  static writeError(key) {
    return new StorageError(
      `Gagal menyimpan data: ${key}`,
      'STORAGE_WRITE_ERROR',
      { key }
    );
  }
}
/**
 * Image Error
 * For image upload and processing errors
 */
export class ImageError extends AppError {
  constructor(message = 'Kesalahan gambar', code = 'IMAGE_ERROR', details = null) {
    super(message, code, 400, details);
    this.name = 'ImageError';
  }
  /**
   * Create file too large error
   * @param {number} maxSize - Maximum size in bytes
   * @returns {ImageError}
   */
  static fileTooLarge(maxSize) {
    const maxSizeMB = (maxSize / 1024 / 1024).toFixed(0);
    return new ImageError(
      `Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB.`,
      'FILE_TOO_LARGE',
      { maxSize }
    );
  }
  /**
   * Create invalid format error
   * @param {string[]} allowedFormats - Allowed formats
   * @returns {ImageError}
   */
  static invalidFormat(allowedFormats = ['JPG', 'PNG']) {
    return new ImageError(
      `Format file tidak valid. Gunakan ${allowedFormats.join(' atau ')}.`,
      'INVALID_FORMAT',
      { allowedFormats }
    );
  }
  /**
   * Create upload failed error
   * @returns {ImageError}
   */
  static uploadFailed() {
    return new ImageError(
      'Gagal mengunggah gambar. Silakan coba lagi.',
      'UPLOAD_FAILED'
    );
  }
  /**
   * Create compression failed error
   * @returns {ImageError}
   */
  static compressionFailed() {
    return new ImageError(
      'Gagal mengompresi gambar.',
      'COMPRESSION_FAILED'
    );
  }
}
/**
 * Get user-friendly message for HTTP status codes
 * @param {number} statusCode - HTTP status code
 * @returns {string} User message
 */
const getStatusMessage = (statusCode) => {
  const messages = {
    400: 'Permintaan tidak valid',
    401: 'Silakan login terlebih dahulu',
    403: 'Anda tidak memiliki akses',
    404: 'Data tidak ditemukan',
    408: 'Permintaan timeout',
    409: 'Data konflik',
    422: 'Data tidak dapat diproses',
    429: 'Terlalu banyak permintaan. Coba lagi nanti.',
    500: 'Kesalahan server internal',
    502: 'Server tidak tersedia',
    503: 'Layanan sedang tidak tersedia',
    504: 'Server timeout',
  };
  return messages[statusCode] || 'Terjadi kesalahan';
};
/**
 * Error code constants
 */
export const ERROR_CODES = {
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  
  // Authentication
  AUTH_ERROR: 'AUTH_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // Network
  NETWORK_ERROR: 'NETWORK_ERROR',
  OFFLINE: 'OFFLINE',
  TIMEOUT: 'TIMEOUT',
  SERVER_ERROR: 'SERVER_ERROR',
  
  // API
  API_ERROR: 'API_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  
  // Storage
  STORAGE_ERROR: 'STORAGE_ERROR',
  STORAGE_READ_ERROR: 'STORAGE_READ_ERROR',
  STORAGE_WRITE_ERROR: 'STORAGE_WRITE_ERROR',
  
  // Image
  IMAGE_ERROR: 'IMAGE_ERROR',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FORMAT: 'INVALID_FORMAT',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  
  // General
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  OPERATION_FAILED: 'OPERATION_FAILED',
};
export default {
  AppError,
  ValidationError,
  AuthenticationError,
  NetworkError,
  APIError,
  StorageError,
  ImageError,
  ERROR_CODES,
};
