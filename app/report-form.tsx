import React, { useState } from 'react';
// Perbaikan: Hapus 'Image' dari import di bawah ini
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ReportFormScreen() {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default hari ini
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    // Di sini nanti logika kirim ke API
    alert('Laporan berhasil dikirim!');
    router.back(); // Kembali ke home setelah submit
  };

  return (
    <View style={styles.container}>
      {/* Konfigurasi Header Navigation agar hilang (kita pakai custom header) */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Biru */}
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lapor Konsumsi</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Input Tanggal */}
        <View style={styles.card}>
          <Text style={styles.label}>Tanggal Konsumsi</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
            />
          </View>
        </View>

        {/* Upload Foto Area (Mockup UI) */}
        <View style={styles.card}>
          <Text style={styles.label}>Bukti Minum Vitamin</Text>
          <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={{ width: '100%', height: 200, borderRadius: 12 }} resizeMode="cover" />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="camera-outline" size={48} color="#cbd5e1" />
                <Text style={styles.uploadText}>Pilih Foto</Text>
                <Text style={styles.uploadSubText}>JPG, PNG (Max 5MB)</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Catatan */}
        <View style={styles.card}>
          <Text style={styles.label}>Catatan (Opsional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Tambahkan catatan jika diperlukan..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Tombol Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Kirim Laporan</Text>
        </TouchableOpacity>
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
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    // Shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 100,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#4b5563',
  },
  uploadSubText: {
    marginTop: 4,
    fontSize: 12,
    color: '#9ca3af',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});