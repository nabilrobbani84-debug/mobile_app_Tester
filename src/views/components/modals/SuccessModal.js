// src/views/components/modals/SuccessModal.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../../config/theme';
const { width } = Dimensions.get('window');
const SuccessModal = ({
  visible,
  onClose,
  title = 'Berhasil!',
  message = 'Operasi berhasil dilakukan.',
  buttonText = 'OK',
  onButtonPress,
  autoClose = false,
  autoCloseDelay = 3000,
  icon = 'checkmark-circle',
  iconColor = COLORS.success,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      // Animate modal appearance
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      // Animate checkmark
      Animated.timing(checkAnim, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }).start();
      // Auto close if enabled
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      checkAnim.setValue(0);
    }
  }, [visible]);
  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose && onClose();
    });
  };
  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    } else {
      handleClose();
    }
  };
  const checkScale = checkAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.2, 1],
  });
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View 
        style={[
          styles.overlay,
          { opacity: opacityAnim }
        ]}
      >
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          {/* Success Icon with Animation */}
          <View style={styles.iconWrapper}>
            <View style={[styles.iconCircle, { backgroundColor: iconColor + '20' }]}>
              <Animated.View style={{ transform: [{ scale: checkScale }] }}>
                <Ionicons name={icon} size={64} color={iconColor} />
              </Animated.View>
            </View>
          </View>
          {/* Title */}
          <Text style={styles.title}>{title}</Text>
          {/* Message */}
          <Text style={styles.message}>{message}</Text>
          {/* Decorative Elements */}
          <View style={styles.decorativeContainer}>
            {[...Array(6)].map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.confetti,
                  {
                    left: `${15 + index * 14}%`,
                    backgroundColor: index % 2 === 0 ? COLORS.primary : iconColor,
                    transform: [
                      { 
                        translateY: checkAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -10 - index * 5],
                        })
                      },
                      {
                        rotate: checkAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', `${(index - 2.5) * 15}deg`],
                        })
                      },
                    ],
                    opacity: checkAnim,
                  }
                ]}
              />
            ))}
          </View>
          {/* Action Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleButtonPress}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
// Specialized Success Modals
export const ReportSuccessModal = ({ visible, onClose, onViewReport }) => (
  <SuccessModal
    visible={visible}
    onClose={onClose}
    title="Laporan Berhasil Dikirim!"
    message="Terima kasih telah melaporkan konsumsi vitamin Anda hari ini. Tetap jaga kesehatan!"
    buttonText="Lihat Laporan"
    onButtonPress={onViewReport || onClose}
    icon="document-text"
    iconColor={COLORS.primary}
  />
);
export const LoginSuccessModal = ({ visible, onClose, userName }) => (
  <SuccessModal
    visible={visible}
    onClose={onClose}
    title={`Selamat Datang, ${userName || 'Siswa'}!`}
    message="Login berhasil. Mari pantau kesehatan Anda bersama Modiva."
    buttonText="Mulai"
    autoClose
    autoCloseDelay={2000}
    icon="person-circle"
    iconColor={COLORS.primary}
  />
);
export const ProfileUpdateSuccessModal = ({ visible, onClose }) => (
  <SuccessModal
    visible={visible}
    onClose={onClose}
    title="Profil Diperbarui!"
    message="Data profil Anda telah berhasil diperbarui."
    buttonText="OK"
    icon="person-circle"
    iconColor={COLORS.success}
  />
);
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.extraLarge,
    width: width - SIZES.extraLarge * 2,
    maxWidth: 340,
    alignItems: 'center',
    ...SHADOWS.large,
  },
  iconWrapper: {
    marginBottom: SIZES.large,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: SIZES.small,
  },
  message: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SIZES.large,
  },
  decorativeContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 40,
    flexDirection: 'row',
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.extraLarge * 2,
    borderRadius: SIZES.radius,
    width: '100%',
    ...SHADOWS.small,
  },
  buttonText: {
    ...FONTS.bold,
    fontSize: SIZES.font,
    color: COLORS.white,
    textAlign: 'center',
  },
});
export default SuccessModal;