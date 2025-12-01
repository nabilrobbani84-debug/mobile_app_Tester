// src/utils/helpers/storageHelpers.js
// AsyncStorage helper utilities for data persistence
import AsyncStorage from '@react-native-async-storage/async-storage';
// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@modiva_auth_token',
  USER_DATA: '@modiva_user_data',
  REMEMBER_ME: '@modiva_remember_me',
  SETTINGS: '@modiva_settings',
  NOTIFICATIONS: '@modiva_notifications',
  REPORTS_CACHE: '@modiva_reports_cache',
  LAST_SYNC: '@modiva_last_sync',
  ONBOARDING_COMPLETE: '@modiva_onboarding_complete',
  LANGUAGE: '@modiva_language',
  THEME: '@modiva_theme',
};
/**
 * Store string data
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 * @returns {Promise<boolean>} Success status
 */
export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error('Storage setItem error:', error);
    return false;
  }
};
/**
 * Get string data
 * @param {string} key - Storage key
 * @returns {Promise<string|null>} Stored value or null
 */
export const getItem = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Storage getItem error:', error);
    return null;
  }
};
/**
 * Store JSON data
 * @param {string} key - Storage key
 * @param {object} value - Object to store
 * @returns {Promise<boolean>} Success status
 */
export const setJSON = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Storage setJSON error:', error);
    return false;
  }
};
/**
 * Get JSON data
 * @param {string} key - Storage key
 * @returns {Promise<object|null>} Parsed object or null
 */
export const getJSON = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Storage getJSON error:', error);
    return null;
  }
};
/**
 * Remove item from storage
 * @param {string} key - Storage key
 * @returns {Promise<boolean>} Success status
 */
export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Storage removeItem error:', error);
    return false;
  }
};
/**
 * Remove multiple items
 * @param {string[]} keys - Array of storage keys
 * @returns {Promise<boolean>} Success status
 */
export const removeMultiple = async (keys) => {
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Storage removeMultiple error:', error);
    return false;
  }
};
/**
 * Clear all storage
 * @returns {Promise<boolean>} Success status
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Storage clearAll error:', error);
    return false;
  }
};
/**
 * Get all keys
 * @returns {Promise<string[]>} Array of all keys
 */
export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Storage getAllKeys error:', error);
    return [];
  }
};
/**
 * Get multiple items
 * @param {string[]} keys - Array of keys
 * @returns {Promise<object>} Object with key-value pairs
 */
export const getMultiple = async (keys) => {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    return pairs.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  } catch (error) {
    console.error('Storage getMultiple error:', error);
    return {};
  }
};
/**
 * Set multiple items
 * @param {object} items - Object with key-value pairs
 * @returns {Promise<boolean>} Success status
 */
export const setMultiple = async (items) => {
  try {
    const pairs = Object.entries(items).map(([key, value]) => [
      key,
      typeof value === 'string' ? value : JSON.stringify(value),
    ]);
    await AsyncStorage.multiSet(pairs);
    return true;
  } catch (error) {
    console.error('Storage setMultiple error:', error);
    return false;
  }
};
/**
 * Merge JSON data (update existing object)
 * @param {string} key - Storage key
 * @param {object} value - Object to merge
 * @returns {Promise<boolean>} Success status
 */
export const mergeJSON = async (key, value) => {
  try {
    await AsyncStorage.mergeItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Storage mergeJSON error:', error);
    return false;
  }
};
// ==================== Auth Storage Helpers ====================
/**
 * Save authentication token
 * @param {string} token - JWT token
 * @returns {Promise<boolean>}
 */
export const saveAuthToken = async (token) => {
  return await setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};
/**
 * Get authentication token
 * @returns {Promise<string|null>}
 */
export const getAuthToken = async () => {
  return await getItem(STORAGE_KEYS.AUTH_TOKEN);
};
/**
 * Remove authentication token
 * @returns {Promise<boolean>}
 */
export const removeAuthToken = async () => {
  return await removeItem(STORAGE_KEYS.AUTH_TOKEN);
};
/**
 * Save user data
 * @param {object} userData - User data object
 * @returns {Promise<boolean>}
 */
export const saveUserData = async (userData) => {
  return await setJSON(STORAGE_KEYS.USER_DATA, userData);
};
/**
 * Get user data
 * @returns {Promise<object|null>}
 */
export const getUserData = async () => {
  return await getJSON(STORAGE_KEYS.USER_DATA);
};
/**
 * Update user data (merge)
 * @param {object} updates - Fields to update
 * @returns {Promise<boolean>}
 */
export const updateUserData = async (updates) => {
  const currentData = await getUserData();
  if (currentData) {
    return await saveUserData({ ...currentData, ...updates });
  }
  return await saveUserData(updates);
};
/**
 * Clear user session (token + user data)
 * @returns {Promise<boolean>}
 */
export const clearUserSession = async () => {
  return await removeMultiple([
    STORAGE_KEYS.AUTH_TOKEN,
    STORAGE_KEYS.USER_DATA,
  ]);
};
// ==================== Settings Storage Helpers ====================
/**
 * Save app settings
 * @param {object} settings - Settings object
 * @returns {Promise<boolean>}
 */
export const saveSettings = async (settings) => {
  return await setJSON(STORAGE_KEYS.SETTINGS, settings);
};
/**
 * Get app settings
 * @returns {Promise<object>}
 */
export const getSettings = async () => {
  const settings = await getJSON(STORAGE_KEYS.SETTINGS);
  return settings || getDefaultSettings();
};
/**
 * Update specific setting
 * @param {string} key - Setting key
 * @param {any} value - Setting value
 * @returns {Promise<boolean>}
 */
export const updateSetting = async (key, value) => {
  const settings = await getSettings();
  settings[key] = value;
  return await saveSettings(settings);
};
/**
 * Get default settings
 * @returns {object}
 */
export const getDefaultSettings = () => ({
  notifications: {
    enabled: true,
    vitaminReminder: true,
    reminderTime: '08:00',
    motivationalMessages: true,
  },
  display: {
    theme: 'light',
    language: 'id',
    fontSize: 'medium',
  },
  privacy: {
    shareData: false,
    analytics: true,
  },
});
// ==================== Cache Storage Helpers ====================
/**
 * Save reports cache
 * @param {array} reports - Reports data
 * @returns {Promise<boolean>}
 */
export const saveReportsCache = async (reports) => {
  const cacheData = {
    data: reports,
    timestamp: Date.now(),
  };
  return await setJSON(STORAGE_KEYS.REPORTS_CACHE, cacheData);
};
/**
 * Get reports cache
 * @param {number} maxAge - Maximum cache age in milliseconds
 * @returns {Promise<array|null>}
 */
export const getReportsCache = async (maxAge = 5 * 60 * 1000) => {
  const cache = await getJSON(STORAGE_KEYS.REPORTS_CACHE);
  
  if (!cache) return null;
  
  const isExpired = Date.now() - cache.timestamp > maxAge;
  if (isExpired) {
    await removeItem(STORAGE_KEYS.REPORTS_CACHE);
    return null;
  }
  
  return cache.data;
};
/**
 * Clear reports cache
 * @returns {Promise<boolean>}
 */
export const clearReportsCache = async () => {
  return await removeItem(STORAGE_KEYS.REPORTS_CACHE);
};
/**
 * Save last sync timestamp
 * @returns {Promise<boolean>}
 */
export const saveLastSync = async () => {
  return await setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
};
/**
 * Get last sync timestamp
 * @returns {Promise<number|null>}
 */
export const getLastSync = async () => {
  const timestamp = await getItem(STORAGE_KEYS.LAST_SYNC);
  return timestamp ? parseInt(timestamp, 10) : null;
};
// ==================== Onboarding Storage Helpers ====================
/**
 * Mark onboarding as complete
 * @returns {Promise<boolean>}
 */
export const setOnboardingComplete = async () => {
  return await setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
};
/**
 * Check if onboarding is complete
 * @returns {Promise<boolean>}
 */
export const isOnboardingComplete = async () => {
  const value = await getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
  return value === 'true';
};
// ==================== Remember Me Storage Helpers ====================
/**
 * Save remember me credentials
 * @param {object} credentials - { nisn, schoolId }
 * @returns {Promise<boolean>}
 */
export const saveRememberMe = async (credentials) => {
  return await setJSON(STORAGE_KEYS.REMEMBER_ME, credentials);
};
/**
 * Get remember me credentials
 * @returns {Promise<object|null>}
 */
export const getRememberMe = async () => {
  return await getJSON(STORAGE_KEYS.REMEMBER_ME);
};
/**
 * Clear remember me credentials
 * @returns {Promise<boolean>}
 */
export const clearRememberMe = async () => {
  return await removeItem(STORAGE_KEYS.REMEMBER_ME);
};
export default {
  STORAGE_KEYS,
  setItem,
  getItem,
  setJSON,
  getJSON,
  removeItem,
  removeMultiple,
  clearAll,
  getAllKeys,
  getMultiple,
  setMultiple,
  mergeJSON,
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
  saveUserData,
  getUserData,
  updateUserData,
  clearUserSession,
  saveSettings,
  getSettings,
  updateSetting,
  getDefaultSettings,
  saveReportsCache,
  getReportsCache,
  clearReportsCache,
  saveLastSync,
  getLastSync,
  setOnboardingComplete,
  isOnboardingComplete,
  saveRememberMe,
  getRememberMe,
  clearRememberMe,
};
