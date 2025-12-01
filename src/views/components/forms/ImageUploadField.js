// src/views/components/forms/ImageUploadField.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../../config/theme';
// Mock Image Picker Service (simulates expo-image-picker)
const MockImagePicker = {
  requestCameraPermissionsAsync: async () => ({ status: 'granted' }),
  requestMediaLibraryPermissionsAsync: async () => ({ status: 'granted' }),
  launchCameraAsync: async (options) => {
    // Simulate camera capture delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      canceled: false,
      assets: [{
        uri: 'https://via.placeholder.com/300x400/4A90E2/FFFFFF?text=Bukti+Minum+Vitamin',
        width: 300,
        height: 400,
        type: 'image',
        fileSize: 150000, // 150KB
      }]
    };
  },
  launchImageLibraryAsync: async (options) => {
    // Simulate gallery selection delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      canceled: false,
      assets: [{
        uri: 'https://via.placeholder.com/300x400/E24A4A/FFFFFF?text=Foto+Vitamin',
        width: 300,
        height: 400,
        type: 'image',
        fileSize: 200000, // 200KB
      }]
    };
  },
};
// Image Compression Service (simulates image compression)
const compressImage = async (imageUri, quality = 0.7) => {
  // Simulate compression delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`Compressing image with quality: ${quality}`);
  console.log(`Original URI: ${imageUri}`);
  
  // In real implementation, this would use expo-image-manipulator
  // import * as ImageManipulator from 'expo-image-manipulator';
  // const result = await ImageManipulator.manipulateAsync(
  //   imageUri,
  //   [{ resize: { width: 800 } }],
  //   { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
  // );
  
  return {
    uri: imageUri,
    width: 800,
    height: 1067,
    compressedSize: 80000, // Simulated compressed size ~80KB
  };
};
const ImageUploadField = ({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  compressionQuality = 0.7,
  placeholder = 'Upload bukti minum vitamin',
  helpText,
  style,
}) => {
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState(null);
  const requestPermissions = async (type) => {
    try {
      const result = type === 'camera'
        ? await MockImagePicker.requestCameraPermissionsAsync()
        : await MockImagePicker.requestMediaLibraryPermissionsAsync();
      
      return result.status === 'granted';
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  };
  const handleImagePick = async (source) => {
    setShowOptions(false);
    
    const hasPermission = await requestPermissions(source);
    if (!hasPermission) {
      Alert.alert(
        'Izin Diperlukan',
        `Aplikasi membutuhkan izin untuk mengakses ${source === 'camera' ? 'kamera' : 'galeri'}.`,
        [{ text: 'OK' }]
      );
      return;
    }
    setLoading(true);
    try {
      const options = {
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      };
      const result = source === 'camera'
        ? await MockImagePicker.launchCameraAsync(options)
        : await MockImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        // Check file size before compression
        if (selectedImage.fileSize > maxSize) {
          Alert.alert(
            'Ukuran File Terlalu Besar',
            `Ukuran maksimal adalah ${(maxSize / 1024 / 1024).toFixed(0)}MB. Gambar akan dikompresi.`,
          );
        }
        // Apply compression
        const compressedImage = await compressImage(
          selectedImage.uri, 
          compressionQuality
        );
        setCompressionInfo({
          originalSize: selectedImage.fileSize,
          compressedSize: compressedImage.compressedSize,
          savings: Math.round((1 - compressedImage.compressedSize / selectedImage.fileSize) * 100),
        });
        onChange({
          uri: compressedImage.uri,
          width: compressedImage.width,
          height: compressedImage.height,
          type: 'image/jpeg',
          name: `vitamin_proof_${Date.now()}.jpg`,
        });
      }
    } catch (error) {
      console.error('Image pick error:', error);
      Alert.alert('Error', 'Gagal mengambil gambar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };
  const handleRemove = () => {
    Alert.alert(
      'Hapus Gambar',
      'Apakah Anda yakin ingin menghapus gambar ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: () => {
            onChange(null);
            setCompressionInfo(null);
          }
        },
      ]
    );
  };
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };
  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}
      {helpText && (
        <Text style={styles.helpText}>{helpText}</Text>
      )}
      {!value ? (
        // Upload Area
        <TouchableOpacity
          style={[
            styles.uploadArea,
            error && styles.uploadAreaError,
            disabled && styles.uploadAreaDisabled,
          ]}
          onPress={() => !disabled && !loading && setShowOptions(true)}
          activeOpacity={0.7}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Memproses gambar...</Text>
            </View>
          ) : (
            <>
              <View style={styles.uploadIconContainer}>
                <Ionicons name="cloud-upload-outline" size={48} color={COLORS.primary} />
              </View>
              <Text style={styles.uploadTitle}>{placeholder}</Text>
              <Text style={styles.uploadSubtitle}>
                Ketuk untuk mengambil foto atau pilih dari galeri
              </Text>
              <View style={styles.uploadButton}>
                <Ionicons name="add" size={20} color={COLORS.white} />
                <Text style={styles.uploadButtonText}>Pilih Foto</Text>
              </View>
            </>
          )}
        </TouchableOpacity>
      ) : (
        // Image Preview
        <View style={styles.previewContainer}>
          <TouchableOpacity 
            style={styles.imageWrapper}
            onPress={() => setShowPreview(true)}
            activeOpacity={0.9}
          >
            <Image 
              source={{ uri: value.uri }} 
              style={styles.previewImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay}>
              <Ionicons name="expand-outline" size={24} color={COLORS.white} />
            </View>
          </TouchableOpacity>
          <View style={styles.previewInfo}>
            <View style={styles.previewDetails}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.previewFileName} numberOfLines={1}>
                {value.name || 'Bukti foto'}
              </Text>
            </View>
            {compressionInfo && (
              <View style={styles.compressionInfo}>
                <Ionicons name="resize-outline" size={16} color={COLORS.gray} />
                <Text style={styles.compressionText}>
                  Dikompresi: {formatFileSize(compressionInfo.compressedSize)} 
                  {' '}(hemat {compressionInfo.savings}%)
                </Text>
              </View>
            )}
            <View style={styles.previewActions}>
              <TouchableOpacity 
                style={styles.changeButton}
                onPress={() => setShowOptions(true)}
              >
                <Ionicons name="refresh-outline" size={18} color={COLORS.primary} />
                <Text style={styles.changeButtonText}>Ganti</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={handleRemove}
              >
                <Ionicons name="trash-outline" size={18} color={COLORS.secondary} />
                <Text style={styles.removeButtonText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      {/* Image Source Options Modal */}
      <Modal
        visible={showOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.optionsContainer}>
            <View style={styles.optionsHeader}>
              <Text style={styles.optionsTitle}>Pilih Sumber Gambar</Text>
              <TouchableOpacity onPress={() => setShowOptions(false)}>
                <Ionicons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => handleImagePick('camera')}
            >
              <View style={[styles.optionIcon, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="camera" size={28} color={COLORS.primary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Ambil Foto</Text>
                <Text style={styles.optionSubtitle}>Gunakan kamera untuk mengambil foto</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => handleImagePick('gallery')}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="images" size={28} color={COLORS.success} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Pilih dari Galeri</Text>
                <Text style={styles.optionSubtitle}>Pilih foto yang sudah ada</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelOption}
              onPress={() => setShowOptions(false)}
            >
              <Text style={styles.cancelOptionText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Full Image Preview Modal */}
      <Modal
        visible={showPreview}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.previewModal}>
          <TouchableOpacity 
            style={styles.closePreviewButton}
            onPress={() => setShowPreview(false)}
          >
            <Ionicons name="close-circle" size={36} color={COLORS.white} />
          </TouchableOpacity>
          {value && (
            <Image 
              source={{ uri: value.uri }} 
              style={styles.fullPreviewImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.medium,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.small,
  },
  label: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.dark,
  },
  required: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.secondary,
    marginLeft: 4,
  },
  helpText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: SIZES.small,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SIZES.extraLarge,
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  uploadAreaError: {
    borderColor: COLORS.secondary,
  },
  uploadAreaDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: SIZES.large,
  },
  loadingText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginTop: SIZES.medium,
  },
  uploadIconContainer: {
    marginBottom: SIZES.medium,
  },
  uploadTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.medium,
    color: COLORS.dark,
    textAlign: 'center',
  },
  uploadSubtitle: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SIZES.small,
    marginBottom: SIZES.medium,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.large,
    borderRadius: SIZES.radius,
    gap: SIZES.small,
  },
  uploadButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.font,
    color: COLORS.white,
  },
  previewContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.lightGray,
  },
  imageOverlay: {
    position: 'absolute',
    top: SIZES.small,
    right: SIZES.small,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: SIZES.small,
  },
  previewInfo: {
    padding: SIZES.medium,
  },
  previewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small,
  },
  previewFileName: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.dark,
    flex: 1,
  },
  compressionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SIZES.small,
  },
  compressionText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  previewActions: {
    flexDirection: 'row',
    gap: SIZES.medium,
    marginTop: SIZES.medium,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radius,
  },
  changeButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.primary,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: SIZES.radius,
  },
  removeButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.secondary,
  },
  errorText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.secondary,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  optionsContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    padding: SIZES.large,
    paddingBottom: SIZES.extraLarge,
  },
  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  optionsTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.dark,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.font,
    color: COLORS.dark,
  },
  optionSubtitle: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 2,
  },
  cancelOption: {
    marginTop: SIZES.large,
    paddingVertical: SIZES.medium,
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
  },
  cancelOptionText: {
    ...FONTS.semiBold,
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  previewModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closePreviewButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  fullPreviewImage: {
    width: '100%',
    height: '80%',
  },
});
export default ImageUploadField;