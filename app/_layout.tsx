import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/use-color-scheme';
import { AppConfig } from '../src/config/app.config';
// Import AuthProvider dari state management Anda
import { NotificationController } from '../src/controllers/notification.controller';
import { AuthProvider, useAuth } from '../src/state/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Configure Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppStartupEffects() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (!AppConfig.features.enableNotifications || !isAuthenticated) {
      NotificationController.stopScheduler();
      return;
    }

    const timer = setTimeout(() => {
      NotificationController.startScheduler();
    }, 1200);

    return () => {
      clearTimeout(timer);
      NotificationController.stopScheduler();
    };
  }, [isAuthenticated]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AppStartupEffects />
        <Stack>
          {/* Tambahkan ini: Sembunyikan header untuk halaman index (Splash) */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
