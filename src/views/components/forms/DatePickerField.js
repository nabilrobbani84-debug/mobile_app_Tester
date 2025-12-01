// src/views/components/forms/DatePickerField.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../../config/theme';
const DatePickerField = ({
  label,
  value,
  onChange,
  placeholder = 'Pilih tanggal',
  error,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  style,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());
  const formatDate = (date) => {
    if (!date) return '';
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('id-ID', options);
  };
  const formatShortDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleConfirm = () => {
    onChange(tempDate);
    setShowPicker(false);
  };
  const handleCancel = () => {
    setTempDate(value || new Date());
    setShowPicker(false);
  };
  const generateCalendarDays = () => {
    const year = tempDate.getFullYear();
    const month = tempDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  const changeMonth = (direction) => {
    const newDate = new Date(tempDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setTempDate(newDate);
  };
  const selectDay = (day) => {
    if (!day) return;
    const newDate = new Date(tempDate);
    newDate.setDate(day);
    
    if (minDate && newDate < new Date(minDate)) return;
    if (maxDate && newDate > new Date(maxDate)) return;
    
    setTempDate(newDate);
  };
  const isSelectedDay = (day) => {
    if (!day) return false;
    return (
      tempDate.getDate() === day &&
      tempDate.getMonth() === new Date(tempDate).getMonth() &&
      tempDate.getFullYear() === new Date(tempDate).getFullYear()
    );
  };
  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === tempDate.getMonth() &&
      today.getFullYear() === tempDate.getFullYear()
    );
  };
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          error && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
        onPress={() => !disabled && setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="calendar-outline" 
          size={20} 
          color={value ? COLORS.primary : COLORS.gray} 
        />
        <Text style={[
          styles.inputText,
          !value && styles.placeholder
        ]}>
          {value ? formatShortDate(value) : placeholder}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={COLORS.gray} 
        />
      </TouchableOpacity>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      {/* Custom Date Picker Modal */}
      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Pilih Tanggal</Text>
              <TouchableOpacity onPress={handleCancel}>
                <Ionicons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
            </View>
            {/* Selected Date Display */}
            <View style={styles.selectedDateDisplay}>
              <Text style={styles.selectedDateText}>
                {formatDate(tempDate)}
              </Text>
            </View>
            {/* Month Navigation */}
            <View style={styles.monthNavigation}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => changeMonth(-1)}
              >
                <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.monthYearText}>
                {monthNames[tempDate.getMonth()]} {tempDate.getFullYear()}
              </Text>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => changeMonth(1)}
              >
                <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            {/* Day Names Header */}
            <View style={styles.dayNamesRow}>
              {dayNames.map((day, index) => (
                <Text key={index} style={styles.dayName}>{day}</Text>
              ))}
            </View>
            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    isSelectedDay(day) && styles.selectedDayCell,
                    isToday(day) && !isSelectedDay(day) && styles.todayCell,
                  ]}
                  onPress={() => selectDay(day)}
                  disabled={!day}
                >
                  <Text style={[
                    styles.dayText,
                    isSelectedDay(day) && styles.selectedDayText,
                    isToday(day) && !isSelectedDay(day) && styles.todayText,
                    !day && styles.emptyDay,
                  ]}>
                    {day || ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Pilih</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    gap: SIZES.small,
  },
  inputError: {
    borderColor: COLORS.secondary,
  },
  inputDisabled: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.7,
  },
  inputText: {
    flex: 1,
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.dark,
  },
  placeholder: {
    color: COLORS.gray,
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.large,
    width: '100%',
    maxWidth: 360,
    ...SHADOWS.medium,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  pickerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.dark,
  },
  selectedDateDisplay: {
    backgroundColor: COLORS.primaryLight,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.medium,
  },
  selectedDateText: {
    ...FONTS.semiBold,
    fontSize: SIZES.font,
    color: COLORS.primary,
    textAlign: 'center',
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  navButton: {
    padding: SIZES.small,
  },
  monthYearText: {
    ...FONTS.semiBold,
    fontSize: SIZES.medium,
    color: COLORS.dark,
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SIZES.small,
  },
  dayName: {
    ...FONTS.semiBold,
    fontSize: SIZES.small,
    color: COLORS.gray,
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayCell: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  todayCell: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
  },
  dayText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.dark,
  },
  selectedDayText: {
    color: COLORS.white,
    ...FONTS.semiBold,
  },
  todayText: {
    color: COLORS.primary,
    ...FONTS.semiBold,
  },
  emptyDay: {
    color: 'transparent',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SIZES.medium,
    marginTop: SIZES.large,
  },
  cancelButton: {
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.large,
  },
  cancelButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.large,
    borderRadius: SIZES.radius,
  },
  confirmButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.font,
    color: COLORS.white,
  },
});
export default DatePickerField;
