import { Feather, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    SectionList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Imports for Logic
import { NotificationController } from '../../controllers/notification.controller';
import { store } from '../../state/store';

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

// --- Helper Functions ---

const groupNotificationsByDate = (notifications) => {
  if (!notifications || !Array.isArray(notifications)) return [];

  const sections = [];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups = {
    today: [],
    yesterday: [],
    older: []
  };

  // Helper to strip time component for comparison
  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  notifications.forEach(item => {
    // Ensure item has a timestamp, fallback to Date.now() if missing
    const itemDate = item.timestamp ? new Date(item.timestamp) : new Date();
    
    if (isSameDay(itemDate, today)) {
      groups.today.push(item);
    } else if (isSameDay(itemDate, yesterday)) {
      groups.yesterday.push(item);
    } else {
      groups.older.push(item);
    }
  });

  if (groups.today.length > 0) {
    sections.push({ title: 'Hari Ini', data: groups.today.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)) });
  }
  if (groups.yesterday.length > 0) {
    sections.push({ title: 'Kemarin', data: groups.yesterday.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)) });
  }
  if (groups.older.length > 0) {
    sections.push({ title: 'Sebelumnya', data: groups.older.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)) });
  }

  return sections;
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

// --- Components ---

const Header = () => {
  const router = useRouter();
  
  const handleMarkAllRead = () => {
      NotificationController.markAllAsRead();
  };

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
      
      {/* Tombol aksi kanan (Mark all read) */}
      <TouchableOpacity activeOpacity={0.7} onPress={handleMarkAllRead}>
        <Ionicons name="checkmark-done-circle-outline" size={26} color={COLORS.accent} />
      </TouchableOpacity>
    </View>
  );
};

const NotificationItem = ({ item, onDelete, onPress }) => {
  // Menentukan warna & icon berdasarkan tipe
  const getStyleByType = () => {
    switch (item.type) {
      case 'reminder':
        return { bg: COLORS.iconBgReminder, color: COLORS.iconColorReminder, icon: 'alarm-outline' }; 
      case 'message':
        return { bg: COLORS.iconBgMessage, color: COLORS.iconColorMessage, icon: 'chatbubble-ellipses-outline' };
      default:
        return { bg: '#F3F4F6', color: '#4B5563', icon: 'information-circle-outline' };
    }
  };

  const styleConfig = getStyleByType();

  return (
    <View style={styles.cardWrapper}>
        <TouchableOpacity 
            style={[styles.card, !item.read && styles.unreadCard]} 
            activeOpacity={0.9}
            onPress={() => onPress(item)}
        >
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
                <Text style={styles.itemTime}>{formatTime(item.timestamp)}</Text>
            </View>
            
            <Text style={styles.itemSubtitle} numberOfLines={2}>
                {item.message || item.subtitle}
            </Text>
            </View>
        </View>

        {/* Unread Indicator Dot */}
        {!item.read && <View style={styles.unreadDot} />}
        </TouchableOpacity>

        {/* Delete Button (Overlay or Side) - Simple implementation as a side action */}
        <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => onDelete(item.id)}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
    </View>
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
    <Text style={styles.emptySubtitle}>Kami akan memberi tahu Anda jika ada update terbaru hari ini.</Text>
  </View>
);

// --- Main Screen ---

const NotificationScreen = () => {
  const [sections, setSections] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Initial Load & Subscribe
  useFocusEffect(
    useCallback(() => {
      // 1. Trigger Check for Today's Reminders
      NotificationController.checkReminders();
      
      // 2. Load Notifications
      NotificationController.loadNotifications();

      // 3. Update State from Store
      const updateState = () => {
          const state = store.getState();
          const list = state.notifications.list || [];
          setSections(groupNotificationsByDate(list));
      };

      updateState(); // Initial call

      // 4. Subscribe to future updates
      const unsubscribe = store.subscribe(() => {
          updateState();
      });

      return () => unsubscribe();
    }, [])
  );

  const handleDeleteNotification = (id) => {
      Alert.alert(
          "Hapus Notifikasi",
          "Apakah Anda yakin ingin menghapus notifikasi ini?",
          [
              { text: "Batal", style: "cancel" },
              { 
                  text: "Hapus", 
                  style: "destructive", 
                  onPress: () => NotificationController.deleteNotification(id)
              }
          ]
      );
  };

  const handleNotificationPress = (item) => {
      if (!item.read) {
          NotificationController.markAsRead(item.id);
      }
      setSelectedNotification(item);
      setModalVisible(true);
  };

  const closeModal = () => {
      setModalVisible(false);
      setSelectedNotification(null);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Header />
      
      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
            <NotificationItem 
                item={item} 
                onDelete={handleDeleteNotification}
                onPress={handleNotificationPress}
            />
        )}
        renderSectionHeader={({ section: { title } }) => <SectionHeader title={title} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={EmptyState}
        ListFooterComponent={<View style={{ height: 40 }} />} 
      />

    {/* Detail Modal */}
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Detail Notifikasi</Text>
                    <TouchableOpacity onPress={closeModal}>
                        <Ionicons name="close" size={24} color="#374151" />
                    </TouchableOpacity>
                </View>
                
                {selectedNotification && (
                    <ScrollView contentContainerStyle={styles.modalBody}>
                        <View style={styles.modalIconContainer}>
                             <Ionicons 
                                name={selectedNotification.type === 'reminder' ? 'alarm-outline' : 'chatbubble-ellipses-outline'} 
                                size={40} 
                                color={selectedNotification.type === 'reminder' ? COLORS.iconColorReminder : COLORS.iconColorMessage} 
                            />
                        </View>
                        <Text style={styles.modalItemTitle}>{selectedNotification.title}</Text>
                        <Text style={styles.modalItemTime}>{formatTime(selectedNotification.timestamp)}</Text>
                        <View style={styles.divider} />
                        <Text style={styles.modalItemMessage}>{selectedNotification.message || selectedNotification.subtitle}</Text>
                        
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeButtonText}>Tutup</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </View>
        </View>
    </Modal>

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
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },

  // Section Header Styles
  sectionHeader: {
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: COLORS.background,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Card Styles
  cardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 20, 
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unreadCard: {
    borderColor: COLORS.accentLight,
    backgroundColor: '#FAFCFF', 
  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
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
    paddingVertical: 2,
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
    fontWeight: '800',
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
    lineHeight: 18,
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
  
  // Delete Button
  deleteButton: {
      padding: 10,
      marginLeft: 8,
      backgroundColor: '#FEF2F2',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      height: 48, // approximate height of card center
      width: 48,
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

  // Modal Styles
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
    minHeight: '40%',
    maxHeight: '80%',
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
  modalBody: {
      alignItems: 'center',
      paddingBottom: 20,
  },
  modalIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: COLORS.iconBgMessage,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
  },
  modalItemTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: COLORS.textPrimary,
      textAlign: 'center',
      marginBottom: 8,
  },
  modalItemTime: {
      fontSize: 14,
      color: COLORS.textSecondary,
      marginBottom: 16,
  },
  divider: {
      height: 1,
      width: '100%',
      backgroundColor: '#E5E7EB',
      marginBottom: 16,
  },
  modalItemMessage: {
      fontSize: 16,
      color: '#374151',
      lineHeight: 24,
      textAlign: 'center',
      marginBottom: 32,
  },
  closeButton: {
      backgroundColor: COLORS.accent,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 16,
      width: '100%',
      alignItems: 'center',
  },
  closeButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
  }
});

export default NotificationScreen;