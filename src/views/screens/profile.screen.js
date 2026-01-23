import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { useEffect } from 'react';
import { AuthController } from '../../controllers/auth.controller';
import { store } from '../../state/store';

const ProfileScreen = () => {
  const router = useRouter();
  
  // State untuk Data User - Ambil dari Global Store
  const [user, setUser] = useState(store.getState().user.profile || {});
  
  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (state.user && state.user.profile) {
        setUser(state.user.profile);
      }
    });
    
    // Initial check
    const currentUser = AuthController.getCurrentUser();
    if (currentUser) {
        setUser(currentUser.toJSON ? currentUser.toJSON() : currentUser);
    }

    return () => unsubscribe();
  }, []);

  // State untuk Modal Edit
  const [isModalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState({});

  // Fungsi Membuka Modal Edit
  const handleEditPress = () => {
    setEditData({...user}); // Copy data user saat ini ke form edit
    setModalVisible(true);
  };

  // Fungsi Menyimpan Perubahan
  const handleSaveProfile = () => {
    if (!editData.name || !editData.school) {
      Alert.alert("Error", "Nama dan Sekolah tidak boleh kosong!");
      return;
    }
    setUser(editData); // Simpan data baru
    setModalVisible(false); // Tutup modal
    Alert.alert("Sukses", "Profil berhasil diperbarui!");
  };

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
            {/* Tombol Edit di Pojok Kanan Atas */}
            <TouchableOpacity style={styles.topEditButton} onPress={handleEditPress}>
              <Ionicons name="pencil" size={20} color="white" />
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                </Text>
                <TouchableOpacity style={styles.editAvatarButton}>
                  <Ionicons name="camera" size={16} color="#3b82f6" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.userName}>{user.name || 'Pengguna'}</Text>
              <Text style={styles.userEmail}>{user.email || '-'}</Text>
              
              <View style={styles.schoolBadge}>
                <Ionicons name="school-outline" size={14} color="white" />
                <Text style={styles.schoolText}>{user.school || 'Belum ada sekolah'}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.bodyContent}>
            {/* Info Pribadi Section */}
            <Text style={styles.sectionTitle}>Data Pribadi</Text>
            <View style={styles.infoCard}>
                <InfoRow label="NISN" value={user.nisn || '-'} />
                <InfoRow label="Tempat/Tgl Lahir" value={`${user.birthPlace || '-'}, ${user.birthDate || '-'}`} />
                <InfoRow label="Jenis Kelamin" value={user.gender === 'F' ? 'Perempuan' : user.gender === 'M' ? 'Laki-laki' : '-'} />
            </View>
          {/* Statistik Kesehatan */}
          <Text style={styles.sectionTitle}>Statistik Kesehatan</Text>
          <View style={styles.statsGrid}>
            <StatCard 
              label="Tinggi Badan" 
              value={`${user.height || 0} cm`} 
              icon="resize-outline" 
              color="#10b981" 
            />
            <StatCard 
              label="Berat Badan" 
              value={`${user.weight || 0} kg`} 
              icon="scale-outline" 
              color="#f59e0b" 
            />
            <StatCard 
              label="Hemoglobin" 
              value={`${user.hbLast || user.hb || 0} g/dL`} 
              icon="water-outline" 
              color="#ef4444" 
            />
            <StatCard 
              label="Target TTD" 
              value={`${user.consumptionCount || 0}/${user.totalTarget || 48}`} 
              icon="medkit-outline" 
              color="#3b82f6" 
            />
          </View>

          {/* Menu Logout */}
          <Text style={styles.sectionTitle}>Pengaturan</Text>
          <View style={styles.menuContainer}>
             <MenuItem 
                icon="log-out-outline" 
                label="Keluar Aplikasi" 
                onPress={handleLogout} 
                isDestructive 
             />
          </View>

          <Text style={styles.versionText}>Versi Aplikasi 1.0.0</Text>
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* --- MODAL EDIT PROFIL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profil</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Lengkap</Text>
                <TextInput
                  style={styles.input}
                  value={editData.name}
                  onChangeText={(text) => setEditData({...editData, name: text})}
                  placeholder="Masukkan nama lengkap"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Sekolah</Text>
                <TextInput
                  style={styles.input}
                  value={editData.school}
                  onChangeText={(text) => setEditData({...editData, school: text})}
                  placeholder="Masukkan nama sekolah"
                />
              </View>
              
               <View style={styles.inputGroup}>
                <Text style={styles.label}>Tempat Lahir</Text>
                <TextInput
                  style={styles.input}
                  value={editData.birthPlace}
                   onChangeText={(text) => setEditData({...editData, birthPlace: text})}
                  placeholder="Tempat Lahir"
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Tinggi (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={String(editData.height || '')}
                    onChangeText={(text) => setEditData({
                      ...editData, 
                      height: text
                    })}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Berat (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={String(editData.weight || '')}
                    onChangeText={(text) => setEditData({
                      ...editData, 
                      weight: text
                    })}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

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

const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
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
    position: 'relative',
  },
  // Style Baru untuk Tombol Edit di Header
  topEditButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
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
  versionText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 24,
    marginBottom: 20,
  },

  // --- Styles Modal Edit ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  inputGroup: {
    marginBottom: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Info Card Styles
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  infoValue: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProfileScreen; 