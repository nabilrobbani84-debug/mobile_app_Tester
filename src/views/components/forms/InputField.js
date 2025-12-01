// src/views/components/forms/InputField.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../../config/theme';
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required = false,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  maxLength,
  multiline = false,
  numberOfLines = 1,
  leftIcon,
  rightIcon,
  onRightIconPress,
  helpText,
  showCharacterCount = false,
  onFocus,
  onBlur,
  style,
  inputStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const animatedBorder = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);
  const handleFocus = (e) => {
    setIsFocused(true);
    Animated.timing(animatedBorder, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus && onFocus(e);
  };
  const handleBlur = (e) => {
    setIsFocused(false);
    Animated.timing(animatedBorder, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur && onBlur(e);
  };
  const borderColor = animatedBorder.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? COLORS.secondary : COLORS.border, COLORS.primary],
  });
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const focusInput = () => {
    inputRef.current?.focus();
  };
  const isPasswordField = secureTextEntry;
  const actualSecureEntry = isPasswordField && !showPassword;
  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, error && styles.labelError]}>
            {label}
          </Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}
      {/* Input Container */}
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={focusInput}
        disabled={disabled}
      >
        <Animated.View
          style={[
            styles.inputContainer,
            multiline && styles.multilineContainer,
            error && styles.inputContainerError,
            disabled && styles.inputContainerDisabled,
            isFocused && styles.inputContainerFocused,
            { borderColor: error ? COLORS.secondary : (isFocused ? COLORS.primary : COLORS.border) },
          ]}
        >
          {/* Left Icon */}
          {leftIcon && (
            <View style={styles.leftIconContainer}>
              <Ionicons 
                name={leftIcon} 
                size={20} 
                color={isFocused ? COLORS.primary : COLORS.gray} 
              />
            </View>
          )}
          {/* Text Input */}
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              leftIcon && styles.inputWithLeftIcon,
              (rightIcon || isPasswordField) && styles.inputWithRightIcon,
              multiline && styles.multilineInput,
              disabled && styles.inputDisabled,
              inputStyle,
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={COLORS.gray}
            editable={!disabled}
            secureTextEntry={actualSecureEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            maxLength={maxLength}
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines : 1}
            textAlignVertical={multiline ? 'top' : 'center'}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {/* Right Icon / Password Toggle */}
          {(rightIcon || isPasswordField) && (
            <TouchableOpacity
              style={styles.rightIconContainer}
              onPress={isPasswordField ? togglePasswordVisibility : onRightIconPress}
              disabled={!isPasswordField && !onRightIconPress}
            >
              <Ionicons
                name={
                  isPasswordField
                    ? showPassword ? 'eye-off-outline' : 'eye-outline'
                    : rightIcon
                }
                size={20}
                color={isFocused ? COLORS.primary : COLORS.gray}
              />
            </TouchableOpacity>
          )}
        </Animated.View>
      </TouchableOpacity>
      {/* Bottom Row: Error, Help Text, Character Count */}
      <View style={styles.bottomRow}>
        <View style={styles.messageContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={14} color={COLORS.secondary} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : helpText ? (
            <Text style={styles.helpText}>{helpText}</Text>
          ) : null}
        </View>
        {showCharacterCount && maxLength && (
          <Text style={[
            styles.characterCount,
            value?.length >= maxLength && styles.characterCountMax
          ]}>
            {value?.length || 0}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};
// Specialized Input Components
export const NISNInput = (props) => (
  <InputField
    label="NISN"
    placeholder="Masukkan NISN"
    keyboardType="number-pad"
    maxLength={10}
    leftIcon="card-outline"
    helpText="NISN terdiri dari 10 digit angka"
    {...props}
  />
);
export const SchoolIDInput = (props) => (
  <InputField
    label="ID Sekolah"
    placeholder="Masukkan ID Sekolah"
    keyboardType="default"
    leftIcon="school-outline"
    autoCapitalize="characters"
    {...props}
  />
);
export const PasswordInput = (props) => (
  <InputField
    label="Password"
    placeholder="Masukkan password"
    secureTextEntry
    leftIcon="lock-closed-outline"
    {...props}
  />
);
export const EmailInput = (props) => (
  <InputField
    label="Email"
    placeholder="Masukkan email"
    keyboardType="email-address"
    leftIcon="mail-outline"
    autoCapitalize="none"
    {...props}
  />
);
export const SearchInput = ({ onSearch, ...props }) => (
  <InputField
    placeholder="Cari..."
    leftIcon="search-outline"
    rightIcon="options-outline"
    onRightIconPress={onSearch}
    {...props}
  />
);
export const TextAreaInput = (props) => (
  <InputField
    multiline
    numberOfLines={4}
    showCharacterCount
    {...props}
  />
);
const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.medium,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.small,
  },
  label: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.dark,
  },
  labelError: {
    color: COLORS.secondary,
  },
  required: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.secondary,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    minHeight: 52,
    paddingHorizontal: SIZES.medium,
  },
  multilineContainer: {
    alignItems: 'flex-start',
    minHeight: 100,
    paddingVertical: SIZES.small,
  },
  inputContainerError: {
    borderColor: COLORS.secondary,
    backgroundColor: '#FFF5F5',
  },
  inputContainerDisabled: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.7,
  },
  inputContainerFocused: {
    ...SHADOWS.small,
    borderWidth: 2,
  },
  leftIconContainer: {
    marginRight: SIZES.small,
  },
  rightIconContainer: {
    marginLeft: SIZES.small,
    padding: 4,
  },
  input: {
    flex: 1,
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.dark,
    paddingVertical: 0,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  multilineInput: {
    paddingTop: SIZES.small,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  inputDisabled: {
    color: COLORS.gray,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
    minHeight: 18,
  },
  messageContainer: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  errorText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.secondary,
  },
  helpText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  characterCount: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginLeft: SIZES.small,
  },
  characterCountMax: {
    color: COLORS.secondary,
  },
});
export default InputField;
