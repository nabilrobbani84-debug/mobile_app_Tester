// src/views/components/modals/LoadingModal.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../../config/theme';
const { width } = Dimensions.get('window');
const LoadingModal = ({
  visible,
  message = 'Memuat...',
  type = 'spinner', // 'spinner', 'dots', 'progress', 'vitamin'
  progress = 0, // For progress type (0-100)
  transparent = false,
}) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;
  const vitaminAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      // Spinner animation
      if (type === 'spinner') {
        Animated.loop(
          Animated.timing(spinAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();
      }
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
      // Dots animation
      if (type === 'dots') {
        const dotAnimation = (anim, delay) => {
          return Animated.loop(
            Animated.sequence([
              Animated.delay(delay),
              Animated.timing(anim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(anim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
            ])
          );
        };
        
        Animated.parallel([
          dotAnimation(dot1Anim, 0),
          dotAnimation(dot2Anim, 150),
          dotAnimation(dot3Anim, 300),
        ]).start();
      }
      // Vitamin animation
      if (type === 'vitamin') {
        Animated.loop(
          Animated.sequence([
            Animated.timing(vitaminAnim, {
              toValue: 1,
              duration: 600,
              easing: Easing.bounce,
              useNativeDriver: true,
            }),
            Animated.timing(vitaminAnim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    }
    return () => {
      spinAnim.setValue(0);
      pulseAnim.setValue(1);
      dot1Anim.setValue(0);
      dot2Anim.setValue(0);
      dot3Anim.setValue(0);
      vitaminAnim.setValue(0);
    };
  }, [visible, type]);
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const renderLoadingIndicator = () => {
    switch (type) {
      case 'spinner':
        return (
          <View style={styles.spinnerContainer}>
            <Animated.View 
              style={[
                styles.spinner,
                { transform: [{ rotate: spin }] }
              ]}
            >
              <View style={styles.spinnerOuter}>
                <View style={styles.spinnerInner} />
              </View>
            </Animated.View>
          </View>
        );
      case 'dots':
        return (
          <View style={styles.dotsContainer}>
            {[dot1Anim, dot2Anim, dot3Anim].map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    transform: [
                      {
                        translateY: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -12],
                        }),
                      },
                    ],
                    opacity: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 1],
                    }),
                  },
                ]}
              />
            ))}
          </View>
        );
      case 'progress':
        return (
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  { width: `${progress}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        );
      case 'vitamin':
        return (
          <View style={styles.vitaminContainer}>
            <Animated.View
              style={[
                styles.vitaminPill,
                {
                  transform: [
                    {
                      translateY: vitaminAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, -20, 0],
                      }),
                    },
                    {
                      rotate: vitaminAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: ['0deg', '15deg', '0deg'],
                      }),
                    },
                    { scale: pulseAnim },
                  ],
                },
              ]}
            >
              <View style={styles.vitaminLeft} />
              <View style={styles.vitaminRight} />
            </Animated.View>
            <View style={styles.vitaminShadow} />
          </View>
        );
      default:
        return (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Ionicons name="refresh" size={48} color={COLORS.primary} />
          </Animated.View>
        );
    }
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={[
        styles.overlay,
        transparent && styles.overlayTransparent
      ]}>
        <View style={[
          styles.container,
          transparent && styles.containerTransparent
        ]}>
          {renderLoadingIndicator()}
          
          {message && (
            <Text style={styles.message}>{message}</Text>
          )}
          {/* Animated dots after message */}
          {type !== 'dots' && (
            <View style={styles.messageDots}>
              {[dot1Anim, dot2Anim, dot3Anim].map((anim, index) => (
                <Animated.Text
                  key={index}
                  style={[
                    styles.messageDot,
                    {
                      opacity: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1],
                      }),
                    },
                  ]}
                >
                  .
                </Animated.Text>
              ))}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
// Specialized Loading Modals
export const SubmittingReportModal = ({ visible }) => (
  <LoadingModal
    visible={visible}
    message="Mengirim laporan"
    type="vitamin"
  />
);
export const LoginLoadingModal = ({ visible }) => (
  <LoadingModal
    visible={visible}
    message="Masuk ke akun"
    type="spinner"
  />
);
export const UploadingImageModal = ({ visible, progress = 0 }) => (
  <LoadingModal
    visible={visible}
    message="Mengunggah gambar"
    type="progress"
    progress={progress}
  />
);
export const FetchingDataModal = ({ visible }) => (
  <LoadingModal
    visible={visible}
    message="Mengambil data"
    type="dots"
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
  overlayTransparent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.extraLarge,
    minWidth: 200,
    alignItems: 'center',
    ...SHADOWS.large,
  },
  containerTransparent: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    elevation: 0,
  },
  spinnerContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  spinner: {
    width: 48,
    height: 48,
  },
  spinnerOuter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: COLORS.primaryLight,
    borderTopColor: COLORS.primary,
  },
  spinnerInner: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: COLORS.secondary,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SIZES.small,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    ...FONTS.semiBold,
    fontSize: SIZES.font,
    color: COLORS.primary,
  },
  vitaminContainer: {
    alignItems: 'center',
    marginBottom: SIZES.medium,
    height: 80,
    justifyContent: 'center',
  },
  vitaminPill: {
    flexDirection: 'row',
    width: 60,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  vitaminLeft: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  vitaminRight: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  vitaminShadow: {
    width: 40,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    marginTop: SIZES.small,
  },
  message: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.dark,
    textAlign: 'center',
  },
  messageDots: {
    flexDirection: 'row',
    marginTop: 4,
  },
  messageDot: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
});
export default LoadingModal;
