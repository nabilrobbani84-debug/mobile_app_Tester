// src/routes/AppNavigator.js
// Main App Navigator - Root navigation container
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, View, ActivityIndicator, StyleSheet } from 'react-native';
// Navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
// Hooks & Services
import { useAuth } from '../state/AuthContext';
import { setNavigationRef, ROUTES } from '../utils/helpers/navigationHelpers';
import { getAuthToken, getUserData } from '../utils/helpers/storageHelpers';
import { COLORS } from '../config/theme';
// Screens
import { SplashTemplate } from '../views/templates/AuthTemplate';
const Stack = createNativeStackNavigator();
/**
 * AppNavigator - Root navigator that handles auth state
 * Switches between Auth and Main navigation based on authentication
 */
const AppNavigator = () => {
  const { isAuthenticated, isLoading, restoreSession } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  // Restore session on app launch
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for stored auth session
        const token = await getAuthToken();
        const userData = await getUserData();
        if (token && userData) {
          // Restore the session
          await restoreSession(token, userData);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    initializeApp();
  }, []);
  // Handle splash screen timing
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Show splash for 3 seconds
    return () => clearTimeout(splashTimer);
  }, []);
  // Show splash screen
  if (showSplash) {
    return (
      <SplashTemplate
        message="Pantau kesehatan, Rutin Minum Vitamin"
        version="1.0.0"
        onAnimationComplete={() => setShowSplash(false)}
      />
    );
  }
  // Show loading while initializing
  if (isInitializing || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  return (
    <NavigationContainer
      ref={(ref) => setNavigationRef(ref)}
      onReady={() => {
        console.log('Navigation is ready');
      }}
      onStateChange={(state) => {
        // Track screen changes for analytics
        const currentRoute = state?.routes[state.index];
        console.log('Current screen:', currentRoute?.name);
      }}
      theme={{
        dark: false,
        colors: {
          primary: COLORS.primary,
          background: COLORS.background,
          card: COLORS.white,
          text: COLORS.dark,
          border: COLORS.border,
          notification: COLORS.secondary,
        },
      }}
    >
      <StatusBar
        barStyle={isAuthenticated ? 'dark-content' : 'light-content'}
        backgroundColor={isAuthenticated ? COLORS.white : COLORS.primary}
      />
      
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {isAuthenticated ? (
          // Main App Flow
          <Stack.Screen
            name="MainApp"
            component={MainNavigator}
            options={{
              animationTypeForReplace: 'push',
            }}
          />
        ) : (
          // Auth Flow
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
/**
 * Linking configuration for deep links
 */
export const linkingConfig = {
  prefixes: ['modiva://', 'https://modiva.app'],
  config: {
    screens: {
      MainApp: {
        screens: {
          Home: 'home',
          Reports: 'reports',
          Notifications: 'notifications',
          Profile: 'profile',
          ReportForm: 'report/new',
          ReportDetail: 'report/:reportId',
          HealthTipDetail: 'health-tip/:tipId',
        },
      },
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
    },
  },
};
/**
 * Navigation theme configuration
 */
export const navigationTheme = {
  dark: false,
  colors: {
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.white,
    text: COLORS.dark,
    border: COLORS.border,
    notification: COLORS.secondary,
  },
};
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});
export default AppNavigator;