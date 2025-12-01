// src/middleware/authMiddleware.js
// Authentication middleware for API requests and navigation
import { getAuthToken, getUserData, clearUserSession } from '../utils/helpers/storageHelpers';
import { resetToAuth } from '../utils/helpers/navigationHelpers';
/**
 * Token expiration check
 * @param {string} token - JWT token
 * @returns {boolean} Whether token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    // Decode JWT payload (base64)
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;
    if (!exp) return false; // No expiration set
    // Check if expired (with 5 minute buffer)
    const currentTime = Math.floor(Date.now() / 1000);
    const buffer = 5 * 60; // 5 minutes
    return currentTime >= (exp - buffer);
  } catch (error) {
    console.error('Token decode error:', error);
    return true;
  }
};
/**
 * Get token remaining time in seconds
 * @param {string} token - JWT token
 * @returns {number} Remaining time in seconds
 */
export const getTokenRemainingTime = (token) => {
  if (!token) return 0;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return 0;
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;
    if (!exp) return Infinity;
    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, exp - currentTime);
  } catch (error) {
    return 0;
  }
};
/**
 * Auth middleware for axios interceptor
 * Adds authorization header to requests
 */
export const authRequestInterceptor = async (config) => {
  try {
    const token = await getAuthToken();
    if (token) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        console.log('Token expired, attempting refresh...');
        // Could trigger token refresh here
        // For now, we'll let the response interceptor handle 401s
      }
      // Add authorization header
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  } catch (error) {
    console.error('Auth interceptor error:', error);
    return config;
  }
};
/**
 * Auth middleware for axios response interceptor
 * Handles 401 unauthorized responses
 */
export const authResponseInterceptor = {
  onSuccess: (response) => {
    return response;
  },
  onError: async (error) => {
    const originalRequest = error.config;
    // Check for 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('Received 401, handling unauthorized...');
      // Clear session and redirect to login
      await handleUnauthorized();
      // Reject the original request
      return Promise.reject(error);
    }
    // Check for 403 Forbidden
    if (error.response?.status === 403) {
      console.log('Received 403, insufficient permissions');
      // Could show permission error modal here
    }
    return Promise.reject(error);
  },
};
/**
 * Handle unauthorized access
 * Clears session and redirects to login
 */
export const handleUnauthorized = async () => {
  try {
    // Clear stored session
    await clearUserSession();
    // Navigate to login
    resetToAuth();
    // Could also dispatch a logout action to state management
    console.log('Session cleared, redirecting to login');
  } catch (error) {
    console.error('Error handling unauthorized:', error);
  }
};
/**
 * Verify current session is valid
 * @returns {Promise<boolean>} Whether session is valid
 */
export const verifySession = async () => {
  try {
    const token = await getAuthToken();
    const userData = await getUserData();
    if (!token || !userData) {
      return false;
    }
    if (isTokenExpired(token)) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Session verification error:', error);
    return false;
  }
};
/**
 * Auth guard for protected routes
 * Use in navigation to protect screens
 */
export const authGuard = async (navigation, targetRoute) => {
  const isValid = await verifySession();
  if (!isValid) {
    // Redirect to login with return route
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Auth',
          state: {
            routes: [
              {
                name: 'Login',
                params: { returnTo: targetRoute },
              },
            ],
          },
        },
      ],
    });
    return false;
  }
  return true;
};
/**
 * Role-based access control middleware
 * @param {string[]} allowedRoles - Roles allowed to access
 * @param {object} user - Current user object
 * @returns {boolean} Whether access is allowed
 */
export const checkRoleAccess = (allowedRoles, user) => {
  if (!user || !user.role) {
    return false;
  }
  return allowedRoles.includes(user.role);
};
/**
 * Create protected API call wrapper
 * @param {function} apiCall - API call function
 * @returns {function} Wrapped function with auth check
 */
export const withAuth = (apiCall) => {
  return async (...args) => {
    const isValid = await verifySession();
    if (!isValid) {
      await handleUnauthorized();
      throw new Error('Session expired');
    }
    return apiCall(...args);
  };
};
/**
 * Middleware to track last activity
 * Can be used to implement session timeout
 */
let lastActivityTime = Date.now();
export const updateLastActivity = () => {
  lastActivityTime = Date.now();
};
export const getLastActivity = () => lastActivityTime;
export const checkSessionTimeout = (timeoutMs = 30 * 60 * 1000) => {
  const now = Date.now();
  const elapsed = now - lastActivityTime;
  return elapsed > timeoutMs;
};
/**
 * Session activity tracker HOC
 * Wraps screens to track user activity
 */
export const withActivityTracking = (WrappedComponent) => {
  return (props) => {
    // Update activity on mount and interactions
    React.useEffect(() => {
      updateLastActivity();
    }, []);
    return <WrappedComponent {...props} />;
  };
};
export default {
  isTokenExpired,
  getTokenRemainingTime,
  authRequestInterceptor,
  authResponseInterceptor,
  handleUnauthorized,
  verifySession,
  authGuard,
  checkRoleAccess,
  withAuth,
  updateLastActivity,
  getLastActivity,
  checkSessionTimeout,
  withActivityTracking,
};