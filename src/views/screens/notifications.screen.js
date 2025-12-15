import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// --- Theme & Colors (Modern Palette) ---
const COLORS = {
  background: '#F8F9FA', // Background sedikit abu-abu agar card putih lebih pop-up
  cardBg: '#FFFFFF',
  textPrimary: '#1F2937', // Abu tua (hampir hitam)
  textSecondary: '#6B7280', // Abu sedang
  accent: '#3B82F6', // Biru utama
  accentLight: '#EFF6FF', // Biru sangat muda
  danger: '#EF4444',
  success: '#10B981',
  iconBgReminder: '#FEF3C7', // Kuning muda untuk reminder
  iconColorReminder: '#D97706', // Oranye tua
  iconBgMessage: '#E0E7FF', // Indigo muda untuk pesan
  iconColorMessage: '#4338CA', // Indigo tua
};

const { width } = Dimensions.get('window');

// --- Mock Data (Grouped by Date) ---
const NOTIFICATIONS_DATA = [
  {
    title: 'Hari Ini',
    data: [
      {
        id: '1',
        title: 'Waktunya Minum Vitamin!',
        subtitle: 'Jangan lupa konsumsi Tablet Tambah Darah hari ini.',
        time: '10:00',
        type: 'reminder',
        read: false,
      },
      {
        id: '2',
        title: 'Semangat Pagi!',
        subtitle: 'Kesehatan adalah investasi terbaikmu. Tetap semangat!',
        time: '08:00',
        type: 'message',
        read: false,
      },
    ],
  },
  {
    title: 'Kemarin',
    data: [
      {
        id: '3',
        title: 'Laporan Mingguan Tersedia',
        subtitle: 'Cek rangkuman kesehatanmu minggu ini.',
        time: '14:30',
        type: 'info',
        read: true,
      },
    ],
  },
  {
    title: 'Minggu Lalu',
    data: [
      {
        id: '4',
        title: 'Pengingat Kontrol',
        subtitle: 'Jadwal kontrol kesehatan puskesmas.',
        time: 'Senin',
        type: 'reminder',
        read: true,
      },
      {
        id: '5',
        title: 'Tips Kesehatan Baru',
        subtitle: 'Makanan kaya zat besi yang wajib kamu tahu.',
        time: 'Minggu',
        type: 'message',
        read: true,
      },
    ],
  },
];

// --- Components ---

const Header = () => {
  const router = useRouter();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.canGoBack() ? router.back() : null}
        activeOpacity={0.7}
      >
        <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Notifikasi</Text>
      
      {/* Tombol aksi kanan (misal: Mark all read) */}
      <TouchableOpacity activeOpacity={0.7}>
        <Ionicons name="checkmark-done-circle-outline" size={26} color={COLORS.accent} />
      </TouchableOpacity>
    </View>
  );
};

const NotificationItem = ({ item }) => {
  // Menentukan warna & icon berdasarkan tipe
  const getStyleByType = () => {
    switch (item.type) {
      case 'reminder':
        return { bg: COLORS.iconBgReminder, color: COLORS.iconColorReminder, icon: 'alarm-outline' }; // Ionicons
      case 'message':
        return { bg: COLORS.iconBgMessage, color: COLORS.iconColorMessage, icon: 'chatbubble-ellipses-outline' };
      default:
        return { bg: '#F3F4F6', color: '#4B5563', icon: 'information-circle-outline' };
    }
  };

  const styleConfig = getStyleByType();

  return (
    <TouchableOpacity style={[styles.card, !item.read && styles.unreadCard]} activeOpacity={0.9}>
      <View style={styles.cardContent}>
        
        {/* Icon Box */}
        <View style={[styles.iconBox, { backgroundColor: styleConfig.bg }]}>
          <Ionicons name={styleConfig.icon} size={22} color={styleConfig.color} />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.itemTitle, !item.read && styles.unreadTitle]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.itemTime}>{item.time}</Text>
          </View>
          
          <Text style={styles.itemSubtitle} numberOfLines={2}>
            {item.subtitle}
          </Text>
        </View>
      </View>

      {/* Unread Indicator Dot */}
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconBg}>
      <Feather name="bell-off" size={40} color="#9CA3AF" />
    </View>
    <Text style={styles.emptyTitle}>Belum ada notifikasi</Text>
    <Text style={styles.emptySubtitle}>Kami akan memberi tahu Anda jika ada update terbaru.</Text>
  </View>
);

// --- Main Screen ---

const NotificationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Header />
      
      <SectionList
        sections={NOTIFICATIONS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} />}
        renderSectionHeader={({ section: { title } }) => <SectionHeader title={title} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false} // Set true jika ingin header tanggal menempel di atas
        ListEmptyComponent={EmptyState}
        // Spacer bawah agar tidak tertutup nav bar jika ada
        ListFooterComponent={<View style={{ height: 40 }} />} 
      />
    </SafeAreaView>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  // Header Styles
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
    // Opsional: Shadow tipis di header
    // borderBottomWidth: 1,
    // borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800', // Lebih tebal
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },

  // Section Header Styles
  sectionHeader: {
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: COLORS.background, // Match container bg
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Card Styles
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20, // Sudut lebih bulat
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    // Modern Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3, // Android shadow
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unreadCard: {
    borderColor: COLORS.accentLight,
    backgroundColor: '#FAFCFF', // Sedikit tint biru untuk unread
  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start', // Align items to top
  },
  
  // Icon Styles
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  // Text Styles inside Card
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 2, // Minor adjustment
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: '800', // Lebih tebal jika unread
    color: '#111827',
  },
  itemTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  itemSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18, // Jarak antar baris lebih enak dibaca
  },

  // Indicators
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: '70%',
  },
});

export default NotificationScreen;