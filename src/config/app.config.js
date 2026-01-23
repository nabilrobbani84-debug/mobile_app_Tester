// File: src/config/app.config.js
/**
 * Modiva - Application Configuration
 * Centralized configuration for the entire application
 * @module config/app.config
 */

// Environment configurations
const environments = {
  development: {
    // Android Emulator uses 10.0.2.2 to access host localhost.
    // Ensure your Django backend is running on port 8000.
    apiUrl: process.env.REACT_APP_API_URL || 'http://10.0.2.2:8000/api',
    useMockApi: false, // Set to true to test UI without backend dependencies
    debug: true,
    logLevel: 'debug'
  },
  staging: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://staging-api.modiva.com/api',
    useMockApi: false,
    debug: true,
    logLevel: 'info'
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://api.modiva.com/api',
    useMockApi: false,
    debug: false,
    logLevel: 'error'
  }
};

// Get current environment
const getCurrentEnvironment = () => {
  const env = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return 'production';
    case 'staging':
      return 'staging';
    case 'test':
      return 'development'; // Use development config for tests
    default:
      return 'development';
  }
};

const currentEnv = getCurrentEnvironment();

// Main application configuration
export const AppConfig = {
  // Environment specific settings
  environment: environments[currentEnv],
  
  // Current environment name
  currentEnv,
  
  // Application metadata
  app: {
    name: 'Modiva',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    buildNumber: process.env.REACT_APP_BUILD_NUMBER || '1'
  },
  
  // Feature flags
  features: {
    enableAnalytics: true,
    enableNotifications: true,
    enableOfflineMode: true,
    enableCache: true
  },
  
  // Performance settings
  performance: {
    apiRetry: {
      maxAttempts: 3,
      delay: 1000,
      backoff: 2
    },
    cacheDuration: 5 * 60 * 1000, // 5 minutes in milliseconds
    requestTimeout: 10000,
    uploadTimeout: 60000
  },
  
  // Security settings
  security: {
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
    storageEncryption: true,
    enableCSP: true
  },
  
  // Analytics settings
  analytics: {
    enabled: true,
    trackingId: process.env.REACT_APP_GA_TRACKING_ID || '',
    sampleRate: 1.0
  },
  
  // Localization
  localization: {
    defaultLocale: 'id-ID',
    supportedLocales: ['id-ID', 'en-US'],
    fallbackLocale: 'id-ID'
  },
  
  // Debug settings
  debug: {
    logApiCalls: currentEnv === 'development',
    logReduxActions: currentEnv === 'development',
    enableReactQueryDevtools: currentEnv === 'development'
  }
};

// Freeze configuration to prevent accidental modifications
Object.freeze(AppConfig);
Object.freeze(AppConfig.environment);
Object.freeze(AppConfig.app);
Object.freeze(AppConfig.features);
Object.freeze(AppConfig.performance);
Object.freeze(AppConfig.security);

// Helper function to check if running in development
export const isDevelopment = () => currentEnv === 'development';

// Helper function to check if running in production
export const isProduction = () => currentEnv === 'production';

// Helper function to get API URL
export const getApiUrl = () => AppConfig.environment.apiUrl;

// Helper function to check if mock API is enabled
export const isMockApiEnabled = () => AppConfig.environment.useMockApi;

export default AppConfig;