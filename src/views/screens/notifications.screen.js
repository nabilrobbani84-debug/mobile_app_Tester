import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// --- Constants & Theme ---
const COLORS = {
  background: '#FDFDFD',
  textPrimary: '#1A1A1A',
  textSecondary: '#6ECCA9',
  iconBackground: '#EBF6F2',
  iconColor: '#2D3436',
};

// --- Mock Data ---
const NOTIFICATIONS_DATA = [
  {
    id: '1',
    title: 'Vitamin Intake Reminder',
    time: 'Today, 10:00 AM',
    type: 'reminder', 
  },
  {
    id: '2',
    title: 'Motivational Message',
    time: 'Yesterday, 2:30 PM',
    type: 'message', 
  },
  {
    id: '3',
    title: 'Vitamin Intake Reminder',
    time: '2 days ago, 9:15 AM',
    type: 'reminder',
  },
  {
    id: '4',
    title: 'Motivational Message',
    time: '3 days ago, 11:45 AM',
    type: 'message',
  },
  {
    id: '5',
    title: 'Vitamin Intake Reminder',
    time: '4 days ago, 1:00 PM',
    type: 'reminder',
  },
  {
    id: '6',
    title: 'Health Checkup',
    time: 'Last week, 09:00 AM',
    type: 'reminder',
  },
];

// --- Components ---

const Header = () => {
  const router = useRouter();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => {
            if (router.canGoBack()) {
                router.back();
            }
        }}
      >
        <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Notifications</Text>
      
      <View style={{ width: 40 }} /> 
    </View>
  );
};

const NotificationItem = ({ item }) => {
  const getIcon = () => {
    if (item.type === 'message') {
      return <Feather name="heart" size={22} color={COLORS.iconColor} />;
    }
    return <Feather name="bell" size={22} color={COLORS.iconColor} />;
  };

  return (
    <TouchableOpacity style={styles.itemContainer} activeOpacity={0.7}>
      <View style={styles.iconBox}>
        {getIcon()}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemTime}>{item.time}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
    </TouchableOpacity>
  );
};

// --- Main Screen ---

const NotificationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header />
      <View style={styles.contentContainer}>
        <FlatList
          data={NOTIFICATIONS_DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  itemTime: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

export default NotificationScreen;