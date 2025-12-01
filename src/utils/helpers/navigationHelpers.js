// src/utils/helpers/navigationHelpers.js
// Navigation helper utilities
import { CommonActions, StackActions } from '@react-navigation/native';
// Route names constants
export const ROUTES = {
  // Auth routes
  SPLASH: 'Splash',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  
  // Main routes
  MAIN: 'Main',
  HOME: 'Home',
  REPORTS: 'Reports',
  NOTIFICATIONS: 'Notifications',
  PROFILE: 'Profile',
  
  // Stack routes
  REPORT_FORM: 'ReportForm',
  REPORT_DETAIL: 'ReportDetail',
  HEALTH_TIP_DETAIL: 'HealthTipDetail',
  EDIT_PROFILE: 'EditProfile',
  SETTINGS: 'Settings',
  NOTIFICATION_DETAIL: 'NotificationDetail',
};
// Screen titles
export const SCREEN_TITLES = {
  [ROUTES.HOME]: 'Beranda',
  [ROUTES.REPORTS]: 'Laporan',
  [ROUTES.NOTIFICATIONS]: 'Notifikasi',
  [ROUTES.PROFILE]: 'Profil',
  [ROUTES.REPORT_FORM]: 'Isi Laporan',
  [ROUTES.REPORT_DETAIL]: 'Detail Laporan',
  [ROUTES.HEALTH_TIP_DETAIL]: 'Tips Kesehatan',
  [ROUTES.EDIT_PROFILE]: 'Edit Profil',
  [ROUTES.SETTINGS]: 'Pengaturan',
};
// Navigation reference for use outside of components
let navigationRef = null;
/**
 * Set navigation reference
 * @param {object} ref - Navigation ref
 */
export const setNavigationRef = (ref) => {
  navigationRef = ref;
};
/**
 * Get navigation reference
 * @returns {object|null}
 */
export const getNavigationRef = () => navigationRef;
/**
 * Check if navigation is ready
 * @returns {boolean}
 */
export const isNavigationReady = () => {
  return navigationRef?.isReady() ?? false;
};
/**
 * Navigate to a screen
 * @param {string} name - Screen name
 * @param {object} params - Screen params
 */
export const navigate = (name, params = {}) => {
  if (navigationRef?.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.warn('Navigation not ready');
  }
};
/**
 * Go back to previous screen
 */
export const goBack = () => {
  if (navigationRef?.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
};
/**
 * Check if can go back
 * @returns {boolean}
 */
export const canGoBack = () => {
  return navigationRef?.canGoBack() ?? false;
};
/**
 * Push a new screen onto the stack
 * @param {string} name - Screen name
 * @param {object} params - Screen params
 */
export const push = (name, params = {}) => {
  if (navigationRef?.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
};
/**
 * Pop current screen from stack
 * @param {number} count - Number of screens to pop
 */
export const pop = (count = 1) => {
  if (navigationRef?.isReady()) {
    navigationRef.dispatch(StackActions.pop(count));
  }
};
/**
 * Pop to top of stack
 */
export const popToTop = () => {
  if (navigationRef?.isReady()) {
    navigationRef.dispatch(StackActions.popToTop());
  }
};
/**
 * Replace current screen
 * @param {string} name - Screen name
 * @param {object} params - Screen params
 */
export const replace = (name, params = {}) => {
  if (navigationRef?.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
};
/**
 * Reset navigation state
 * @param {string} routeName - Initial route name
 * @param {object} params - Route params
 */
export const reset = (routeName, params = {}) => {
  if (navigationRef?.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName, params }],
      })
    );
  }
};
/**
 * Reset to auth flow (login screen)
 */
export const resetToAuth = () => {
  reset(ROUTES.LOGIN);
};
/**
 * Reset to main app flow (home screen)
 */
export const resetToMain = () => {
  reset(ROUTES.MAIN);
};
/**
 * Navigate to tab
 * @param {string} tabName - Tab name
 * @param {object} params - Tab params
 */
export const navigateToTab = (tabName, params = {}) => {
  if (navigationRef?.isReady()) {
    navigationRef.navigate(ROUTES.MAIN, {
      screen: tabName,
      params,
    });
  }
};
/**
 * Get current route name
 * @returns {string|null}
 */
export const getCurrentRoute = () => {
  if (navigationRef?.isReady()) {
    const state = navigationRef.getRootState();
    return getActiveRouteName(state);
  }
  return null;
};
/**
 * Get active route name from state
 * @param {object} state - Navigation state
 * @returns {string|null}
 */
export const getActiveRouteName = (state) => {
  if (!state) return null;
  
  const route = state.routes[state.index];
  
  if (route.state) {
    return getActiveRouteName(route.state);
  }
  
  return route.name;
};
/**
 * Get current route params
 * @returns {object|null}
 */
export const getCurrentParams = () => {
  if (navigationRef?.isReady()) {
    const state = navigationRef.getRootState();
    return getActiveRouteParams(state);
  }
  return null;
};
/**
 * Get active route params from state
 * @param {object} state - Navigation state
 * @returns {object|null}
 */
export const getActiveRouteParams = (state) => {
  if (!state) return null;
  
  const route = state.routes[state.index];
  
  if (route.state) {
    return getActiveRouteParams(route.state);
  }
  
  return route.params || null;
};
/**
 * Set params for current route
 * @param {object} params - Params to set
 */
export const setParams = (params) => {
  if (navigationRef?.isReady()) {
    navigationRef.dispatch(CommonActions.setParams(params));
  }
};
/**
 * Check if route is focused
 * @param {string} routeName - Route name to check
 * @returns {boolean}
 */
export const isRouteFocused = (routeName) => {
  return getCurrentRoute() === routeName;
};
/**
 * Navigate to report form
 * @param {object} initialData - Initial form data
 */
export const navigateToReportForm = (initialData = {}) => {
  navigate(ROUTES.REPORT_FORM, initialData);
};
/**
 * Navigate to report detail
 * @param {string} reportId - Report ID
 */
export const navigateToReportDetail = (reportId) => {
  navigate(ROUTES.REPORT_DETAIL, { reportId });
};
/**
 * Navigate to health tip detail
 * @param {object} tip - Health tip data
 */
export const navigateToHealthTipDetail = (tip) => {
  navigate(ROUTES.HEALTH_TIP_DETAIL, { tip });
};
/**
 * Navigate to notification detail
 * @param {object} notification - Notification data
 */
export const navigateToNotificationDetail = (notification) => {
  navigate(ROUTES.NOTIFICATION_DETAIL, { notification });
};
/**
 * Navigate to edit profile
 */
export const navigateToEditProfile = () => {
  navigate(ROUTES.EDIT_PROFILE);
};
/**
 * Navigate to settings
 */
export const navigateToSettings = () => {
  navigate(ROUTES.SETTINGS);
};
/**
 * Handle deep link navigation
 * @param {string} url - Deep link URL
 */
export const handleDeepLink = (url) => {
  if (!url) return;
  
  // Parse URL and navigate accordingly
  // Format: modiva://route/param
  const route = url.replace(/.*?:\/\//g, '');
  const [routeName, ...params] = route.split('/');
  
  switch (routeName) {
    case 'report':
      if (params[0]) {
        navigateToReportDetail(params[0]);
      } else {
        navigateToTab(ROUTES.REPORTS);
      }
      break;
    case 'notification':
      navigateToTab(ROUTES.NOTIFICATIONS);
      break;
    case 'profile':
      navigateToTab(ROUTES.PROFILE);
      break;
    case 'home':
    default:
      navigateToTab(ROUTES.HOME);
      break;
  }
};
/**
 * Create navigation state listener
 * @param {function} callback - Callback function
 * @returns {function} Unsubscribe function
 */
export const addNavigationListener = (callback) => {
  if (navigationRef) {
    return navigationRef.addListener('state', callback);
  }
  return () => {};
};
/**
 * Get screen options for common screens
 * @param {string} routeName - Route name
 * @returns {object} Screen options
 */
export const getScreenOptions = (routeName) => {
  const baseOptions = {
    headerShown: true,
    headerBackTitleVisible: false,
  };
  
  const title = SCREEN_TITLES[routeName] || routeName;
  
  return {
    ...baseOptions,
    title,
  };
};
/**
 * Build navigation params from object
 * @param {object} params - Parameters object
 * @returns {string} Query string
 */
export const buildParams = (params) => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
};
/**
 * Parse navigation params from query string
 * @param {string} queryString - Query string
 * @returns {object} Parsed params
 */
export const parseParams = (queryString) => {
  if (!queryString) return {};
  
  return queryString.split('&').reduce((acc, pair) => {
    const [key, value] = pair.split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
};
export default {
  ROUTES,
  SCREEN_TITLES,
  setNavigationRef,
  getNavigationRef,
  isNavigationReady,
  navigate,
  goBack,
  canGoBack,
  push,
  pop,
  popToTop,
  replace,
  reset,
  resetToAuth,
  resetToMain,
  navigateToTab,
  getCurrentRoute,
  getActiveRouteName,
  getCurrentParams,
  getActiveRouteParams,
  setParams,
  isRouteFocused,
  navigateToReportForm,
  navigateToReportDetail,
  navigateToHealthTipDetail,
  navigateToNotificationDetail,
  navigateToEditProfile,
  navigateToSettings,
  handleDeepLink,
  addNavigationListener,
  getScreenOptions,
  buildParams,
  parseParams,
};

