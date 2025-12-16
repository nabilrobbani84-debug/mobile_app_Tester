import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'; // Tambahkan TouchableOpacity
import { useRouter } from 'expo-router'; // Gunakan ini jika pakai Expo Router (folder app/)
// ATAU jika pakai React Navigation biasa: import { useNavigation } from '@react-navigation/native';

const HealthTipCard = ({ tip }) => {
  const router = useRouter(); 
  // const navigation = useNavigation(); // Jika pakai React Navigation

  const handlePress = () => {
    // Arahkan ke screen detail. Sesuaikan path-nya.
    // Jika menggunakan Expo Router (file di app/health-tip-detail.tsx):
    router.push('/health-tip-detail'); 
    
    // Jika menggunakan React Navigation biasa:
    // navigation.navigate('HealthTipDetail', { data: tip });
  };

  return (
    <View style={styles.cardContainer}>
      {/* ... kode gambar atau konten lain ... */}
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>Tips Kesehatan</Text>
        <Text style={styles.description}>
          Jaga kesehatan tubuh dengan konsumsi vitamin yang cukup...
        </Text>

        {/* BAGIAN YANG DIPERBAIKI */}
        <TouchableOpacity onPress={handlePress} style={styles.buttonMore}>
          <Text style={styles.textMore}>Pelajari Lebih Lanjut</Text>
        </TouchableOpacity>
        {/* ----------------------- */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... style yang sudah ada ...
  buttonMore: {
    marginTop: 10,
    padding: 5,
  },
  textMore: {
    color: '#007BFF', // Warna biru link
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default HealthTipCard;