/**
 * Modiva - Application Configuration
 * Main application-wide configuration settings
 * @module config/app
 */
export const AppConfig = {
    // ============================================
    // APPLICATION INFORMATION
    // ============================================
    app: {
        name: 'Modiva',
        fullName: 'Monitoring Distribusi Vitamin',
        version: '1.0.0',
        description: 'Aplikasi monitoring konsumsi vitamin dan tracking hemoglobin siswa',
        author: 'Modiva Development Team',
        license: 'MIT',
        repository: 'https://github.com/your-org/modiva'
    },
    // ============================================
    // ENVIRONMENT SETTINGS
    // ============================================
    environment: {
        mode: import.meta.env?.MODE || 'production', // development, staging, production
        debug: import.meta.env?.DEV || false,
        apiUrl: import.meta.env?.VITE_API_URL || 'https://api.modiva.app/v1',
        useMockApi: import.meta.env?.VITE_USE_MOCK_API === 'true' || true
    },
    // ============================================
    // UI SETTINGS
    // ============================================
    ui: {
        // Splash screen duration in milliseconds
        splashDuration: 3000,
        
        // Toast/notification duration
        toastDuration: 3000,
        
        // Modal animation duration
        modalAnimationDuration: 300,
        
        // Chart animation duration
        chartAnimationDuration: 500,
        
        // Debounce delay for search/input
        debounceDelay: 300,
        
        // Pagination
        itemsPerPage: 10,
        maxItemsPerPage: 100,
        
        // Maximum width for mobile view
        mobileMaxWidth: 428,
        
        // Theme
        defaultTheme: 'light', // light, dark, auto
        
        // Language
        defaultLanguage: 'id', // id, en
        
        // Date format
        dateFormat: 'DD/MM/YYYY',
        dateTimeFormat: 'DD/MM/YYYY HH:mm',
        timeFormat: 'HH:mm'
    },
    // ============================================
    // FEATURES FLAGS
    // ============================================
    features: {
        // Enable/disable features
        offlineMode: true,
        pushNotifications: true,
        analytics: false,
        darkMode: false,
        multiLanguage: false,
        
        // Beta features
        betaFeatures: {
            voiceInput: false,
            aiRecommendations: false,
            socialSharing: false
        }
    },
    // ============================================
    // PERFORMANCE SETTINGS
    // ============================================
    performance: {
        // Enable lazy loading
        lazyLoading: true,
        
        // Cache duration in milliseconds
        cacheDuration: 5 * 60 * 1000, // 5 minutes
        
        // API retry configuration
        apiRetry: {
            maxAttempts: 3,
            delay: 1000, // ms
            backoff: 'exponential' // linear, exponential
        },
        
        // Image loading
        imageLazyLoad: true,
        imagePreload: false
    },
    // ============================================
    // SECURITY SETTINGS
    // ============================================
    security: {
        // Token settings
        tokenKey: 'modiva_auth_token',
        tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
        
        // Session timeout in milliseconds
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        
        // Encryption
        encryptLocalStorage: false,
        
        // CSRF protection
        csrfEnabled: true,
        csrfHeader: 'X-CSRF-TOKEN',
        
        // Content Security Policy
        csp: {
            enabled: true,
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.tailwindcss.com', 'cdn.jsdelivr.net'],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'", 'https://api.modiva.app']
            }
        }
    },
    // ============================================
    // ANALYTICS & MONITORING
    // ============================================
    analytics: {
        enabled: false,
        providers: {
            googleAnalytics: {
                enabled: false,
                trackingId: 'GA_MEASUREMENT_ID'
            },
            sentry: {
                enabled: false,
                dsn: 'SENTRY_DSN',
                environment: 'production',
                tracesSampleRate: 1.0
            }
        }
    },
    // ============================================
    // LOGGING SETTINGS
    // ============================================
    logging: {
        enabled: true,
        level: 'info', // error, warn, info, debug, trace
        console: true,
        remote: false,
        remoteUrl: null,
        
        // What to log
        logApi: true,
        logNavigation: true,
        logState: true,
        logErrors: true
    },
    // ============================================
    // PWA SETTINGS
    // ============================================
    pwa: {
        enabled: true,
        
        // Service worker settings
        serviceWorker: {
            enabled: true,
            updateInterval: 60 * 60 * 1000, // 1 hour
            cacheFirst: true
        },
        
        // Install prompt
        installPrompt: {
            enabled: true,
            delay: 5000 // Show after 5 seconds
        },
        
        // Offline page
        offlinePage: '/offline.html',
        
        // App shortcuts
        shortcuts: [
            {
                name: 'Isi Laporan',
                url: '/report-form',
                icon: '/icons/report.png'
            },
            {
                name: 'Lihat Laporan',
                url: '/reports',
                icon: '/icons/reports.png'
            }
        ]
    },
    // ============================================
    // NOTIFICATION SETTINGS
    // ============================================
    notifications: {
        enabled: true,
        
        // Push notifications
        push: {
            enabled: false,
            vapidPublicKey: null
        },
        
        // Local notifications
        local: {
            enabled: true,
            reminderTime: '08:00', // Daily reminder at 8 AM
            sound: true,
            vibrate: true
        }
    },
    // ============================================
    // LOCALIZATION
    // ============================================
    localization: {
        defaultLocale: 'id-ID',
        supportedLocales: ['id-ID', 'en-US'],
        fallbackLocale: 'id-ID',
        
        // Currency
        currency: 'IDR',
        currencyDisplay: 'symbol',
        
        // Number formatting
        numberFormat: {
            decimal: ',',
            thousand: '.',
            precision: 2
        }
    },
    // ============================================
    // ACCESSIBILITY
    // ============================================
    accessibility: {
        enabled: true,
        
        // Screen reader support
        screenReader: true,
        
        // Keyboard navigation
        keyboardNav: true,
        
        // High contrast mode
        highContrast: false,
        
        // Font scaling
        fontScaling: {
            min: 0.8,
            max: 1.5,
            default: 1.0
        }
    },
    // ============================================
    // DEVELOPMENT TOOLS
    // ============================================
    devTools: {
        // Redux DevTools
        reduxDevTools: true,
        
        // React DevTools
        reactDevTools: true,
        
        // Debug overlay
        debugOverlay: false,
        
        // Performance monitoring
        performanceMonitor: false
    }
};
// Freeze configuration to prevent modifications
if (Object.freeze) {
    Object.freeze(AppConfig);
}
export default AppConfig;
