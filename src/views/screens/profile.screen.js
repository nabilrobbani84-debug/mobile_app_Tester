import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// Mock Data
const MOCK_USER = {
  name: 'Aisyah Putri',
  email: 'aisyah.putri@sekolah.id',
  school: 'SMA Negeri 1 Jakarta',
  avatar_initial: 'A',
  stats: {
    height: 160,
    weight: 50,
    hb: 12.5,
    consumption: '8/48'
  }
};

const ProfileScreen = () => {
  const router = useRouter();
  const [user] = useState(MOCK_USER);

  const handleLogout = () => {
    Alert.alert(
      "Keluar", 
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Keluar", 
          style: "destructive", 
          onPress: () => router.replace('/login') 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerWrapper}>
          <LinearGradient
            colors={['#3b82f6', '#1d4ed8']}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{user.avatar_initial}</Text>
                <TouchableOpacity style={styles.editAvatarButton}>
                  <Ionicons name="camera" size={16} color="#3b82f6" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              
              <View style={styles.schoolBadge}>
                <Ionicons name="school-outline" size={14} color="white" />
                <Text style={styles.schoolText}>{user.school}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.bodyContent}>
          {/* Statistik Kesehatan */}
          <Text style={styles.sectionTitle}>Statistik Kesehatan</Text>
          <View style={styles.statsGrid}>
            <StatCard 
              label="Tinggi Badan" 
              value={`${user.stats.height} cm`} 
              icon="resize-outline" 
              color="#10b981" 
            />
            <StatCard 
              label="Berat Badan" 
              value={`${user.stats.weight} kg`} 
              icon="scale-outline" 
              color="#f59e0b" 
            />
            <StatCard 
              label="Hemoglobin" 
              value={`${user.stats.hb} g/dL`} 
              icon="water-outline" 
              color="#ef4444" 
            />
            <StatCard 
              label="Target TTD" 
              value={user.stats.consumption} 
              icon="medkit-outline" 
              color="#3b82f6" 
            />
          </View>

          {/* Menu Pengaturan Akun (Tanpa Report Form) */}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
};

// --- Sub-components ---

const StatCard = ({ label, value, icon, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

const MenuItem = ({ icon, label, onPress, isDestructive }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <View style={[styles.menuIconBox, isDestructive && styles.destructiveIconBox]}>
        <Ionicons 
          name={icon} 
          size={22} 
          color={isDestructive ? '#ef4444' : '#4b5563'} 
        />
      </View>
      <Text style={[styles.menuLabel, isDestructive && styles.destructiveText]}>
        {label}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
  </TouchableOpacity>
);

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  headerWrapper: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 16,
    position: 'relative',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#dbeafe',
    marginBottom: 12,
  },
  schoolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  schoolText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  bodyContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconBox: {
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIconBox: {
    backgroundColor: '#fef2f2',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  destructiveText: {
    color: '#ef4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 8,
    marginHorizontal: 12,
  },
  versionText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 24,
    marginBottom: 20,
  }
});

export default ProfileScreen;