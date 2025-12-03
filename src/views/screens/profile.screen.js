import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Alert,
  ActivityIndicator,
  Platform,
  Image
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Import Controller & Utils
import ProfileController from '../../controllers/profile.controller';
import AuthController from '../../controllers/auth.controller'; // Pastikan export default ada
import Logger from '../../utils/logger';

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // State untuk data tampilan
  const [stats, setStats] = useState({
    name: '',
    email: '',
    school: '',
    nisn: '',
    height: 0,
    weight: 0,
    currentHB: 0,
    consumptionCount: 0,
    consumptionTarget: 48,
    initial: 'U'
  });

  // Fungsi memuat data profil
  const loadProfileData = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    
    try {
      // 1. Panggil Controller untuk fetch data terbaru
      await ProfileController.loadProfile();
      
      // 2. Ambil data terformat dari controller
      const data = ProfileController.getUserStatistics();
      setStats(data);
      
    } catch (error) {
      Logger.error('❌ UI Error loading profile:', error);
      // Alert hanya muncul jika bukan refresh background
      if (!isRefresh) Alert.alert('Gagal', 'Tidak dapat memuat data profil.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Dipanggil saat layar fokus (dibuka)
  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadProfileData(true);
  };

  const handleLogout = () => {
    Alert.alert(
      'Keluar Aplikasi',
      'Apakah Anda yakin ingin keluar dari akun ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Keluar', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await AuthController.logout();
              router.replace('/login');
            } catch (error) {
              Logger.error('Logout failed', error);
              Alert.alert('Error', 'Gagal logout. Silakan coba lagi.');
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    // Navigasi ke halaman edit (pastikan route ini ada)
    // router.push('/edit-profile'); 
    Alert.alert('Coming Soon', 'Fitur Edit Profil sedang dalam pengembangan.');
  };

  // Loading State Utama
  if (loading && !refreshing && !stats.name) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={styles.loadingText}>Memuat Profil...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={['#0a7ea4']} 
            tintColor="#0a7ea4"
        />
      }
    >
      {/* Header Profile Section */}
      <View style={styles.headerSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {stats.initial || 'U'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.editIconBtn} 
            onPress={handleEditProfile}
            activeOpacity={0.8}
          >
             <Ionicons name="camera" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.nameText} numberOfLines={1}>
            {stats.name || 'Pengguna Modiva'}
        </Text>
        <Text style={styles.emailText}>{stats.email}</Text>
        
        <View style={styles.badgeContainer}>
            <Badge icon="school-outline" text={stats.school} />
            <Badge icon="id-card-outline" text={stats.nisn} />
        </View>
      </View>

      {/* Data Kesehatan Grid */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Statistik Kesehatan</Text>
        <View style={styles.statsGrid}>
          <StatCard 
            label="Tinggi" 
            value={`${stats.height} cm`} 
            icon="resize-outline"
            color="#4CAF50"
          />
          <StatCard 
            label="Berat" 
            value={`${stats.weight} kg`} 
            icon="body-outline"
            color="#FF9800"
          />
          <StatCard 
            label="Hb" 
            value={`${stats.currentHB} g/dL`} 
            icon="water-outline"
            color="#F44336"
          />
           <StatCard 
            label="TTD" 
            value={`${stats.consumptionCount}/${stats.consumptionTarget}`} 
            icon="medkit-outline"
            color="#2196F3"
          />
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <MenuItem 
          icon="person-outline" 
          text="Edit Data Diri" 
          onPress={handleEditProfile} 
        />
        <MenuItem 
          icon="settings-outline" 
          text="Pengaturan Aplikasi" 
          onPress={() => Alert.alert('Info', 'Pengaturan belum tersedia')} 
        />
        <MenuItem 
          icon="help-circle-outline" 
          text="Bantuan & Dukungan" 
          onPress={() => Alert.alert('Info', 'Hubungi admin@modiva.app')} 
        />
        <MenuItem 
          icon="log-out-outline" 
          text="Keluar Aplikasi" 
          isDestructive 
          onPress={handleLogout} 
          hideBorder
        />
      </View>
      
      {/* Spacer agar konten tidak tertutup bottom tab */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

// --- Sub Components ---

const Badge = ({ icon, text }) => (
    <View style={styles.badge}>
        <Ionicons name={icon} size={12} color="#666" />
        <Text style={styles.badgeText} numberOfLines={1}>{text}</Text>
    </View>
);

const StatCard = ({ label, value, icon, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

const MenuItem = ({ icon, text, onPress, isDestructive, hideBorder }) => (
  <TouchableOpacity 
    style={[styles.menuItem, !hideBorder && styles.menuItemBorder]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuLeft}>
      <View style={[styles.menuIconBox, isDestructive && { backgroundColor: '#FF3B3015' }]}>
        <Ionicons name={icon} size={20} color={isDestructive ? '#FF3B30' : '#555'} />
      </View>
      <Text style={[styles.menuText, isDestructive && { color: '#FF3B30' }]}>
        {text}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#ccc" />
  </TouchableOpacity>
);

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  headerSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E1F5FE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0a7ea4',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  editIconBtn: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    backgroundColor: '#0a7ea4',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
    maxWidth: 150,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
    marginLeft: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: '48%', // Flexible width
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    // Card Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    padding: 8,
    borderRadius: 10,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
});

export default ProfileScreen;