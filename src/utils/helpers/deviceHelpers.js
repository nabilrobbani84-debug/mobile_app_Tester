// src/utils/helpers/deviceHelpers.js
// Device and platform related utilities
import { Platform, Dimensions, PixelRatio, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Platform checks
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';
// Platform version
export const platformVersion = Platform.Version;
/**
 * Get screen dimensions
 * @returns {object} { width, height }
 */
export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};
/**
 * Get device dimensions (includes status bar on Android)
 * @returns {object} { width, height }
 */
export const getDeviceDimensions = () => {
  const { width, height } = Dimensions.get('screen');
  return { width, height };
};
/**
 * Check if device is in portrait orientation
 * @returns {boolean}
 */
export const isPortrait = () => {
  const { width, height } = getScreenDimensions();
  return height >= width;
};
/**
 * Check if device is in landscape orientation
 * @returns {boolean}
 */
export const isLandscape = () => {
  return !isPortrait();
};
/**
 * Get status bar height
 * @returns {number}
 */
export const getStatusBarHeight = () => {
  if (isIOS) {
    return Constants.statusBarHeight || 20;
  }
  return StatusBar.currentHeight || 0;
};
/**
 * Check if device has notch (iPhone X and later)
 * @returns {boolean}
 */
export const hasNotch = () => {
  if (isIOS) {
    const { height } = getScreenDimensions();
    // iPhone X and later have screen height >= 812
    return height >= 812;
  }
  return false;
};
/**
 * Get safe area insets
 * @returns {object} { top, bottom, left, right }
 */
export const getSafeAreaInsets = () => {
  const statusBarHeight = getStatusBarHeight();
  
  if (isIOS && hasNotch()) {
    return {
      top: 44,
      bottom: 34,
      left: 0,
      right: 0,
    };
  }
  
  return {
    top: statusBarHeight,
    bottom: 0,
    left: 0,
    right: 0,
  };
};
/**
 * Get bottom tab bar height
 * @returns {number}
 */
export const getBottomTabBarHeight = () => {
  const { bottom } = getSafeAreaInsets();
  const baseHeight = 50;
  return baseHeight + bottom;
};
/**
 * Check if device is a tablet
 * @returns {boolean}
 */
export const isTablet = () => {
  const { width, height } = getScreenDimensions();
  const aspectRatio = height / width;
  
  // Tablets typically have aspect ratio close to 4:3
  // Phones have aspect ratio around 16:9 or higher
  if (isIOS) {
    return Math.min(width, height) >= 768;
  }
  
  return aspectRatio < 1.6 && Math.min(width, height) >= 600;
};
/**
 * Check if device is a small screen
 * @returns {boolean}
 */
export const isSmallScreen = () => {
  const { width, height } = getScreenDimensions();
  return Math.min(width, height) < 375;
};
/**
 * Check if device is a large screen
 * @returns {boolean}
 */
export const isLargeScreen = () => {
  const { width, height } = getScreenDimensions();
  return Math.min(width, height) >= 414;
};
/**
 * Get pixel ratio
 * @returns {number}
 */
export const getPixelRatio = () => {
  return PixelRatio.get();
};
/**
 * Get font scale
 * @returns {number}
 */
export const getFontScale = () => {
  return PixelRatio.getFontScale();
};
/**
 * Normalize size based on screen width
 * @param {number} size - Size to normalize
 * @returns {number} Normalized size
 */
export const normalizeSize = (size) => {
  const baseWidth = 375; // iPhone 8 width
  const { width } = getScreenDimensions();
  const scale = width / baseWidth;
  
  return Math.round(size * scale);
};
/**
 * Normalize font size with accessibility support
 * @param {number} size - Font size to normalize
 * @returns {number} Normalized font size
 */
export const normalizeFontSize = (size) => {
  const newSize = normalizeSize(size);
  
  if (isIOS) {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};
/**
 * Get responsive value based on screen size
 * @param {object} values - { small, medium, large, tablet }
 * @returns {any} Appropriate value for screen size
 */
export const getResponsiveValue = (values) => {
  const { small, medium, large, tablet } = values;
  
  if (isTablet() && tablet !== undefined) {
    return tablet;
  }
  
  if (isSmallScreen()) {
    return small || medium;
  }
  
  if (isLargeScreen()) {
    return large || medium;
  }
  
  return medium;
};
/**
 * Get device info
 * @returns {Promise<object>} Device information
 */
export const getDeviceInfo = async () => {
  try {
    return {
      brand: Device.brand,
      manufacturer: Device.manufacturer,
      modelName: Device.modelName,
      modelId: Device.modelId,
      designName: Device.designName,
      productName: Device.productName,
      deviceYearClass: Device.deviceYearClass,
      totalMemory: Device.totalMemory,
      supportedCpuArchitectures: Device.supportedCpuArchitectures,
      osName: Device.osName,
      osVersion: Device.osVersion,
      osBuildId: Device.osBuildId,
      osInternalBuildId: Device.osInternalBuildId,
      platformApiLevel: Device.platformApiLevel,
      deviceName: await Device.deviceName,
      deviceType: Device.deviceType,
      isDevice: Device.isDevice,
    };
  } catch (error) {
    console.error('Error getting device info:', error);
    return {};
  }
};
/**
 * Get device type string
 * @returns {string}
 */
export const getDeviceTypeString = () => {
  switch (Device.deviceType) {
    case Device.DeviceType.PHONE:
      return 'phone';
    case Device.DeviceType.TABLET:
      return 'tablet';
    case Device.DeviceType.DESKTOP:
      return 'desktop';
    case Device.DeviceType.TV:
      return 'tv';
    default:
      return 'unknown';
  }
};
/**
 * Check if running on physical device
 * @returns {boolean}
 */
export const isPhysicalDevice = () => {
  return Device.isDevice;
};
/**
 * Check if running on emulator/simulator
 * @returns {boolean}
 */
export const isEmulator = () => {
  return !Device.isDevice;
};
/**
 * Get app version
 * @returns {string}
 */
export const getAppVersion = () => {
  return Constants.expoConfig?.version || '1.0.0';
};
/**
 * Get app build number
 * @returns {string}
 */
export const getBuildNumber = () => {
  if (isIOS) {
    return Constants.expoConfig?.ios?.buildNumber || '1';
  }
  return String(Constants.expoConfig?.android?.versionCode || 1);
};
/**
 * Get full version string
 * @returns {string}
 */
export const getFullVersion = () => {
  const version = getAppVersion();
  const build = getBuildNumber();
  return `${version} (${build})`;
};
/**
 * Get Expo SDK version
 * @returns {string}
 */
export const getExpoVersion = () => {
  return Constants.expoConfig?.sdkVersion || 'unknown';
};
/**
 * Check if app is running in Expo Go
 * @returns {boolean}
 */
export const isExpoGo = () => {
  return Constants.appOwnership === 'expo';
};
/**
 * Check if app is standalone build
 * @returns {boolean}
 */
export const isStandalone = () => {
  return Constants.appOwnership === 'standalone';
};
/**
 * Get unique device identifier (for analytics)
 * @returns {string|null}
 */
export const getDeviceId = () => {
  return Constants.sessionId || null;
};
/**
 * Add dimension change listener
 * @param {function} callback - Callback function
 * @returns {object} Subscription object
 */
export const addDimensionListener = (callback) => {
  return Dimensions.addEventListener('change', callback);
};
/**
 * Platform-specific style selector
 * @param {object} styles - { ios, android, default }
 * @returns {any} Platform-specific style
 */
export const platformSelect = (styles) => {
  return Platform.select({
    ios: styles.ios,
    android: styles.android,
    default: styles.default || styles.ios,
  });
};
/**
 * Check if device supports haptic feedback
 * @returns {boolean}
 */
export const supportsHaptic = () => {
  // Most modern iOS devices support haptic
  // Android support varies
  return isIOS || (isAndroid && platformVersion >= 26);
};
/**
 * Get keyboard height estimate
 * @returns {number}
 */
export const getKeyboardHeightEstimate = () => {
  const { height } = getScreenDimensions();
  
  if (isIOS) {
    return hasNotch() ? 336 : 260;
  }
  
  // Android keyboard is typically about 40% of screen height
  return Math.round(height * 0.4);
};
export default {
  isIOS,
  isAndroid,
  isWeb,
  platformVersion,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  getScreenDimensions,
  getDeviceDimensions,
  isPortrait,
  isLandscape,
  getStatusBarHeight,
  hasNotch,
  getSafeAreaInsets,
  getBottomTabBarHeight,
  isTablet,
  isSmallScreen,
  isLargeScreen,
  getPixelRatio,
  getFontScale,
  normalizeSize,
  normalizeFontSize,
  getResponsiveValue,
  getDeviceInfo,
  getDeviceTypeString,
  isPhysicalDevice,
  isEmulator,
  getAppVersion,
  getBuildNumber,
  getFullVersion,
  getExpoVersion,
  isExpoGo,
  isStandalone,
  getDeviceId,
  addDimensionListener,
  platformSelect,
  supportsHaptic,
  getKeyboardHeightEstimate,
};