import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
// Path import benar: naik 1 level dari 'app/' ke root
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
    if (!isLoading && splashAnimationFinished) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, splashAnimationFinished, isAuthenticated, router]);

  return <SplashScreen />;
}