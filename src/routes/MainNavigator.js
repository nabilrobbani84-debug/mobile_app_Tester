// src/routes/MainNavigator.js
// Main app navigator with bottom tabs and stack screens
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES, SCREEN_TITLES } from '../utils/helpers/navigationHelpers';
import { COLORS, FONTS, SIZES, SHADOWS } from '../config/theme';
// Placeholder Screens (to be replaced with actual screens)
const PlaceholderScreen = ({ route }) => (
  <View style={styles.placeholder}>
    <Ionicons name="construct-outline" size={48} color={COLORS.gray} />
    <Text style={styles.placeholderText}>{route.name} Screen</Text>
    <Text style={styles.placeholderSubtext}>Coming Soon</Text>
  </View>
);
// Tab Screens
const HomeScreen = (props) => <PlaceholderScreen {...props} />;
const ReportsScreen = (props) => <PlaceholderScreen {...props} />;
const NotificationsScreen = (props) => <PlaceholderScreen {...props} />;
const ProfileScreen = (props) => <PlaceholderScreen {...props} />;
// Stack Screens
const ReportFormScreen = (props) => <PlaceholderScreen {...props} />;
const ReportDetailScreen = (props) => <PlaceholderScreen {...props} />;
const HealthTipDetailScreen = (props) => <PlaceholderScreen {...props} />;
const EditProfileScreen = (props) => <PlaceholderScreen {...props} />;
const SettingsScreen = (props) => <PlaceholderScreen {...props} />;
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
/**
 * Tab icon configuration
 */
const TAB_ICONS = {
  [ROUTES.HOME]: { active: 'home', inactive: 'home-outline' },
  [ROUTES.REPORTS]: { active: 'document-text', inactive: 'document-text-outline' },
  [ROUTES.NOTIFICATIONS]: { active: 'notifications', inactive: 'notifications-outline' },
  [ROUTES.PROFILE]: { active: 'person', inactive: 'person-outline' },
};
/**
 * Bottom Tab Navigator Component
 */
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={ROUTES.HOME}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name] || { active: 'ellipse', inactive: 'ellipse-outline' };
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarHideOnKeyboard: true,
        // Add badge for notifications
        tabBarBadge: route.name === ROUTES.NOTIFICATIONS ? 3 : undefined,
        tabBarBadgeStyle: styles.tabBarBadge,
      })}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Beranda',
        }}
      />
      <Tab.Screen
        name={ROUTES.REPORTS}
        component={ReportsScreen}
        options={{
          tabBarLabel: 'Laporan',
        }}
      />
      <Tab.Screen
        name={ROUTES.NOTIFICATIONS}
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Notifikasi',
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};
/**
 * MainNavigator - Combines bottom tabs with stack screens
 */
const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.MAIN}
      screenOptions={{
        headerShown: true,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: COLORS.dark,
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      {/* Main Tabs */}
      <Stack.Screen
        name={ROUTES.MAIN}
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      {/* Report Form Screen */}
      <Stack.Screen
        name={ROUTES.REPORT_FORM}
        component={ReportFormScreen}
        options={{
          title: 'Isi Laporan Konsumsi',
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerStyle: {
            backgroundColor: COLORS.white,
          },
        }}
      />
      {/* Report Detail Screen */}
      <Stack.Screen
        name={ROUTES.REPORT_DETAIL}
        component={ReportDetailScreen}
        options={({ route }) => ({
          title: 'Detail Laporan',
          headerRight: () => (
            <Ionicons
              name="share-outline"
              size={24}
              color={COLORS.dark}
              style={{ marginRight: SIZES.small }}
            />
          ),
        })}
      />
      {/* Health Tip Detail Screen */}
      <Stack.Screen
        name={ROUTES.HEALTH_TIP_DETAIL}
        component={HealthTipDetailScreen}
        options={({ route }) => ({
          title: 'Tips Kesehatan',
          headerTransparent: true,
          headerTintColor: COLORS.white,
          headerStyle: {
            backgroundColor: 'transparent',
          },
        })}
      />
      {/* Edit Profile Screen */}
      <Stack.Screen
        name={ROUTES.EDIT_PROFILE}
        component={EditProfileScreen}
        options={{
          title: 'Edit Profil',
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      {/* Settings Screen */}
      <Stack.Screen
        name={ROUTES.SETTINGS}
        component={SettingsScreen}
        options={{
          title: 'Pengaturan',
        }}
      />
    </Stack.Navigator>
  );
};
/**
 * Screen options for main navigator
 */
export const mainScreenOptions = {
  default: {
    headerShown: true,
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
    headerTintColor: COLORS.dark,
    headerBackTitleVisible: false,
  },
  modal: {
    presentation: 'modal',
    animation: 'slide_from_bottom',
    headerStyle: {
      backgroundColor: COLORS.white,
    },
  },
  transparent: {
    headerTransparent: true,
    headerTintColor: COLORS.white,
    headerStyle: {
      backgroundColor: 'transparent',
    },
  },
};
/**
 * Get tab bar visibility based on route
 */
export const getTabBarVisibility = (route) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.name;
  // Hide tab bar on these screens
  const hideOnScreens = [
    ROUTES.REPORT_FORM,
    ROUTES.REPORT_DETAIL,
    ROUTES.HEALTH_TIP_DETAIL,
    ROUTES.EDIT_PROFILE,
    ROUTES.SETTINGS,
  ];
  return !hideOnScreens.includes(routeName);
};
/**
 * Custom tab bar button for center action (e.g., Add Report)
 */
export const CenterTabButton = ({ onPress }) => (
  <View style={styles.centerButtonContainer}>
    <Ionicons
      name="add-circle"
      size={56}
      color={COLORS.primary}
      onPress={onPress}
    />
  </View>
);
const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    gap: SIZES.small,
  },
  placeholderText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: SIZES.medium,
  },
  placeholderSubtext: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  header: {
    backgroundColor: COLORS.white,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.dark,
  },
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.small,
    paddingBottom: Platform.OS === 'ios' ? SIZES.large : SIZES.small,
    height: Platform.OS === 'ios' ? 85 : 65,
    ...SHADOWS.small,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  tabBarItem: {
    paddingVertical: 4,
  },
  tabBarBadge: {
    backgroundColor: COLORS.secondary,
    fontSize: 10,
    fontWeight: 'bold',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
  },
  centerButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 10,
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 4,
    ...SHADOWS.medium,
  },
});
export default MainNavigator;
