import React, { useEffect, useState, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  RefreshControl, 
  ActivityIndicator, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// --- PERBAIKAN IMPORT DI SINI ---
// Hapus 'src/' karena kita sudah berada di dalam folder src (via ../..)
import { ReportController } from '../../controllers/report.controller';
import { store } from '../../state/store';

// --- Theme Colors ---
const COLORS = {
  background: '#F8F9FA', // Abu-abu sangat muda (bersih)
  primary: '#3B82F6',    // Biru utama
  cardBg: '#FFFFFF',
  textMain: '#111827',   // Hitam soft
  textSub: '#6B7280',    // Abu-abu text
  success: '#10B981',    // Hijau
  warning: '#F59E0B',    // Oranye
  danger: '#EF4444',     // Merah
  border: '#E5E7EB',
};

const ReportsScreen = () => {
  const router = useRouter();
  
  // --- State ---
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', nisn: '-' });
  const [currentHB, setCurrentHB] = useState('-');
  const [reports, setReports] = useState([]);

  // --- Logic Load Data ---
  const loadData = async () => {
    try {
      await ReportController.loadReports();
      const state = store.getState();
      
      setUserInfo(state.user.profile || { name: 'Siswa', nisn: '-' });
      setCurrentHB(state.user.hemoglobin?.current || '-');
      setReports(state.reports.list || []);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  // --- Helper: Status Badge Color ---
  const getStatusColor = (hbValue) => {
    const val = parseFloat(hbValue);
    if (isNaN(val)) return COLORS.textSub;
    if (val >= 12) return COLORS.success; // Normal
    if (val >= 10) return COLORS.warning; // Sedikit rendah
    return COLORS.danger; // Rendah
  };

  const getStatusText = (hbValue) => {
    const val = parseFloat(hbValue);
    if (isNaN(val)) return 'Tidak Ada Data';
    if (val >= 12) return 'Normal';
    if (val >= 10) return 'Sedikit Rendah';
    return 'Anemia';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* --- Header --- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Laporan Kesehatan</Text>
          <Text style={styles.headerSubtitle}>Pantau perkembangan HB-mu</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/(tabs)/profil')}
        >
          <Ionicons name="person-circle-outline" size={32} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        
        {/* --- 1. Hero Card (Ringkasan HB) --- */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroLabel}>Hemoglobin Saat Ini</Text>
              <Text style={styles.heroDate}>Update Terakhir: Hari ini</Text>
            </View>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="heartbeat" size={24} color="#FFF" />
            </View>
          </View>

          <View style={styles.heroValueContainer}>
            <Text style={styles.heroValue}>{currentHB}</Text>
            <Text style={styles.heroUnit}>g/dL</Text>
          </View>

          <View style={styles.heroFooter}>
             <View style={styles.statusPill}>
               <Text style={styles.statusPillText}>
                 {getStatusText(currentHB)}
               </Text>
             </View>
             <Text style={styles.heroUser}>{userInfo.name}</Text>
          </View>
        </View>

        {/* --- 2. Chart Section --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tren Hemoglobin</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>6 Bulan Terakhir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chartContainer}>
          {/* Placeholder Grafik */}
          <View style={styles.chartPlaceholder}>
             <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={40} color="#CBD5E1" />
             <Text style={styles.chartPlaceholderText}>Grafik perkembangan akan muncul disini</Text>
          </View>
        </View>

        {/* --- 3. Riwayat Laporan --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Riwayat Pemeriksaan</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : reports.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>Belum ada riwayat laporan</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {reports.map((report, index) => (
              <View key={index} style={styles.reportItem}>
                {/* Tanggal Box */}
                <View style={styles.dateBox}>
                  <Text style={styles.dateDay}>{report.date?.split(' ')[0] || '01'}</Text>
                  <Text style={styles.dateMonth}>{report.date?.split(' ')[1] || 'Jan'}</Text>
                </View>
                
                {/* Detail */}
                <View style={styles.reportDetail}>
                  <Text style={styles.reportTitle}>Pemeriksaan Rutin</Text>
                  <Text style={styles.reportNotes} numberOfLines={1}>
                    {report.notes || 'Tidak ada catatan tambahan'}
                  </Text>
                </View>

                {/* Nilai HB */}
                <View style={styles.reportValueBox}>
                  <Text style={[styles.reportValue, { color: getStatusColor(report.hb_value) }]}>
                    {report.hb_value}
                  </Text>
                  <Text style={styles.reportUnit}>g/dL</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* Spacer untuk Bottom Tab & FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- Floating Action Button (FAB) --- */}
      <TouchableOpacity 
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/report-form')}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSub,
    marginTop: 2,
  },
  profileButton: {
    padding: 4,
  },

  // Hero Card
  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 24,
    marginTop: 10,
    marginBottom: 24,
    // Shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  heroDate: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 12,
  },
  heroValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 16,
  },
  heroValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
  },
  heroUnit: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 8,
    fontWeight: '500',
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  statusPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusPillText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroUser: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Sections
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Chart
  chartContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  chartPlaceholder: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  chartPlaceholderText: {
    marginTop: 8,
    color: COLORS.textSub,
    fontSize: 12,
  },

  // List
  listContainer: {
    gap: 12,
  },
  reportItem: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  dateBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  dateDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  dateMonth: {
    fontSize: 10,
    color: COLORS.textSub,
    textTransform: 'uppercase',
  },
  reportDetail: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  reportNotes: {
    fontSize: 13,
    color: COLORS.textSub,
    marginTop: 2,
  },
  reportValueBox: {
    alignItems: 'flex-end',
  },
  reportValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reportUnit: {
    fontSize: 12,
    color: COLORS.textSub,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: COLORS.textSub,
    marginTop: 10,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 30, // Disesuaikan agar tidak tertutup TabBar
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default ReportsScreen;