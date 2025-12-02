// src/views/screens/SplashScreen.js
// Splash Screen Component
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../../config/theme';
const { width, height } = Dimensions.get('window');
const SplashScreen = ({ onAnimationComplete }) => {
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
  }, [fadeAnim, scaleAnim, textFadeAnim, pulseAnim]);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Background Gradient Effect */}
      <View style={styles.background}>
        <View style={styles.gradient1} />
        <View style={styles.gradient2} />
      </View>
      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
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
        <View style={styles.bloodDrop}>
          <View style={styles.bloodDropTop} />
          <View style={styles.bloodDropBottom}>
            <View style={styles.vitaminCapsule}>
              <View style={styles.capsuleLeft} />
              <View style={styles.capsuleRight} />
            </View>
          </View>
        </View>
      </Animated.View>
      {/* App Name */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.appName}>Modiva</Text>
      </Animated.View>
      {/* Tagline */}
      <Animated.View 
        style={[
          styles.messageContainer,
          { opacity: textFadeAnim }
        ]}
      >
        <Text style={styles.tagline}>Monitoring Distribusi Vitamin</Text>
        <Text style={styles.message}>Pantau kesehatan, Rutin Minum Vitamin</Text>
      </Animated.View>
      {/* Loading Indicator */}
      <Animated.View 
        style={[styles.loadingDots, { opacity: textFadeAnim }]}
      >
        <LoadingDot delay={0} />
        <LoadingDot delay={200} />
        <LoadingDot delay={400} />
      </Animated.View>
      {/* Version */}
      <Animated.Text 
        style={[styles.version, { opacity: textFadeAnim }]}
      >
        v1.0.0
      </Animated.Text>
    </View>
  );
};
// Loading Dot Component
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
  }, [delay, opacity]);
  return <Animated.View style={[styles.dot, { opacity }]} />;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  gradient2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoContainer: {
    marginBottom: SIZES.large,
  },
  bloodDrop: {
    alignItems: 'center',
  },
  bloodDropTop: {
    width: 0,
    height: 0,
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderBottomWidth: 60,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.secondary,
  },
  bloodDropBottom: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.secondary,
    marginTop: -15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  vitaminCapsule: {
    flexDirection: 'row',
    width: 40,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
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
    fontSize: 42,
    color: COLORS.white,
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  messageContainer: {
    marginTop: SIZES.large,
    alignItems: 'center',
    paddingHorizontal: SIZES.extraLarge,
  },
  tagline: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
  },
  message: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: SIZES.medium,
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: SIZES.extraLarge * 2,
    gap: SIZES.small,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
  },
  version: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute',
    bottom: 30,
  },
});
export default SplashScreen;