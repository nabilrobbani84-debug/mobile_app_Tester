// src/utils/helpers/formatHelpers.js
// String and number formatting utilities
/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @param {string} separator - Thousand separator
 * @returns {string} Formatted number
 */
export const formatNumber = (num, separator = '.') => {
  if (num === null || num === undefined) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};
/**
 * Format currency in Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @param {boolean} showSymbol - Show Rp symbol
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined) return '';
  
  const formatted = formatNumber(Math.abs(amount));
  const sign = amount < 0 ? '-' : '';
  
  if (showSymbol) {
    return `${sign}Rp ${formatted}`;
  }
  return `${sign}${formatted}`;
};
/**
 * Format percentage value
 * @param {number} value - Value to format (0-100 or 0-1)
 * @param {number} decimals - Decimal places
 * @param {boolean} isDecimal - If value is in decimal form (0-1)
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 0, isDecimal = false) => {
  if (value === null || value === undefined) return '';
  
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
};
/**
 * Format hemoglobin value
 * @param {number} value - HB value
 * @param {string} unit - Unit to display
 * @returns {string} Formatted HB value
 */
export const formatHbValue = (value, unit = 'g/dL') => {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(1)} ${unit}`;
};
/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return '';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
/**
 * Format phone number to Indonesian format
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Handle different formats
  let formatted = cleaned;
  
  if (cleaned.startsWith('62')) {
    formatted = '+62 ' + cleaned.slice(2);
  } else if (cleaned.startsWith('0')) {
    formatted = '+62 ' + cleaned.slice(1);
  }
  
  // Add spacing for readability
  if (formatted.startsWith('+62 ')) {
    const number = formatted.slice(4);
    if (number.length >= 9) {
      formatted = `+62 ${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7)}`;
    }
  }
  
  return formatted;
};
/**
 * Format NISN (10 digits)
 * @param {string} nisn - NISN value
 * @returns {string} Formatted NISN
 */
export const formatNISN = (nisn) => {
  if (!nisn) return '';
  
  const cleaned = nisn.replace(/\D/g, '');
  
  // Format as XXXX-XXXX-XX
  if (cleaned.length >= 10) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 10)}`;
  }
  
  return cleaned;
};
/**
 * Mask sensitive data (e.g., email, phone)
 * @param {string} value - Value to mask
 * @param {string} type - Type of data ('email', 'phone', 'nisn')
 * @returns {string} Masked value
 */
export const maskSensitiveData = (value, type = 'email') => {
  if (!value) return '';
  
  switch (type) {
    case 'email': {
      const [username, domain] = value.split('@');
      if (!domain) return value;
      const maskedUsername = username.slice(0, 2) + '***' + username.slice(-1);
      return `${maskedUsername}@${domain}`;
    }
    case 'phone': {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length < 8) return value;
      return cleaned.slice(0, 4) + '****' + cleaned.slice(-4);
    }
    case 'nisn': {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length < 6) return value;
      return cleaned.slice(0, 3) + '****' + cleaned.slice(-3);
    }
    default:
      return value;
  }
};
/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
/**
 * Capitalize first letter only
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 50, suffix = '...') => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
};
/**
 * Convert string to slug format
 * @param {string} str - String to convert
 * @returns {string} Slug string
 */
export const toSlug = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
/**
 * Get initials from name
 * @param {string} name - Full name
 * @param {number} maxInitials - Maximum number of initials
 * @returns {string} Initials
 */
export const getInitials = (name, maxInitials = 2) => {
  if (!name) return '';
  
  const words = name.trim().split(/\s+/);
  const initials = words
    .slice(0, maxInitials)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  
  return initials;
};
/**
 * Format name for display (First Last)
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} Formatted name
 */
export const formatFullName = (firstName, lastName) => {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.map(capitalizeFirst).join(' ');
};
/**
 * Pluralize word based on count (Indonesian)
 * @param {number} count - Count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional, same as singular in Indonesian)
 * @returns {string} Pluralized string
 */
export const pluralize = (count, singular, plural) => {
  // Indonesian doesn't have plural forms, but we can still use this for consistency
  const word = count === 1 ? singular : (plural || singular);
  return `${count} ${word}`;
};
/**
 * Format vitamin consumption count
 * @param {number} consumed - Vitamins consumed
 * @param {number} total - Total vitamins target
 * @returns {string} Formatted consumption
 */
export const formatVitaminConsumption = (consumed, total) => {
  return `${consumed}/${total} vitamin diminum`;
};
/**
 * Format health status based on HB value
 * @param {number} hbValue - Hemoglobin value
 * @param {string} gender - 'male' or 'female'
 * @returns {object} { status: string, color: string }
 */
export const formatHealthStatus = (hbValue, gender = 'female') => {
  if (!hbValue) return { status: 'Tidak diketahui', color: 'gray' };
  
  // Normal ranges (simplified)
  const normalMin = gender === 'male' ? 13.5 : 12.0;
  const normalMax = gender === 'male' ? 17.5 : 15.5;
  const lowThreshold = gender === 'male' ? 12.0 : 11.0;
  
  if (hbValue >= normalMin && hbValue <= normalMax) {
    return { status: 'Normal', color: 'success' };
  } else if (hbValue < lowThreshold) {
    return { status: 'Anemia', color: 'danger' };
  } else if (hbValue < normalMin) {
    return { status: 'Rendah', color: 'warning' };
  } else {
    return { status: 'Tinggi', color: 'warning' };
  }
};
/**
 * Format ordinal number (Indonesian)
 * @param {number} num - Number
 * @returns {string} Ordinal string
 */
export const formatOrdinal = (num) => {
  if (!num) return '';
  return `ke-${num}`;
};
export default {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatHbValue,
  formatFileSize,
  formatPhoneNumber,
  formatNISN,
  maskSensitiveData,
  capitalizeWords,
  capitalizeFirst,
  truncate,
  toSlug,
  getInitials,
  formatFullName,
  pluralize,
  formatVitaminConsumption,
  formatHealthStatus,
  formatOrdinal,
};
