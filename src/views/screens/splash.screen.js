import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONTS, SIZES } from '../../config/theme'; // Menggunakan konfigurasi tema yang sudah ada

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  useEffect(() => {
    // Timer 3 detik sebelum pindah ke Login
    const timer = setTimeout(() => {
      router.replace('/login'); 
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <View style={styles.contentContainer}>
        {/* 1. Bagian Gambar Ilustrasi */}
        <View style={styles.illustrationSection}>
          <View style={styles.circleBackground} />
          <Image 
            source={require('../../../assets/images/splash-icon.png')} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* 2. Bagian Teks (Judul & Deskripsi) */}
        <View style={styles.textSection}>
          <Text style={styles.title}>
            Pantau Kesehatan,{'\n'}Cegah Anemia
          </Text>
          <Text style={styles.subtitle}>
            Monitor konsumsi vitamin dan kadar hemoglobin Anda secara rutin demi masa depan yang lebih sehat dan cerah.
          </Text>
        </View>

        {/* 3. Bagian Indikator (Pagination Dots) */}
        <View style={styles.footerSection}>
          <View style={styles.paginationDots}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          
          <Text style={styles.versionText}>Modiva v1.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white || '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: SIZES.paddingLarge || 24,
  },
  
  // Styling Bagian Gambar
  illustrationSection: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 40,
  },
  circleBackground: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: COLORS.primaryLight || '#E8F4FD', // Lingkaran dekoratif di belakang logo
    zIndex: -1,
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
  },

  // Styling Bagian Teks
  textSection: {
    flex: 2,
    paddingHorizontal: SIZES.paddingLarge || 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold?.fontFamily || 'System',
    fontWeight: '700',
    color: COLORS.dark || '#1A1A2E',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: FONTS.regular?.fontFamily || 'System',
    color: COLORS.gray || '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  // Styling Bagian Footer & Dots
  footerSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  paginationDots: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border || '#E5E7EB',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24, // Dot aktif lebih panjang
    backgroundColor: COLORS.primary || '#4A90E2',
  },
  versionText: {
    fontSize: 12,
    color: COLORS.lightGray || '#9CA3AF',
    marginTop: 10,
  },
});

export default SplashScreen;