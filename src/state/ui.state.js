/**
 * Modiva - UI State
 * UI state management (modals, loading, theme, etc.)
 * @module state/ui
 */
/**
 * UI State Module
 */
export const UIState = {
    /**
     * Get initial UI state
     * @returns {object}
     */
    getInitialState() {
        return {
            // Loading states
            loading: {},
            globalLoading: false,
            
            // Modal states
            modal: {
                isOpen: false,
                type: null, // 'success', 'error', 'confirm', 'custom'
                title: null,
                message: null,
                data: null,
                onConfirm: null,
                onCancel: null
            },
            
            // Toast/notification states
            toast: {
                isVisible: false,
                type: 'info', // 'success', 'error', 'warning', 'info'
                message: null,
                duration: 3000
            },
            
            // Theme
            theme: 'light', // 'light', 'dark', 'auto'
            
            // Language
            language: 'id', // 'id', 'en'
            
            // Navigation
            currentScreen: null,
            previousScreen: null,
            navigationHistory: [],
            
            // Bottom navigation
            showBottomNav: true,
            activeTab: 'home',
            
            // Drawer/Sidebar
            drawer: {
                isOpen: false,
                content: null
            },
            
            // App bar
            appBar: {
                title: 'Modiva',
                showBackButton: false,
                actions: []
            },
            
            // Screen-specific UI states
            screens: {
                home: {
                    scrollPosition: 0
                },
                reports: {
                    scrollPosition: 0,
                    viewMode: 'list' // 'list', 'grid'
                },
                notifications: {
                    scrollPosition: 0
                },
                profile: {
                    scrollPosition: 0
                }
            },
            
            // Overlay
            overlay: {
                isVisible: false,
                opacity: 0.5
            }
        };
    },
    /**
     * Set loading state for specific key
     * @param {object} state - Current state
     * @param {object} payload - { key, isLoading }
     * @returns {object} - New state
     */
    setLoading(state, payload) {
        const { key, isLoading } = payload;
        
        return {
            ...state,
            loading: {
                ...state.loading,
                [key]: isLoading
            }
        };
    },
    /**
     * Set global loading
     * @param {object} state - Current state
     * @param {boolean} payload - Loading flag
     * @returns {object} - New state
     */
    setGlobalLoading(state, payload) {
        return {
            ...state,
            globalLoading: payload
        };
    },
    /**
     * Show modal
     * @param {object} state - Current state
     * @param {object} payload - Modal configuration
     * @returns {object} - New state
     */
    showModal(state, payload) {
        return {
            ...state,
            modal: {
                isOpen: true,
                type: payload.type || 'custom',
                title: payload.title || null,
                message: payload.message || null,
                data: payload.data || null,
                onConfirm: payload.onConfirm || null,
                onCancel: payload.onCancel || null
            },
            overlay: {
                isVisible: true,
                opacity: 0.5
            }
        };
    },
    /**
     * Hide modal
     * @param {object} state - Current state
     * @returns {object} - New state
     */
    hideModal(state) {
        return {
            ...state,
            modal: {
                isOpen: false,
                type: null,
                title: null,
                message: null,
                data: null,
                onConfirm: null,
                onCancel: null
            },
            overlay: {
                isVisible: false,
                opacity: 0.5
            }
        };
    },
    /**
     * Show toast
     * @param {object} state - Current state
     * @param {object} payload - Toast configuration
     * @returns {object} - New state
     */
    showToast(state, payload) {
        return {
            ...state,
            toast: {
                isVisible: true,
                type: payload.type || 'info',
                message: payload.message || '',
                duration: payload.duration || 3000
            }
        };
    },
    /**
     * Hide toast
     * @param {object} state - Current state
     * @returns {object} - New state
     */
    hideToast(state) {
        return {
            ...state,
            toast: {
                isVisible: false,
                type: 'info',
                message: null,
                duration: 3000
            }
        };
    },
    /**
     * Set theme
     * @param {object} state - Current state
     * @param {string} payload - Theme name
     * @returns {object} - New state
     */
    setTheme(state, payload) {
        return {
            ...state,
            theme: payload
        };
    },
    /**
     * Set language
     * @param {object} state - Current state
     * @param {string} payload - Language code
     * @returns {object} - New state
     */
    setLanguage(state, payload) {
        return {
            ...state,
            language: payload
        };
    },
    /**
     * Set current screen
     * @param {object} state - Current state
     * @param {string} payload - Screen name
     * @returns {object} - New state
     */
    setCurrentScreen(state, payload) {
        const newHistory = [...state.navigationHistory, payload].slice(-20); // Keep last 20
        return {
            ...state,
            currentScreen: payload,
            previousScreen: state.currentScreen,
            navigationHistory: newHistory
        };
    },
    /**
     * Toggle bottom navigation
     * @param {object} state - Current state
     * @param {boolean} payload - Show/hide flag
     * @returns {object} - New state
     */
    toggleBottomNav(state, payload) {
        return {
            ...state,
            showBottomNav: payload
        };
    },
    /**
     * Set active tab
     * @param {object} state - Current state
     * @param {string} payload - Tab name
     * @returns {object} - New state
     */
    setActiveTab(state, payload) {
        return {
            ...state,
            activeTab: payload
        };
    },
    /**
     * Toggle drawer
     * @param {object} state - Current state
     * @param {object} payload - { isOpen, content }
     * @returns {object} - New state
     */
    toggleDrawer(state, payload) {
        return {
            ...state,
            drawer: {
                isOpen: payload.isOpen !== undefined ? payload.isOpen : !state.drawer.isOpen,
                content: payload.content || null
            },
            overlay: {
                isVisible: payload.isOpen !== undefined ? payload.isOpen : !state.drawer.isOpen,
                opacity: 0.5
            }
        };
    },
    /**
     * Set app bar
     * @param {object} state - Current state
     * @param {object} payload - App bar configuration
     * @returns {object} - New state
     */
    setAppBar(state, payload) {
        return {
            ...state,
            appBar: {
                ...state.appBar,
                ...payload
            }
        };
    },
    /**
     * Set screen UI state
     * @param {object} state - Current state
     * @param {object} payload - { screen, updates }
     * @returns {object} - New state
     */
    setScreenUIState(state, payload) {
        const { screen, updates } = payload;
        
        return {
            ...state,
            screens: {
                ...state.screens,
                [screen]: {
                    ...state.screens[screen],
                    ...updates
                }
            }
        };
    },
    /**
     * Set scroll position
     * @param {object} state - Current state
     * @param {object} payload - { screen, position }
     * @returns {object} - New state
     */
    setScrollPosition(state, payload) {
        const { screen, position } = payload;
        
        return {
            ...state,
            screens: {
                ...state.screens,
                [screen]: {
                    ...state.screens[screen],
                    scrollPosition: position
                }
            }
        };
    },
    /**
     * Show overlay
     * @param {object} state - Current state
     * @param {number} payload - Opacity (0-1)
     * @returns {object} - New state
     */
    showOverlay(state, payload) {
        return {
            ...state,
            overlay: {
                isVisible: true,
                opacity: payload || 0.5
            }
        };
    },
    /**
     * Hide overlay
     * @param {object} state - Current state
     * @returns {object} - New state
     */
    hideOverlay(state) {
        return {
            ...state,
            overlay: {
                isVisible: false,
                opacity: 0.5
            }
        };
    },
    /**
     * Check if any loading is active
     * @param {object} state - Current state
     * @returns {boolean}
     */
    isAnyLoading(state) {
        return state.globalLoading || Object.values(state.loading).some(loading => loading);
    },
    /**
     * Get screen UI state
     * @param {object} state - Current state
     * @param {string} screen - Screen name
     * @returns {object}
     */
    getScreenUIState(state, screen) {
        return state.screens[screen] || {};
    }
};
export default UIState;
