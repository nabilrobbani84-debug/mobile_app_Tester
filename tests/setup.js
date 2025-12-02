import '@testing-library/jest-native/extend-expect';
// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    version: '1.0.0',
    extra: {
      apiUrl: 'http://localhost:3000/api/v1',
    },
  },
  sessionId: 'test-session-id',
}));
// Mock expo-device
jest.mock('expo-device', () => ({
  brand: 'Apple',
  manufacturer: 'Apple',
  modelName: 'iPhone 14',
  osName: 'iOS',
  osVersion: '16.0',
  deviceType: 1,
  isDevice: false,
}));
// Mock react-navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    useFocusEffect: jest.fn(),
    useIsFocused: () => true,
  };
});
// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() => Promise.resolve({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
  })),
}));
// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchCameraAsync: jest.fn(() => Promise.resolve({
    canceled: false,
    assets: [{
      uri: 'file://test-image.jpg',
      width: 300,
      height: 400,
    }],
  })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({
    canceled: false,
    assets: [{
      uri: 'file://test-image.jpg',
      width: 300,
      height: 400,
    }],
  })),
}));
// Mock Animated
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
// Global test utilities
global.mockConsole = () => {
  const originalConsole = { ...console };
  
  beforeAll(() => {
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });
  afterAll(() => {
    console.log = originalConsole.log;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });
};
// Mock timers for animations
global.mockTimers = () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
};
// Test data factories
global.createMockUser = (overrides = {}) => ({
  id: 'usr_test_001',
  name: 'Test User',
  nisn: '0110222079',
  email: 'test@email.com',
  school_id: 'SMPN1JKT',
  school_name: 'SMPN 1 Jakarta',
  class_name: 'IX-A',
  hb_last: 12.5,
  consumption_count: 8,
  total_target: 48,
  height: 165,
  weight: 52,
  ...overrides,
});
global.createMockReport = (overrides = {}) => ({
  id: 'rpt_test_001',
  consumption_date: '2024-05-12',
  hb_value: 12.5,
  vitamin_type: 'TTD',
  image_url: 'https://example.com/image.jpg',
  status: 'verified',
  submitted_at: '2024-05-12T08:30:00Z',
  ...overrides,
});
global.createMockNotification = (overrides = {}) => ({
  id: 'notif_test_001',
  type: 'vitamin_reminder',
  title: 'Test Notification',
  message: 'This is a test notification',
  is_read: false,
  created_at: '2024-05-12T08:00:00Z',
  ...overrides,
});
// Wait for async operations
global.waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));
// Suppress specific warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0]?.includes?.('Animated: `useNativeDriver`') ||
    args[0]?.includes?.('componentWillReceiveProps') ||
    args[0]?.includes?.('componentWillMount')
  ) {
    return;
  }
  originalWarn.apply(console, args);
};
// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});