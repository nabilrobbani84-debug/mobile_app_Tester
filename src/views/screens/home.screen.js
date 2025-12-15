import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  RefreshControl, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Components
import Header from '../components/navigation/header.component';
import VitaminCard from '../components/cards/vitamin-card.component';
import HealthTipCard from '../components/cards/health-tip-card.component';
import ConsumptionChart from '../components/charts/consumption-chart.component';
import ProgressRing from '../components/charts/progress-ring.component'; // Import komponen ProgressRing

// State & Services
import { useAuth } from '../../state/AuthContext';
import { reportService } from '../../services/api/report.api';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State data dummy/real
  const [summaryData, setSummaryData] = useState({
    totalConsumed: 0,
    missed: 0,
    streak: 0,
    consumptionRate: 0,
  });

  const [weeklyData, setWeeklyData] = useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchDashboardData().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulasi fetch data - ganti dengan API call yang sesuai
      // const stats = await reportService.getStats(user.id);
      
      // Data Dummy untuk visualisasi Dashboard Siswa
      setSummaryData({
        totalConsumed: 24,
        missed: 2,
        streak: 5,
        consumptionRate: 0.85, // 85%
      });

      setWeeklyData([
        { value: 1, label: 'Sen' },
        { value: 1, label: 'Sel' },
        { value: 1, label: 'Rab' },
        { value: 0, label: 'Kam' },
        { value: 1, label: 'Jum' },
        { value: 1, label: 'Sab' },
        { value: 1, label: 'Min' },
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleReportPress = () => {
    router.push('/(tabs)/laporan');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title={`Halo, ${user?.name || 'Siswa'}`} 
        subtitle="Sudah minum vitamin hari ini?"
        showProfile={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {/* --- HERO SECTION: PROGRESS RING --- */}
        <View style={styles.heroSection}>
          <View style={styles.progressCard}>
            <View style={styles.progressContent}>
              <View>
                <Text style={styles.progressTitle}>Kepatuhan Minum</Text>
                <Text style={styles.progressSubtitle}>Minggu Ini</Text>
                <TouchableOpacity style={styles.ctaButton} onPress={handleReportPress}>
                  <Text style={styles.ctaText}>Lapor Sekarang</Text>
                  <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              <View style={styles.ringContainer}>
                <ProgressRing 
                  progress={summaryData.consumptionRate} 
                  size={100} 
                  strokeWidth={10} 
                  color={COLORS.primary}
                />
              </View>
            </View>
          </View>
        </View>

        {/* --- SUMMARY CARDS (GRID) --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ringkasan Aktivitas</Text>
          <View style={styles.statsGrid}>
            <VitaminCard
              title="Total Minum"
              value={`${summaryData.totalConsumed}`}
              icon="checkmark-circle"
              color={COLORS.success}
              trend="+2 dari minggu lalu"
              style={styles.statsCard}
            />
            <VitaminCard
              title="Terlewat"
              value={`${summaryData.missed}`}
              icon="alert-circle"
              color={COLORS.error}
              trend="Perbaiki kepatuhan!"
              style={styles.statsCard}
            />
            {/* Kartu Streak Tambahan */}
            <View style={[styles.customCard, styles.statsCard]}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.warning + '20' }]}>
                <Ionicons name="flame" size={24} color={COLORS.warning} />
              </View>
              <Text style={styles.cardValue}>{summaryData.streak} Hari</Text>
              <Text style={styles.cardTitle}>Streak Menurun</Text>
              <Text style={styles.cardTrend}>Pertahankan!</Text>
            </View>
          </View>
        </View>

        {/* --- CHART SECTION --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grafik Mingguan</Text>
          <View style={styles.chartContainer}>
            <ConsumptionChart data={weeklyData} />
          </View>
        </View>

        {/* --- TIPS SECTION --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tips Kesehatan</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profil')}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScroll}>
            <HealthTipCard
              title="Pentingnya Zat Besi"
              description="Zat besi membantu pembentukan sel darah merah untuk mencegah anemia."
              category="Nutrisi"
            />
            <HealthTipCard
              title="Minum Air Putih"
              description="Pastikan minum 8 gelas air sehari agar metabolisme lancar."
              category="Hidrasi"
            />
             <HealthTipCard
              title="Olahraga Ringan"
              description="Lakukan peregangan 5 menit setiap pagi."
              category="Aktivitas"
            />
          </ScrollView>
        </View>

        <View style={{ height: 100 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC', // Background abu-abu muda yang bersih
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Hero Section Styles
  heroSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  progressContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 15,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // CTA Button
  ctaButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    ...SHADOWS.small,
  },
  ctaText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },

  // Section Styles
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Grid Styles
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  statsCard: {
    width: (width - 52) / 2, // 2 kolom dengan gap
    marginBottom: 4,
  },

  // Custom Card Style (untuk yang manual view)
  customCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  cardTrend: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '500',
  },

  // Chart Container
  chartContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    ...SHADOWS.medium,
    alignItems: 'center', // Center chart
  },

  // Tips Scroll
  tipsScroll: {
    marginHorizontal: -20, // Negatif margin untuk full width scroll
    paddingHorizontal: 20,
  },
});

export default HomeScreen;