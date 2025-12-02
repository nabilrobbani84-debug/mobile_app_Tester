// src/views/components/modals/ConfirmationModal.js
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

// --- THEME DEFINITIONS (Local Fix) ---
// Mendefinisikan tema secara lokal karena modul config/theme hilang atau tidak kompatibel
const COLORS = {
  primary: '#3b82f6',   // Blue
  secondary: '#ef4444', // Red
  white: '#ffffff',
  dark: '#111827',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  border: '#e5e7eb',
};

const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 20,
  extraLarge: 24,
  radius: 8,
};

const FONTS = {
  bold: { fontWeight: '700' },
  semiBold: { fontWeight: '600' },
  medium: { fontWeight: '500' },
  regular: { fontWeight: '400' },
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
};
// -------------------------------------

const { width } = Dimensions.get('window');

const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  onCancel,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin ingin melanjutkan?',
  confirmText = 'Ya',
  cancelText = 'Batal',
  confirmColor = COLORS.primary,
  icon = 'help-circle',
  iconColor = COLORS.primary,
  type = 'default', // 'default', 'danger', 'warning', 'info'
  loading = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Type-based configurations
  const typeConfig = {
    default: {
      icon: 'help-circle',
      iconColor: COLORS.primary,
      confirmColor: COLORS.primary,
    },
    danger: {
      icon: 'warning',
      iconColor: COLORS.secondary,
      confirmColor: COLORS.secondary,
    },
    warning: {
      icon: 'alert-circle',
      iconColor: '#FFA500',
      confirmColor: '#FFA500',
    },
    info: {
      icon: 'information-circle',
      iconColor: COLORS.primary,
      confirmColor: COLORS.primary,
    },
  };

  const config = typeConfig[type] || typeConfig.default;
  const finalIcon = icon || config.icon;
  const finalIconColor = iconColor || config.iconColor;
  const finalConfirmColor = confirmColor || config.confirmColor;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Shake animation for warning/danger
      if (type === 'danger' || type === 'warning') {
        Animated.sequence([
          Animated.delay(300),
          Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
      }
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      shakeAnim.setValue(0);
    }
  }, [visible, type]);

  const handleClose = (callback) => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback && callback();
      onClose && onClose();
    });
  };

  const handleConfirm = () => {
    if (!loading) {
      handleClose(onConfirm);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      handleClose(onCancel);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => handleClose()}
    >
      <Animated.View 
        style={[
          styles.overlay,
          { opacity: opacityAnim }
        ]}
      >
        <TouchableOpacity 
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={() => !loading && handleClose()}
        >
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  { translateX: shakeAnim },
                ],
              }
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              {/* Icon */}
              <View style={styles.iconWrapper}>
                <View style={[
                  styles.iconCircle, 
                  { backgroundColor: finalIconColor + '15' }
                ]}>
                  <Ionicons 
                    name={finalIcon} 
                    size={48} 
                    color={finalIconColor} 
                  />
                </View>
              </View>

              {/* Title */}
              <Text style={styles.title}>{title}</Text>

              {/* Message */}
              <Text style={styles.message}>{message}</Text>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button, 
                    styles.confirmButton,
                    { backgroundColor: finalConfirmColor },
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={handleConfirm}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <Text style={styles.confirmButtonText}>Loading...</Text>
                    </View>
                  ) : (
                    <Text style={styles.confirmButtonText}>{confirmText}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

// Specialized Confirmation Modals
export const LogoutConfirmModal = ({ visible, onClose, onConfirm }) => (
  <ConfirmationModal
    visible={visible}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Keluar dari Akun?"
    message="Anda akan keluar dari akun Modiva. Pastikan data Anda sudah tersimpan."
    confirmText="Keluar"
    cancelText="Batal"
    type="warning"
    icon="log-out"
  />
);

export const DeleteReportConfirmModal = ({ visible, onClose, onConfirm }) => (
  <ConfirmationModal
    visible={visible}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Hapus Laporan?"
    message="Laporan yang sudah dihapus tidak dapat dikembalikan. Apakah Anda yakin?"
    confirmText="Hapus"
    cancelText="Batal"
    type="danger"
    icon="trash"
  />
);

export const SubmitReportConfirmModal = ({ visible, onClose, onConfirm, loading }) => (
  <ConfirmationModal
    visible={visible}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Kirim Laporan?"
    message="Pastikan data yang Anda masukkan sudah benar sebelum mengirim laporan."
    confirmText="Kirim"
    cancelText="Periksa Lagi"
    type="info"
    icon="paper-plane"
    loading={loading}
  />
);

export const DiscardChangesConfirmModal = ({ visible, onClose, onConfirm }) => (
  <ConfirmationModal
    visible={visible}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Buang Perubahan?"
    message="Perubahan yang belum disimpan akan hilang. Lanjutkan?"
    confirmText="Ya, Buang"
    cancelText="Tetap Edit"
    type="warning"
    icon="close-circle"
  />
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    flex: 1,
    width: '100%',
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
    ...SHADOWS.large,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.large,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: SIZES.medium,
  },
  button: {
    flex: 1,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.font,
    color: COLORS.dark,
  },
  confirmButton: {
    ...SHADOWS.small,
  },
  confirmButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.font,
    color: COLORS.white,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small,
  },
});

export default ConfirmationModal;