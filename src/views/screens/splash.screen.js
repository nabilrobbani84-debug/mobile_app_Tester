  // app/(auth)/SplashScreen.tsx
  import React, { useEffect } from 'react';
  import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Platform,
  } from 'react-native';
  import { useRouter } from 'expo-router';
  import { LinearGradient } from 'expo-linear-gradient';

  // Import konfigurasi tema
  import { COLORS, FONTS } from '../../config/theme';

  const { width, height } = Dimensions.get('window');

  // Tinggi referensi (iPhone X/11) supaya scaling vertikal konsisten
  const BASE_HEIGHT = 812;
  const vh = (value: number) => (height / BASE_HEIGHT) * value;

  // Ukuran turunan
  const LOGO_SIZE = width * 0.21;              // ukuran icon tetes darah
  const CARD_WIDTH = width - 2 * 18;           // margin kiri‑kanan ≈ 18px
  const CARD_HEIGHT = CARD_WIDTH * 1.06;       // proporsi panel kapsul
  const PROGRESS_WIDTH = width * 0.8;          // lebar progress bar

  const SplashScreen = () => {
    const router = useRouter();

    useEffect(() => {
      const timer = setTimeout(() => {
        router.replace('/login');
      }, 3000);

      return () => clearTimeout(timer);
    }, [router]);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS?.white || '#FFFFFF'}
        />

        <View style={styles.content}>
          {/* ---------- LOGO + NAMA APP ---------- */}
          <View style={styles.header}>
            <Image
              source={require('../../../assets/images/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Modiva</Text>
          </View>

          {/* ---------- PANEL KAPSUL ---------- */}
          <View style={styles.cardWrapper}>
            <LinearGradient
              colors={['#DBDEE4', '#F5F6F8']}  // abu‑abu gradien seperti desain
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.card}
            >
              <Image
                source={require('../../../assets/images/capsul.png')}
                style={styles.capsule}
                resizeMode="contain"
              />
            </LinearGradient>
          </View>

          {/* ---------- TEKS + PROGRESS BAR ---------- */}
          <View style={styles.bottom}>
            <Text style={styles.subtitle}>
              Pantau kesehatan, Rutin Minum Vitamin
            </Text>

            <View style={styles.progressTrack}>
              <LinearGradient
                colors={['#F46AD9', '#B96DF7', '#24C5FF', '#0082C8']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.progressFill}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  // ---------- STYLES ----------
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS?.white || '#FFFFFF',
    },
    content: {
      flex: 1,
      alignItems: 'center',
    },

    /* ===== HEADER (Logo + "Modiva") ===== */
    header: {
      alignItems: 'center',
      marginTop: vh(32), // jarak dari atas ke logo
    },
    logo: {
      width: LOGO_SIZE,
      height: LOGO_SIZE,
      marginBottom: vh(10),
    },
    title: {
      fontSize: 30,
      lineHeight: 34,
      letterSpacing: 0.3,
      color: COLORS?.black || '#111827',
      fontFamily:
        FONTS?.bold?.fontFamily || (Platform.OS === 'ios' ? 'System' : 'sans-serif'),
      fontWeight: '800',
    },

    /* ===== PANEL KAPSUL ===== */
    cardWrapper: {
      marginTop: vh(40), // jarak dari teks "Modiva" ke panel kapsul
    },
    card: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: 0,          // panel kotak seperti di gambar
      alignItems: 'center',
      justifyContent: 'center',
    },
    capsule: {
      width: CARD_WIDTH * 0.7,  // ukuran kapsul di dalam panel
      height: CARD_HEIGHT * 0.8,
    },

    /* ===== BAGIAN BAWAH (Teks + Progress) ===== */
    bottom: {
      marginTop: 'auto',        // dorong ke bawah
      marginBottom: vh(40),
      alignItems: 'center',
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: '#9CA3AF',         // abu‑abu mirip desain
      fontFamily:
        FONTS?.medium?.fontFamily || (Platform.OS === 'ios' ? 'System' : 'sans-serif'),
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: vh(18),
    },

    /* ===== PROGRESS BAR ===== */
    progressTrack: {
      width: PROGRESS_WIDTH,
      height: 10,
      borderRadius: 999,
      backgroundColor: '#E5E7EB', // sedikit abu‑abu di luar gradien
      overflow: 'hidden',
    },
    progressFill: {
      width: '100%',
      height: '100%',
      borderRadius: 999,
    },
  });

  export default SplashScreen;