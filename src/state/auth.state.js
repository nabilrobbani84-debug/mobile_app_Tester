/**
 * Modiva - Auth State
 * Authentication state management
 * @module state/auth
 */
/**
 * Auth State Module
 */
export const AuthState = {
    /**
     * Get initial auth state
     * @returns {object}
     */
    getInitialState() {
        return {
            isLoggedIn: false,
            token: null,
            refreshToken: null,
            tokenExpiry: null,
            sessionId: null,
            lastLogin: null,
            rememberMe: false
        };
    },
    /**
     * Login action
     * @param {object} state - Current state
     * @param {object} payload - Login payload (token, user, etc)
     * @returns {object} - New state
     */
    login(state, payload) {
        const { token, refreshToken, expiresIn = 24 * 60 * 60 * 1000 } = payload;
        
        return {
            ...state,
            isLoggedIn: true,
            token,
            refreshToken: refreshToken || null,
            tokenExpiry: Date.now() + expiresIn,
            sessionId: 'session_' + Date.now(),
            lastLogin: Date.now()
        };
    },
    /**
     * Logout action
     * @param {object} state - Current state
     * @returns {object} - New state
     */
    logout(state) {
        return this.getInitialState();
    },
    /**
     * Set token
     * @param {object} state - Current state
     * @param {object} payload - Token data
     * @returns {object} - New state
     */
    setToken(state, payload) {
        const { token, expiresIn = 24 * 60 * 60 * 1000 } = payload;
        
        return {
            ...state,
            token,
            tokenExpiry: Date.now() + expiresIn
        };
    },
    /**
     * Refresh token
     * @param {object} state - Current state
     * @param {object} payload - New tokens
     * @returns {object} - New state
     */
    refreshToken(state, payload) {
        const { token, refreshToken, expiresIn = 24 * 60 * 60 * 1000 } = payload;
        
        return {
            ...state,
            token,
            refreshToken: refreshToken || state.refreshToken,
            tokenExpiry: Date.now() + expiresIn
        };
    },
    /**
     * Check if authenticated
     * @param {object} state - Current state
     * @returns {boolean}
     */
    isAuthenticated(state) {
        return state.isLoggedIn && 
               state.token !== null && 
               state.tokenExpiry !== null && 
               Date.now() < state.tokenExpiry;
    },
    /**
     * Check if token is expired
     * @param {object} state - Current state
     * @returns {boolean}
     */
    isTokenExpired(state) {
        if (!state.tokenExpiry) return true;
        return Date.now() >= state.tokenExpiry;
    },
    /**
     * Get time until token expiry
     * @param {object} state - Current state
     * @returns {number} - Time in ms, or 0 if expired
     */
    getTimeUntilExpiry(state) {
        if (!state.tokenExpiry) return 0;
        const remaining = state.tokenExpiry - Date.now();
        return Math.max(0, remaining);
    }
};
export default AuthState;