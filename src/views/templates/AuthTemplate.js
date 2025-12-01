// src/views/templates/AuthTemplate.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../config/theme';
const { width, height } = Dimensions.get('window');
/**
 * AuthTemplate - Layout template for authentication screens (Login, Register, etc.)
 * Features branded header with logo and decorative elements
 */
const AuthTemplate = ({
  children,
  // Branding Props
  showLogo = true,
  logoSize = 80,
  title,
  subtitle,
  // Header Props
  showBackButton = false,
  onBackPress,
  // Layout Props
  headerHeight = 0.35, // Percentage of screen height
  contentPadding = SIZES.large,
  // Animation Props
  animated = true,
  // Footer Props
  footer,
  footerText,
  footerLinkText,
  onFooterLinkPress,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.5)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (animated) {
      Animated.parallel([
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        // Slide up
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        // Logo scale
        Animated.spring(logoScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
      // Subtle logo animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoRotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(logoRotateAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      logoScaleAnim.setValue(1);
    }
  }, [animated]);
  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg'],
  });
  const renderHeader = () => (
    <View style={[styles.headerContainer, { height: height * headerHeight }]}>
      {/* Background Decorations */}
      <View style={styles.decorationContainer}>
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />
        <View style={[styles.decorCircle, styles.decorCircle3]} />
      </View>
      {/* Back Button */}
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <View style={styles.backButtonInner}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </View>
        </TouchableOpacity>
      )}
      {/* Logo and Branding */}
      <Animated.View 
        style={[
          styles.brandingContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: logoScaleAnim },
              { rotate: logoRotation },
            ],
          }
        ]}
      >
        {showLogo && (
          <View style={styles.logoContainer}>
            {/* Blood Drop Logo */}
            <View style={[styles.bloodDrop, { width: logoSize, height: logoSize * 1.3 }]}>
              <View style={styles.bloodDropTop} />
              <View style={styles.bloodDropBottom}>
                {/* Vitamin Capsule inside */}
                <View style={styles.vitaminCapsule}>
                  <View style={styles.capsuleLeft} />
                  <View style={styles.capsuleRight} />
                </View>
              </View>
            </View>
          </View>
        )}
        {/* App Name */}
        <Text style={styles.appName}>Modiva</Text>
        <Text style={styles.appTagline}>Monitoring Distribusi Vitamin</Text>
      </Animated.View>
    </View>
  );
  const renderContent = () => (
    <Animated.View 
      style={[
        styles.contentContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          padding: contentPadding,
        }
      ]}
    >
      {/* Title and Subtitle */}
      {(title || subtitle) && (
        <View style={styles.titleContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      {/* Form Content */}
      {children}
    </Animated.View>
  );
  const renderFooter = () => {
    if (!footer && !footerText) return null;
    return (
      <View style={styles.footerContainer}>
        {footer || (
          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>{footerText}</Text>
            {footerLinkText && (
              <TouchableOpacity onPress={onFooterLinkPress}>
                <Text style={styles.footerLink}>{footerLinkText}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={COLORS.primary} 
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {renderHeader()}
          
          <View style={styles.formCard}>
            {renderContent()}
            {renderFooter()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
/**
 * SplashTemplate - Template for splash/loading screen
 */
export const SplashTemplate = ({
  message = 'Pantau kesehatan, Rutin Minum Vitamin',
  version,
  onAnimationComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    // Initial animation sequence
    Animated.sequence([
      // Logo appears
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Text appears
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
    // Continuous pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    // Callback after animation
    if (onAnimationComplete) {
      const timer = setTimeout(onAnimationComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <View style={styles.splashContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Background Gradient Effect */}
      <View style={styles.splashBackground}>
        <View style={styles.splashGradient1} />
        <View style={styles.splashGradient2} />
      </View>
      {/* Logo */}
      <Animated.View
        style={[
          styles.splashLogoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        {/* Blood Drop with Vitamin */}
        <View style={styles.splashBloodDrop}>
          <View style={styles.splashBloodDropTop} />
          <View style={styles.splashBloodDropBottom}>
            <View style={styles.splashVitaminCapsule}>
              <View style={styles.splashCapsuleLeft} />
              <View style={styles.splashCapsuleRight} />
            </View>
          </View>
        </View>
      </Animated.View>
      {/* App Name */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.splashAppName}>Modiva</Text>
      </Animated.View>
      {/* Message */}
      <Animated.View 
        style={[
          styles.splashMessageContainer,
          { opacity: textFadeAnim }
        ]}
      >
        <Text style={styles.splashMessage}>{message}</Text>
      </Animated.View>
      {/* Version */}
      {version && (
        <Animated.Text 
          style={[styles.splashVersion, { opacity: textFadeAnim }]}
        >
          v{version}
        </Animated.Text>
      )}
      {/* Loading Indicator */}
      <Animated.View 
        style={[styles.loadingDots, { opacity: textFadeAnim }]}
      >
        {[0, 1, 2].map((index) => (
          <LoadingDot key={index} delay={index * 200} />
        ))}
      </Animated.View>
    </View>
  );
};
// Loading Dot Component for Splash
const LoadingDot = ({ delay }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[styles.loadingDot, { opacity }]} />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  // Header Styles
  headerContainer: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  decorationContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorCircle1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  decorCircle2: {
    width: 150,
    height: 150,
    bottom: 20,
    left: -30,
  },
  decorCircle3: {
    width: 100,
    height: 100,
    top: 40,
    left: 50,
  },
  backButton: {
    position: 'absolute',
    top: SIZES.large,
    left: SIZES.medium,
    zIndex: 10,
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandingContainer: {
    alignItems: 'center',
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
    fontSize: 32,
    color: COLORS.white,
    letterSpacing: 2,
  },
  appTagline: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  // Content Styles
  formCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius * 3,
    borderTopRightRadius: SIZES.radius * 3,
    marginTop: -SIZES.large,
    minHeight: height * 0.65,
  },
  contentContainer: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: SIZES.extraLarge,
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
    lineHeight: 22,
  },
  // Footer Styles
  footerContainer: {
    paddingVertical: SIZES.large,
    alignItems: 'center',
  },
  footerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  footerLink: {
    ...FONTS.semiBold,
    fontSize: SIZES.font,
    color: COLORS.primary,
    marginLeft: 4,
  },
  // Splash Screen Styles
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  splashGradient1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  splashGradient2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  splashLogoContainer: {
    marginBottom: SIZES.large,
  },
  splashBloodDrop: {
    alignItems: 'center',
  },
  splashBloodDropTop: {
    width: 0,
    height: 0,
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderBottomWidth: 60,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.secondary,
  },
  splashBloodDropBottom: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.secondary,
    marginTop: -15,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  splashVitaminCapsule: {
    flexDirection: 'row',
    width: 40,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  splashCapsuleLeft: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  splashCapsuleRight: {
    flex: 1,
    backgroundColor: '#FFD700',
  },
  splashAppName: {
    ...FONTS.bold,
    fontSize: 42,
    color: COLORS.white,
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  splashMessageContainer: {
    marginTop: SIZES.extraLarge,
    paddingHorizontal: SIZES.extraLarge,
  },
  splashMessage: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  splashVersion: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute',
    bottom: 30,
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: SIZES.extraLarge * 2,
    gap: SIZES.small,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
  },
});
export default AuthTemplate;
