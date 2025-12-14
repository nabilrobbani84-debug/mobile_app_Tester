import React from 'react';
import { Stack } from 'expo-router';
// @ts-ignore: Mengabaikan check tipe untuk file JS legacy
import LoginScreen from '../src/views/screens/LoginScreen'; 

export default function LoginRoute() {
  return (
    <>
      {/* Mengonfigurasi opsi layar khusus untuk login: sembunyikan header bawaan */}
      <Stack.Screen options={{ headerShown: false }} />
      
      <LoginScreen />
    </>
  );
}