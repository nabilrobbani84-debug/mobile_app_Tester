// src/views/templates/MainTemplate.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../config/theme';
const { width, height } = Dimensions.get('window');
/**
 * MainTemplate - Primary layout template for authenticated screens
 * Provides consistent header, content area, and optional footer
 */
const MainTemplate = ({
  children,
  // Header Props
  title,
  subtitle,
  showHeader = true,
  headerLeft,
  headerRight,
  onBackPress,
  showBackButton = false,
  headerStyle,
  headerTitleStyle,
  // Content Props
  scrollable = true,
  refreshing = false,
  onRefresh,
  contentContainerStyle,
  contentStyle,
  // Footer Props
  footer,
  footerStyle,
  // Layout Props
  safeArea = true,
  statusBarStyle = 'dark-content',
  statusBarColor = COLORS.white,
  backgroundColor = COLORS.background,
  // Keyboard Props
  keyboardAvoidingEnabled = true,
  keyboardVerticalOffset = 0,
  // Loading State
  loading = false,
  loadingComponent,
}) => {
  const Container = safeArea ? SafeAreaView : View;
  const renderHeader = () => {
    if (!showHeader) return null;
    return (
      <View style={[styles.header, headerStyle]}>
        {/* Left Section */}
        <View style={styles.headerLeft}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackPress}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
            </TouchableOpacity>
          )}
          {headerLeft}
        </View>
        {/* Center Section - Title */}
        <View style={styles.headerCenter}>
          {title && (
            <Text 
              style={[styles.headerTitle, headerTitleStyle]} 
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        {/* Right Section */}
        <View style={styles.headerRight}>
          {headerRight}
        </View>
      </View>
    );
  };
  const renderContent = () => {
    if (loading && loadingComponent) {
      return loadingComponent;
    }
    if (scrollable) {
      return (
        <ScrollView
          style={[styles.scrollView, contentStyle]}
          contentContainerStyle={[
            styles.scrollContent,
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      );
    }
    return (
      <View style={[styles.contentView, contentStyle, contentContainerStyle]}>
        {children}
      </View>
    );
  };
  const renderFooter = () => {
    if (!footer) return null;
    return (
      <View style={[styles.footer, footerStyle]}>
        {footer}
      </View>
    );
  };
  const content = (
    <Container style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarColor}
      />
      
      {renderHeader()}
      
      <View style={styles.body}>
        {renderContent()}
      </View>
      
      {renderFooter()}
    </Container>
  );
  if (keyboardAvoidingEnabled && Platform.OS === 'ios') {
    return (
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }
  return content;
};
/**
 * DashboardTemplate - Specialized template for dashboard/home screen
 */
export const DashboardTemplate = ({
  children,
  userName,
  userAvatar,
  onNotificationPress,
  onProfilePress,
  notificationCount = 0,
  ...props
}) => {
  const headerLeft = (
    <TouchableOpacity 
      style={styles.avatarContainer}
      onPress={onProfilePress}
      activeOpacity={0.7}
    >
      {userAvatar ? (
        <Image source={{ uri: userAvatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {userName?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
  const headerRight = (
    <TouchableOpacity
      style={styles.notificationButton}
      onPress={onNotificationPress}
      activeOpacity={0.7}
    >
      <Ionicons name="notifications-outline" size={24} color={COLORS.dark} />
      {notificationCount > 0 && (
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>
            {notificationCount > 9 ? '9+' : notificationCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
  return (
    <MainTemplate
      showHeader
      title={`Hai, ${userName || 'Siswa'} 👋`}
      headerLeft={headerLeft}
      headerRight={headerRight}
      {...props}
    >
      {children}
    </MainTemplate>
  );
};
/**
 * FormTemplate - Template optimized for form screens
 */
export const FormTemplate = ({
  children,
  title,
  onBackPress,
  onSubmit,
  submitText = 'Simpan',
  submitDisabled = false,
  submitLoading = false,
  ...props
}) => {
  const footer = (
    <TouchableOpacity
      style={[
        styles.submitButton,
        submitDisabled && styles.submitButtonDisabled,
      ]}
      onPress={onSubmit}
      disabled={submitDisabled || submitLoading}
      activeOpacity={0.8}
    >
      {submitLoading ? (
        <Text style={styles.submitButtonText}>Loading...</Text>
      ) : (
        <Text style={styles.submitButtonText}>{submitText}</Text>
      )}
    </TouchableOpacity>
  );
  return (
    <MainTemplate
      showHeader
      showBackButton
      title={title}
      onBackPress={onBackPress}
      footer={footer}
      keyboardAvoidingEnabled
      {...props}
    >
      {children}
    </MainTemplate>
  );
};
/**
 * DetailTemplate - Template for detail/view screens
 */
export const DetailTemplate = ({
  children,
  title,
  onBackPress,
  actions,
  ...props
}) => {
  const headerRight = actions ? (
    <View style={styles.actionsContainer}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={styles.actionButton}
          onPress={action.onPress}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={action.icon} 
            size={22} 
            color={action.color || COLORS.dark} 
          />
        </TouchableOpacity>
      ))}
    </View>
  ) : null;
  return (
    <MainTemplate
      showHeader
      showBackButton
      title={title}
      onBackPress={onBackPress}
      headerRight={headerRight}
      {...props}
    >
      {children}
    </MainTemplate>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    minHeight: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.dark,
    textAlign: 'center',
  },
  headerSubtitle: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 2,
  },
  backButton: {
    padding: SIZES.small,
    marginLeft: -SIZES.small,
    marginRight: SIZES.small,
  },
  body: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.medium,
  },
  contentView: {
    flex: 1,
    padding: SIZES.medium,
  },
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.small,
  },
  // Dashboard specific styles
  avatarContainer: {
    marginRight: SIZES.small,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  notificationButton: {
    padding: SIZES.small,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    ...FONTS.bold,
    fontSize: 10,
    color: COLORS.white,
  },
  // Form specific styles
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.7,
  },
  submitButtonText: {
    ...FONTS.bold,
    fontSize: SIZES.font,
    color: COLORS.white,
  },
  // Detail specific styles
  actionsContainer: {
    flexDirection: 'row',
    gap: SIZES.small,
  },
  actionButton: {
    padding: SIZES.small,
  },
});
export default MainTemplate;