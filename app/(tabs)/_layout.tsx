import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Menggunakan Ionicons untuk ikon yang konsisten

// Anda bisa sesuaikan warna ini dengan tema aplikasi Anda di constants/theme.ts
const PRIMARY_COLOR = '#0a7ea4'; 
const INACTIVE_COLOR = '#8E8E93';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        headerShown: false, // Menyembunyikan header default
        tabBarShowLabel: true, // Set false jika ingin hanya ikon saja
        tabBarStyle: {
          position: 'absolute', // Membuat efek floating (opsional, hapus baris ini jika ingin nempel bawah)
          bottom: Platform.OS === 'ios' ? 20 : 10,
          left: 20,
          right: 20,
          elevation: 5, // Shadow untuk Android
          backgroundColor: '#ffffff',
          borderRadius: 15, // Sudut melengkung
          height: 60,
          paddingBottom: Platform.OS === 'ios' ? 0 : 10, // Penyesuaian padding
          paddingTop: 10,
          shadowColor: '#000', // Shadow untuk iOS
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          borderTopWidth: 0, // Menghilangkan garis batas atas default
        },
      }}>
      
      {/* Tab Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Tab Laporan */}
      <Tabs.Screen
        name="laporan"
        options={{
          title: 'Laporan',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Tab Notifikasi */}
      <Tabs.Screen
        name="notifikasi"
        options={{
          title: 'Notifikasi',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Tab Profil */}
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}