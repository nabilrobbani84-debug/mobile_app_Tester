import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Anda perlu install: npx expo install expo-linear-gradient
import { Ionicons } from '@expo/vector-icons';

// Data Mockup (Diambil dari assets/js/api.js)
const userData = {
  name: 'Aisyah',
  consumption_count: 8,
  total_target: 48,
  hb_last: 12.5
};

export default function HomeScreen() {
  const percentage = Math.round((userData.consumption_count / userData.total_target) * 100);

  return (
    <View style={styles.container}>
      {/* Header dengan Gradient */}
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']} // from-blue-500 to-blue-700
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Hai, {userData.name} 👋</Text>
            <Text style={styles.subGreeting}>Jangan lupa minum vitamin hari ini!</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.contentContainer} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Card Informasi Vitamin */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Informasi Vitamin</Text>
            <Ionicons name="medkit" size={24} color="#3b82f6" />
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.bigStat}>{userData.consumption_count}</Text>
            <Text style={styles.statDivider}>/</Text>
            <Text style={styles.totalStat}>{userData.total_target}</Text>
          </View>
          <Text style={styles.statLabel}>Jumlah vitamin diminum</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
          </View>
        </View>

        {/* Tombol Lapor Cepat */}
        <TouchableOpacity style={styles.reportButton} onPress={() => alert('Buka Form Laporan')}>
          <Ionicons name="add-circle-outline" size={28} color="white" />
          <Text style={styles.reportButtonText}>Isi Laporan Konsumsi</Text>
        </TouchableOpacity>

        {/* Card Tren Hemoglobin */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Tren Hemoglobin</Text>
            <Text style={styles.weekLabel}>Minggu ini</Text>
          </View>
          <View style={styles.hbRow}>
            <Text style={styles.hbValue}>{userData.hb_last}</Text>
            <Text style={styles.hbUnit}>g/dL</Text>
          </View>
          {/* Placeholder untuk Chart (Membutuhkan library chart terpisah di RN) */}
          <View style={styles.chartPlaceholder}>
            <View style={{height: 100, width: '100%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
                {[40, 50, 60, 55, 70, 80, 80].map((h, i) => (
                    <View key={i} style={{width: 30, height: h, backgroundColor: 'rgba(239, 68, 68, 0.2)', borderRadius: 4}} />
                ))}
            </View>
            <Text style={{textAlign: 'center', color: '#999', marginTop: 10, fontSize: 12}}>Visualisasi Grafik HB</Text>
          </View>
        </View>

        {/* Card Tips Kesehatan */}
        <LinearGradient
          colors={['#10b981', '#059669']} // from-green-500 to-emerald-600
          style={[styles.card, styles.tipsCard]}
        >
          <Text style={styles.tipsTitle}>Tahukah Kamu? 💡</Text>
          <Text style={styles.tipsText}>
            Vitamin D membantu penyerapan kalsium untuk tulang yang kuat. Dapatkan sinar matahari pagi 10-15 menit setiap hari!
          </Text>
          <TouchableOpacity style={styles.tipsButton} onPress={() => alert('Buka Tips')}>
            <Text style={styles.tipsButtonText}>Pelajari Lebih Lanjut →</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Riwayat Terbaru */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Riwayat Konsumsi Terbaru</Text>
          
          {[
            { date: '12 Mei 2024', hb: '12.5', status: 'Selesai' },
            { date: '11 Mei 2024', hb: '12.3', status: 'Selesai' },
            { date: '10 Mei 2024', hb: '12.1', status: 'Selesai' },
          ].map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <View>
                <Text style={styles.historyDate}>{item.date}</Text>
                <Text style={styles.historyHb}>Nilai HB: {item.hb} g/dL</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60, // Sesuaikan status bar
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subGreeting: {
    color: '#dbeafe',
    marginTop: 4,
    fontSize: 14,
  },
  contentContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  bigStat: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statDivider: {
    fontSize: 24,
    color: '#9ca3af',
    marginHorizontal: 4,
    marginBottom: 6,
  },
  totalStat: {
    fontSize: 24,
    color: '#4b5563',
    marginBottom: 6,
  },
  statLabel: {
    color: '#4b5563',
    fontSize: 14,
    marginBottom: 16,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    width: '100%',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#2563eb',
    borderRadius: 999,
  },
  reportButton: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  reportButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  weekLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  hbRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  hbValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  hbUnit: {
    fontSize: 16,
    color: '#4b5563',
    marginLeft: 4,
  },
  chartPlaceholder: {
    height: 150,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  tipsCard: {
    padding: 24,
  },
  tipsTitle: {
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16,
  },
  tipsText: {
    color: '#ecfdf5',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  tipsButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  tipsButtonText: {
    color: '#059669',
    fontWeight: '600',
    fontSize: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  historyDate: {
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  historyHb: {
    fontSize: 12,
    color: '#6b7280',
  },
  badge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '600',
  },
});