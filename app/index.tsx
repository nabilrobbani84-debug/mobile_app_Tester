import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
// Pastikan path import ini benar (naik 1 level dari app/ ke src/)
import { useAuth } from '../src/state/AuthContext';
import SplashScreen from '../src/views/screens/splash.screen';

export default function Index() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    // Timer 3 detik untuk durasi splash screen
    const timer = setTimeout(() => {
      setSplashAnimationFinished(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Jalankan navigasi HANYA JIKA:
    // 1. Proses cek login selesai (!isLoading)
    // 2. Animasi splash sudah minimal 3 detik (splashAnimationFinished)
    if (!isLoading && splashAnimationFinished) {
      if (isAuthenticated) {
        // Jika sudah login, masuk ke area Tabs/Home
        router.replace('/(tabs)');
      } else {
        // Jika belum login, masuk ke halaman Login
        router.replace('/login');
      }
    }
  }, [isLoading, splashAnimationFinished, isAuthenticated, router]);

  // PERBAIKAN DI SINI:
  // Menambahkan prop 'onAnimationComplete' dengan fungsi kosong agar tidak error
  return <SplashScreen onAnimationComplete={() => {}} />;
}