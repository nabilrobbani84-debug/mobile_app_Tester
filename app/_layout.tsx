import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/use-color-scheme';
// Import AuthProvider dari state management Anda
import { NotificationController } from '../src/controllers/notification.controller';
import { AuthProvider } from '../src/state/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

import * as Notifications from 'expo-notifications';

// Configure Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  console.log("RootLayout is rendering");
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide the native splash screen immediately when the root layout mounts
    // We will show our CUSTOM JS Splash Screen (app/index.tsx) instead
    SplashScreen.hideAsync();

    // Start Notification Scheduler
    NotificationController.startScheduler();

    return () => {
        NotificationController.stopScheduler();
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
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