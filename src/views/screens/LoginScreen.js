// src/views/screens/LoginScreen.js
// Login Screen Component
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../state/AuthContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../config/theme';
const LoginScreen = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [nisn, setNisn] = useState('0110222079');
  const [schoolId, setSchoolId] = useState('SMPN1JKT');
  const [rememberMe, setRememberMe] = useState(true);
  const [nisnFocused, setNisnFocused] = useState(false);
  const [schoolIdFocused, setSchoolIdFocused] = useState(false);
  const handleLogin = async () => {
    // Clear previous error
    if (error) {
      clearError();
    }
    // Validate inputs
    if (!nisn.trim()) {
      Alert.alert('Error', 'Mohon masukkan NISN');
      return;
    }
    if (!schoolId.trim()) {
      Alert.alert('Error', 'Mohon masukkan ID Sekolah');
      return;
    }
    // Attempt login
    const result = await login(nisn.trim(), schoolId.trim());
    if (!result.success) {
      Alert.alert('Login Gagal', result.error || 'Terjadi kesalahan');
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Decorative circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
          
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.bloodDrop}>
              <View style={styles.bloodDropTop} />
              <View style={styles.bloodDropBottom}>
                <View style={styles.vitaminCapsule}>
                  <View style={styles.capsuleLeft} />
                  <View style={styles.capsuleRight} />
                </View>
              </View>
            </View>
          </View>
          
          <Text style={styles.appName}>Modiva</Text>
          <Text style={styles.tagline}>Monitoring Distribusi Vitamin</Text>
        </View>
        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.title}>Masuk ke Akun</Text>
          <Text style={styles.subtitle}>
            Masukkan NISN dan ID Sekolah untuk melanjutkan
          </Text>
          {/* NISN Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              NISN <Text style={styles.required}>*</Text>
            </Text>
            <View style={[
              styles.inputContainer,
              nisnFocused && styles.inputFocused,
            ]}>
              <Ionicons 
                name="card-outline" 
                size={20} 
                color={nisnFocused ? COLORS.primary : COLORS.gray} 
              />
              <TextInput
                style={styles.input}
                placeholder="Masukkan NISN"
                placeholderTextColor={COLORS.gray}
                value={nisn}
                onChangeText={setNisn}
                keyboardType="number-pad"
                maxLength={10}
                onFocus={() => setNisnFocused(true)}
                onBlur={() => setNisnFocused(false)}
              />
            </View>
            <Text style={styles.helpText}>NISN terdiri dari 10 digit angka</Text>
          </View>
          {/* School ID Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              ID Sekolah <Text style={styles.required}>*</Text>
            </Text>
            <View style={[
              styles.inputContainer,
              schoolIdFocused && styles.inputFocused,
            ]}>
              <Ionicons 
                name="school-outline" 
                size={20} 
                color={schoolIdFocused ? COLORS.primary : COLORS.gray} 
              />
              <TextInput
                style={styles.input}
                placeholder="Masukkan ID Sekolah"
                placeholderTextColor={COLORS.gray}
                value={schoolId}
                onChangeText={setSchoolId}
                autoCapitalize="characters"
                onFocus={() => setSchoolIdFocused(true)}
                onBlur={() => setSchoolIdFocused(false)}
              />
            </View>
          </View>
          {/* Remember Me */}
          <TouchableOpacity
            style={styles.rememberContainer}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox,
              rememberMe && styles.checkboxChecked,
            ]}>
              {rememberMe && (
                <Ionicons name="checkmark" size={14} color={COLORS.white} />
              )}
            </View>
            <Text style={styles.rememberText}>Ingat saya</Text>
          </TouchableOpacity>
          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.loginButtonText}>Masuk</Text>
            )}
          </TouchableOpacity>
          {/* Help Link */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpLinkText}>Butuh bantuan? </Text>
            <TouchableOpacity>
              <Text style={styles.helpLink}>Hubungi Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: 20,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoContainer: {
    marginBottom: SIZES.medium,
  },
  bloodDrop: {
    alignItems: 'center',
  },
  bloodDropTop: {
    width: 0,
    height: 0,
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.secondary,
  },
  bloodDropBottom: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.secondary,
    marginTop: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vitaminCapsule: {
    flexDirection: 'row',
    width: 28,
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
  },
  capsuleLeft: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  capsuleRight: {
    flex: 1,
    backgroundColor: '#FFD700',
  },
  appName: {
    ...FONTS.bold,
    fontSize: 28,
    color: COLORS.white,
    letterSpacing: 2,
  },
  tagline: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  formCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: SIZES.screenPadding,
    paddingTop: 30,
    paddingBottom: 40,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.dark,
    marginBottom: SIZES.small,
  },
  subtitle: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginBottom: SIZES.extraLarge,
  },
  inputGroup: {
    marginBottom: SIZES.medium,
  },
  label: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.dark,
    marginBottom: SIZES.small,
  },
  required: {
    color: COLORS.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.medium,
    height: SIZES.inputHeight,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    ...SHADOWS.small,
  },
  input: {
    flex: 1,
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.dark,
    marginLeft: SIZES.small,
  },
  helpText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 4,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.large,
    marginTop: SIZES.small,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.small,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  rememberText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    height: SIZES.buttonHeight,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.extraLarge,
  },
  helpLinkText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  helpLink: {
    ...FONTS.semiBold,
    fontSize: SIZES.font,
    color: COLORS.primary,
  },
});
export default LoginScreen;