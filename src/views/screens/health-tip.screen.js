import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const tipsData = [
  {
    id: 1,
    emoji: '💡',
    title: 'Tahukah Kamu?',
    description: 'Vitamin D berperan penting dalam penyerapan kalsium untuk kesehatan tulang.',
    colors: ['#4ade80', '#3b82f6'] // Green to Blue
  },
  {
    id: 2,
    emoji: '🥛',
    title: 'Tips Sehat',
    description: 'Minum susu yang diperkaya vitamin D untuk meningkatkan kesehatan tulang.',
    colors: ['#c084fc', '#ec4899'] // Purple to Pink
  },
  {
    id: 3,
    emoji: '☀️',
    title: 'Sinar Matahari',
    description: 'Paparan sinar matahari pagi 10-15 menit membantu produksi vitamin D.',
    colors: ['#facc15', '#f97316'] // Yellow to Orange
  },
  {
    id: 4,
    emoji: '🐟',
    title: 'Makanan Sehat',
    description: 'Ikan berlemak seperti salmon kaya akan vitamin D alami.',
    colors: ['#60a5fa', '#06b6d4'] // Blue to Cyan
  }
];

export default function HealthTipScreen() {
  return (
    <SafeAreaView style={styles.container}>


      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>
          Informasi penting untuk menjaga kesehatan dan asupan vitamin Anda.
        </Text>

        {tipsData.map((item) => (
          <LinearGradient
            key={item.id}
            colors={item.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </LinearGradient>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  scrollContent: {
    padding: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 24,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cardDescription: {
    fontSize: 14,
    color: 'white',
    lineHeight: 22,
    opacity: 0.9,
  },
});