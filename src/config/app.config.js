/**
 * Application Configuration
 * Centralized configuration for the application
 */

const AppConfig = {
    // ============================================
    // App Identity
    // ============================================
    app: {
        name: 'Modiva',
        version: '1.0.0',
        build: '1',
        bundleId: 'com.modiva.app',
        copyright: '© 2025 Modiva Health'
    },

    // ============================================
    // Environment Configuration
    // ============================================
    environment: {
        // FIX: Gunakan process.env untuk React Native/Expo
        mode: process.env.NODE_ENV || 'development', 
        
        // FIX: Gunakan global __DEV__ variabel
        debug: __DEV__, 
        
        // FIX: Gunakan process.env.EXPO_PUBLIC_...
        // Pastikan Anda menamai variabel di .env dengan awalan EXPO_PUBLIC_
        apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.modiva.app/v1',
        
        useMockApi: process.env.EXPO_PUBLIC_USE_MOCK_API === 'true' || true
    },

    // ============================================
    // Feature Flags
    // ============================================
    features: {
        enableBiometrics: false,
        enableNotifications: true,
        enableOfflineMode: true,
        enableAnalytics: true,
        enableDarkTheme: false
    },

    // ============================================
    // Logging Configuration (DITAMBAHKAN)
    // ============================================
    // Bagian ini PENTING agar logger.js tidak error saat membaca AppConfig.logging
    logging: {
        level: __DEV__ ? 'DEBUG' : 'WARN', // Debug saat dev, Warn saat produksi
        enabled: true,
        console: true,
        remote: false, // Set true jika ingin kirim log ke server
        remoteUrl: 'https://logs.modiva.app/ingest'
    },

    // ============================================
    // Constants
    // ============================================
    constants: {
        ANIMATION_DURATION: 300,
        TOAST_DURATION: 3000,
        API_TIMEOUT: 15000,
        MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
        DATE_FORMAT: 'DD/MM/YYYY',
        TIME_FORMAT: 'HH:mm'
    }
};

// Freeze configuration to prevent accidental modifications
Object.freeze(AppConfig);

export default AppConfig;