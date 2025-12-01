// src/routes/AuthNavigator.js
// Authentication flow navigator
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../utils/helpers/navigationHelpers';
import { COLORS } from '../config/theme';
// Auth Screens (to be implemented)
// For now, we'll create placeholder components
import { View, Text, StyleSheet } from 'react-native';
// Placeholder Login Screen
const LoginScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Login Screen</Text>
  </View>
);
// Placeholder Register Screen
const RegisterScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Register Screen</Text>
  </View>
);
// Placeholder Forgot Password Screen
const ForgotPasswordScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Forgot Password Screen</Text>
  </View>
);
const Stack = createNativeStackNavigator();
/**
 * AuthNavigator - Handles authentication flow screens
 * - Login
 * - Register (optional)
 * - Forgot Password
 */
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.LOGIN}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: COLORS.primary,
        },
        // Prevent going back to splash
        gestureEnabled: false,
      }}
    >
      {/* Login Screen */}
      <Stack.Screen
        name={ROUTES.LOGIN}
        component={LoginScreen}
        options={{
          title: 'Masuk',
          // Prevent going back
          headerBackVisible: false,
        }}
      />
      {/* Register Screen (Optional - for future use) */}
      <Stack.Screen
        name={ROUTES.REGISTER}
        component={RegisterScreen}
        options={{
          title: 'Daftar',
          animation: 'slide_from_right',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      {/* Forgot Password Screen */}
      <Stack.Screen
        name={ROUTES.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
        options={{
          title: 'Lupa Password',
          animation: 'slide_from_bottom',
          presentation: 'modal',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerTintColor: COLORS.dark,
        }}
      />
    </Stack.Navigator>
  );
};
/**
 * Auth screen options configuration
 */
export const authScreenOptions = {
  login: {
    title: 'Masuk',
    headerShown: false,
  },
  register: {
    title: 'Daftar',
    headerShown: true,
    headerStyle: {
      backgroundColor: COLORS.primary,
    },
    headerTintColor: COLORS.white,
  },
  forgotPassword: {
    title: 'Lupa Password',
    presentation: 'modal',
    headerShown: true,
  },
};
/**
 * Get auth navigator state
 * Useful for checking current auth screen
 */
export const getAuthNavigatorState = (state) => {
  if (!state || !state.routes) return null;
  
  const authRoute = state.routes.find(r => r.name === 'Auth');
  if (!authRoute || !authRoute.state) return null;
  
  return {
    currentScreen: authRoute.state.routes[authRoute.state.index]?.name,
    canGoBack: authRoute.state.index > 0,
  };
};
const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  placeholderText: {
    fontSize: 18,
    color: COLORS.gray,
  },
});
export default AuthNavigator;
