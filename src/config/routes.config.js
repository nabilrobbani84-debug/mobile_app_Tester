/**
 * Modiva - Routes Configuration
 * Application routing and navigation configuration
 * @module config/routes
 */
/**
 * Route Names
 */
export const RouteNames = {
    // Auth routes
    SPLASH: 'splash',
    LOGIN: 'login',
    REGISTER: 'register',
    FORGOT_PASSWORD: 'forgotPassword',
    RESET_PASSWORD: 'resetPassword',
    
    // Main routes
    HOME: 'home',
    DASHBOARD: 'dashboard',
    
    // Report routes
    REPORT_FORM: 'reportForm',
    REPORTS: 'reports',
    REPORT_DETAIL: 'reportDetail',
    
    // Notification routes
    NOTIFICATIONS: 'notifications',
    NOTIFICATION_DETAIL: 'notificationDetail',
    
    // Profile routes
    PROFILE: 'profile',
    EDIT_PROFILE: 'editProfile',
    SETTINGS: 'settings',
    
    // Health routes
    HEALTH_TIPS: 'healthTips',
    HEALTH_TIP_DETAIL: 'healthTipDetail',
    
    // Other routes
    ABOUT: 'about',
    HELP: 'help',
    TERMS: 'terms',
    PRIVACY: 'privacy'
};
/**
 * Routes Configuration
 */
export const Routes = {
    // ============================================
    // AUTHENTICATION ROUTES
    // ============================================
    [RouteNames.SPLASH]: {
        path: '/splash',
        screenId: 'splashScreen',
        title: 'Modiva',
        requiresAuth: false,
        showBottomNav: false,
        showHeader: false,
        animation: 'fade',
        icon: null,
        order: null
    },
    
    [RouteNames.LOGIN]: {
        path: '/login',
        screenId: 'loginScreen',
        title: 'Login',
        requiresAuth: false,
        showBottomNav: false,
        showHeader: false,
        animation: 'slide',
        icon: null,
        order: null
    },
    
    [RouteNames.REGISTER]: {
        path: '/register',
        screenId: 'registerScreen',
        title: 'Daftar',
        requiresAuth: false,
        showBottomNav: false,
        showHeader: false,
        animation: 'slide',
        icon: null,
        order: null
    },
    
    [RouteNames.FORGOT_PASSWORD]: {
        path: '/forgot-password',
        screenId: 'forgotPasswordScreen',
        title: 'Lupa Password',
        requiresAuth: false,
        showBottomNav: false,
        showHeader: true,
        animation: 'slide',
        icon: null,
        order: null
    },
    
    [RouteNames.RESET_PASSWORD]: {
        path: '/reset-password',
        screenId: 'resetPasswordScreen',
        title: 'Reset Password',
        requiresAuth: false,
        showBottomNav: false,
        showHeader: true,
        animation: 'slide',
        icon: null,
        order: null
    },
    // ============================================
    // MAIN APPLICATION ROUTES
    // ============================================
    [RouteNames.HOME]: {
        path: '/home',
        screenId: 'homeScreen',
        title: 'Home',
        requiresAuth: true,
        showBottomNav: true,
        showHeader: false,
        animation: 'fade',
        icon: 'home',
        order: 0,
        bottomTab: true
    },
    
    [RouteNames.DASHBOARD]: {
        path: '/dashboard',
        screenId: 'homeScreen',
        title: 'Dashboard',
        requiresAuth: true,
        showBottomNav: true,
        showHeader: false,
        animation: 'fade',
        icon: 'home',
        order: 0,
        bottomTab: true,
        alias: RouteNames.HOME
    },
    // ============================================
    // REPORT ROUTES
    // ============================================
    [RouteNames.REPORT_FORM]: {
        path: '/report-form',
        screenId: 'reportFormScreen',
        title: 'Isi Laporan',
        requiresAuth: true,
        showBottomNav: false,
        showHeader: true,
        animation: 'slide',
        icon: null,
        order: null
    },
    
    [RouteNames.REPORTS]: {
        path: '/reports',
        screenId: 'reportsScreen',
        title: 'Laporan',
        requiresAuth: true,
        showBottomNav: true,
        showHeader: false,
        animation: 'fade',
        icon: 'chart-bar',
        order: 1,
        bottomTab: true
    },
    
    [RouteNames.REPORT_DETAIL]: {
        path: '/reports/:id',
        screenId: 'reportDetailScreen',
        title: 'Detail Laporan',
        requiresAuth: true,
        showBottomNav: false,
        showHeader: true,
        animation: 'slide',
        icon: null,
        order: null
    },
    // ============================================
    // NOTIFICATION ROUTES
    // ============================================
    [RouteNames.NOTIFICATIONS]: {
        path: '/notifications',
        screenId: 'notificationsScreen',
        title: 'Notifikasi',
        requiresAuth: true,
        showBottomNav: true,
        showHeader: false,
        animation: 'fade',
        icon: 'bell',
        order: 2,
        bottomTab: true
    },
    
    [RouteNames.NOTIFICATION_DETAIL]: {
        path: '/notifications/:id',
        screenId: 'notificationDetailScreen',
        title: 'Detail Notifikasi',
        requiresAuth: true,
        showBottomNav: false,
        showHeader: true,
        animation: 'slide',
        icon: null,
        order: null
    },
    // ============================================
    // PROFILE ROUTES
    // ============================================
    [RouteNames.PROFILE]: {
        path: '/profile',
        screenId: 'profileScreen',
        title: 'Profil',
        requiresAuth: true,
        showBottomNav: true,
        showHeader: false,
        animation: 'fade',
        icon: 'user',
        order: 3,
        bottomTab: true
    },
    
    [RouteNames.EDIT_PROFILE]: {
        path: '/profile/edit',
        screenId: 'editProfileScreen',
        title: 'Edit Profil',
        requiresAuth: true,
        showBottomNav: false,
        showHeader: true,
        animation: 'slide',
        icon: null,
        order: null
    },
    
    [RouteNames.SETTINGS]: {
        path: '/settings',
        screenId: 'settingsScreen',
        title: 'Pengaturan',
        requiresAuth: true,
        showBottomNav: false,
        showHeader: true,
        animation: 'slide',
        icon: null,
        order: null
    },
    // ============================================
    // HEALTH ROUTES
    // ============================================
    [RouteNames.HEALTH_TIPS]: {
        path: '/health-tips',
        screenId: 'healthTipsScreen',
        title: 'Tips Kesehatan',
        requiresAuth: false,
        showBottomNav: false,
        showHeader: true,
        animation: 'slide',
        icon: null,
        order: null
    },
    
    [RouteNames.HEALTH_TIP_DETAIL]: {
        path: '/health-tips/:id',
        screenId: 'healthTipScreen',
        title: 'Wawasan Kesehatan',
        requiresAuth: false,
        showBottomNav: false,
        showHeader: true,
        animation: 'slide',
        icon: null,
        order: null
    },
    // ============================================
    // OTHER ROUTES
    // ============================================
    [RouteNames.ABOUT]: {
        path: '/about',
        screenId: 'aboutScreen',
        title: 'Tentang Modiva',
        requiresAuth: false,
        showBottomNav: false,
        showHeader: true,
        animation: 'slide',
        icon: null,
        order: null
    },
    
    [RouteNames.HELP]: {
        path: '/help',
        screenId: 'helpScreen',
        title: 'Bantuan',
        requiresAuth: false,
        showBottomNav: false,
        showHeader: true,
        animation: 'slide',
        icon: null,
        order: null
    },
    
    [RouteNames.TERMS]: {
        path: '/terms',
        screenId: 'termsScreen',
        title: 'Syarat & Ketentuan',
        requiresAuth: false,
        showBottomNav: false,
        showHeader: true,
        animation: 'slide',
        icon: null,
        order: null
    },
    
    [RouteNames.PRIVACY]: {
        path: '/privacy',
        screenId: 'privacyScreen',
        title: 'Kebijakan Privasi',
        requiresAuth: false,
        showBottomNav: false,
        showHeader: true,
        animation: 'slide',
        icon: null,
        order: null
    }
};
/**
 * Bottom Tab Routes
 * Routes that appear in bottom navigation
 */
export const BottomTabRoutes = Object.keys(Routes)
    .filter(key => Routes[key].bottomTab)
    .sort((a, b) => Routes[a].order - Routes[b].order)
    .map(key => ({
        name: key,
        ...Routes[key]
    }));
/**
 * Public Routes (no authentication required)
 */
export const PublicRoutes = Object.keys(Routes)
    .filter(key => !Routes[key].requiresAuth)
    .map(key => Routes[key].path);
/**
 * Protected Routes (authentication required)
 */
export const ProtectedRoutes = Object.keys(Routes)
    .filter(key => Routes[key].requiresAuth)
    .map(key => Routes[key].path);
/**
 * Navigation Animation Types
 */
export const NavigationAnimations = {
    FADE: 'fade',
    SLIDE: 'slide',
    SLIDE_UP: 'slideUp',
    SLIDE_DOWN: 'slideDown',
    ZOOM: 'zoom',
    FLIP: 'flip',
    NONE: 'none'
};
/**
 * Default Route (when authenticated)
 */
export const DEFAULT_AUTHENTICATED_ROUTE = RouteNames.HOME;
/**
 * Default Route (when not authenticated)
 */
export const DEFAULT_UNAUTHENTICATED_ROUTE = RouteNames.SPLASH;
/**
 * Redirect After Login
 */
export const REDIRECT_AFTER_LOGIN = RouteNames.HOME;
/**
 * Redirect After Logout
 */
export const REDIRECT_AFTER_LOGOUT = RouteNames.LOGIN;
/**
 * Navigation Configuration
 */
export const NavigationConfig = {
    // Enable browser history
    useBrowserHistory: true,
    
    // Hash routing (for static hosting)
    useHashRouting: false,
    
    // Scroll to top on navigation
    scrollToTop: true,
    
    // Save navigation history
    saveHistory: true,
    
    // Maximum history length
    maxHistoryLength: 50,
    
    // Enable gestures
    enableGestures: true,
    
    // Swipe back gesture
    swipeBackEnabled: true,
    
    // Animation duration
    animationDuration: 300,
    
    // Enable transition animations
    enableAnimations: true,
    
    // Default animation
    defaultAnimation: NavigationAnimations.SLIDE
};
/**
 * Deep Link Configuration
 */
export const DeepLinkConfig = {
    enabled: true,
    prefix: 'modiva://',
    universalLinks: [
        'https://modiva.app',
        'https://www.modiva.app'
    ],
    
    // Deep link mapping
    paths: {
        'report/:id': RouteNames.REPORT_DETAIL,
        'notification/:id': RouteNames.NOTIFICATION_DETAIL,
        'health-tip/:id': RouteNames.HEALTH_TIP_DETAIL
    }
};
/**
 * Helper function to get route by name
 * @param {string} name - Route name
 * @returns {object|null} - Route configuration
 */
export function getRouteByName(name) {
    return Routes[name] || null;
}
/**
 * Helper function to get route by path
 * @param {string} path - Route path
 * @returns {object|null} - Route configuration
 */
export function getRouteByPath(path) {
    const routeName = Object.keys(Routes).find(key => Routes[key].path === path);
    return routeName ? Routes[routeName] : null;
}
/**
 * Helper function to get route by screen ID
 * @param {string} screenId - Screen ID
 * @returns {object|null} - Route configuration
 */
export function getRouteByScreenId(screenId) {
    const routeName = Object.keys(Routes).find(key => Routes[key].screenId === screenId);
    return routeName ? Routes[routeName] : null;
}
/**
 * Helper function to check if route requires authentication
 * @param {string} path - Route path
 * @returns {boolean} - True if authentication required
 */
export function isProtectedRoute(path) {
    return ProtectedRoutes.includes(path);
}
/**
 * Helper function to build route path with parameters
 * @param {string} routeName - Route name
 * @param {object} params - Route parameters
 * @returns {string} - Full route path
 */
export function buildRoutePath(routeName, params = {}) {
    const route = getRouteByName(routeName);
    if (!route) return '/';
    
    let path = route.path;
    
    // Replace parameters
    Object.keys(params).forEach(key => {
        path = path.replace(`:${key}`, params[key]);
    });
    
    return path;
}
/**
 * Helper function to get all bottom tab routes
 * @returns {array} - Array of bottom tab routes
 */
export function getBottomTabRoutes() {
    return BottomTabRoutes;
}
/**
 * Helper function to validate route
 * @param {string} path - Route path
 * @returns {boolean} - True if valid route
 */
export function isValidRoute(path) {
    return Object.values(Routes).some(route => route.path === path);
}
/**
 * Helper function to get previous route
 * @param {array} history - Navigation history
 * @returns {object|null} - Previous route
 */
export function getPreviousRoute(history = []) {
    if (history.length < 2) return null;
    return history[history.length - 2];
}
// Freeze configuration
Object.freeze(RouteNames);
Object.freeze(Routes);
Object.freeze(BottomTabRoutes);
Object.freeze(PublicRoutes);
Object.freeze(ProtectedRoutes);
Object.freeze(NavigationAnimations);
Object.freeze(NavigationConfig);
Object.freeze(DeepLinkConfig);
export default Routes;