import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, RefreshControl, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

// Import UI Components
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Import Logic & State
import { ReportController } from '@/src/controllers/report.controller';
import { store } from '@/src/state/store';
import { Fonts } from '@/constants/theme';

const ReportsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [userInfo, setUserInfo] = useState({ name: '', nisn: '-' });
  const [currentHB, setCurrentHB] = useState('-');
  const [reports, setReports] = useState([]);

  const loadData = async () => {
    try {
      await ReportController.loadReports();
      const state = store.getState();
      
      setUserInfo(state.user.profile || { name: 'Pengguna', nisn: '-' });
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

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#1D3D47"
          name="chart.bar.fill"
          style={styles.headerImage}
        />
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Laporan Kesehatan
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.infoCard}>
        <ThemedText type="subtitle" style={styles.userName}>
          {userInfo.name || 'Pengguna'}
        </ThemedText>
        <ThemedText style={styles.userDetail}>NISN: {userInfo.nisn}</ThemedText>
        
        <View style={styles.hbContainer}>
          <ThemedText style={styles.hbLabel}>HB Saat Ini</ThemedText>
          <ThemedText type="title" style={styles.hbValue}>
            {currentHB} <ThemedText style={styles.unit}>g/dL</ThemedText>
          </ThemedText>
        </View>
      </ThemedView>

      <ThemedView style={styles.chartContainer}>
        <ThemedText type="defaultSemiBold" style={{ marginBottom: 10 }}>Tren Hemoglobin (6 Bulan)</ThemedText>
        <View style={styles.chartPlaceholder}>
          <ThemedText style={{ color: '#888' }}>Grafik HB akan tampil di sini</ThemedText>
        </View>
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle" style={{ marginBottom: 12 }}>Riwayat Laporan</ThemedText>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0a7ea4" />
        ) : reports.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText>Belum ada laporan</ThemedText>
          </View>
        ) : (
          reports.map((report, index) => (
            <View key={index} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View>
                  <ThemedText type="defaultSemiBold">{report.date}</ThemedText>
                  <ThemedText style={{ color: '#666' }}>HB: {report.hb_value || '-'} g/dL</ThemedText>
                </View>
                <View style={[styles.badge, { backgroundColor: '#E6FFFA' }]}>
                  <ThemedText style={[styles.badgeText, { color: '#047857' }]}>
                    {report.status || 'Selesai'}
                  </ThemedText>
                </View>
              </View>
              {report.notes ? (
                <ThemedText style={styles.notes}>{report.notes}</ThemedText>
              ) : null}
            </View>
          ))
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    marginBottom: 20,
  },
  userName: {
    marginBottom: 4,
  },
  userDetail: {
    opacity: 0.7,
    marginBottom: 12,
  },
  hbContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
    paddingTop: 12,
  },
  hbLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  hbValue: {
    color: '#0a7ea4',
  },
  unit: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'normal',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  reportCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(150, 150, 150, 0.05)',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.1)',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  notes: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartPlaceholder: {
    height: 180,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
  }
});

export default ReportsScreen;