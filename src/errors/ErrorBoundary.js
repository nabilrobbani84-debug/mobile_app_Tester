// src/errors/ErrorBoundary.js
// React Error Boundary Component
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Platform, // FIX 1: Tambahkan Import Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { handleBoundaryError } from './ErrorHandler';
// FIX 2: Sesuaikan path import theme.
// Dari 'src/errors' mundur 2 langkah ke root, lalu ke 'constants/theme'
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme'; 

/**
 * Error Boundary Component
 * Catches JavaScript errors in child component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when error is caught
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Log error information
   */
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // Handle and log the error
    handleBoundaryError(error, errorInfo);

    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset error state
   */
  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call onReset prop if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { 
      children, 
      fallback, 
      FallbackComponent,
      showDetails = __DEV__,
    } = this.props;

    if (hasError) {
      // Custom fallback component
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={error}
            errorInfo={errorInfo}
            resetError={this.resetError}
          />
        );
      }

      // Custom fallback element
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <DefaultErrorFallback
          error={error}
          errorInfo={errorInfo}
          resetError={this.resetError}
          showDetails={showDetails}
        />
      );
    }

    return children;
  }
}

/**
 * Default Error Fallback Component
 */
const DefaultErrorFallback = ({ error, errorInfo, resetError, showDetails }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Error Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="warning" size={64} color={COLORS.secondary} />
          </View>
        </View>

        {/* Error Title */}
        <Text style={styles.title}>Oops! Terjadi Kesalahan</Text>
        
        {/* Error Message */}
        <Text style={styles.message}>
          Aplikasi mengalami masalah yang tidak terduga. 
          Silakan coba lagi atau hubungi dukungan jika masalah berlanjut.
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={resetError}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color={COLORS.white} />
            <Text style={styles.primaryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              // Could navigate to home or restart app
              resetError();
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="home" size={20} color={COLORS.primary} />
            <Text style={styles.secondaryButtonText}>Ke Beranda</Text>
          </TouchableOpacity>
        </View>

        {/* Error Details (Development Only) */}
        {showDetails && error && (
          <View style={styles.detailsContainer}>
            <TouchableOpacity 
              style={styles.detailsHeader}
              onPress={() => {}}
            >
              <Ionicons name="code-slash" size={18} color={COLORS.gray} />
              <Text style={styles.detailsTitle}>Detail Error (Development)</Text>
            </TouchableOpacity>

            <View style={styles.errorBox}>
              <Text style={styles.errorName}>{error.name}</Text>
              <Text style={styles.errorMessage}>{error.message}</Text>
              
              {error.stack && (
                <ScrollView 
                  horizontal 
                  style={styles.stackContainer}
                  showsHorizontalScrollIndicator={false}
                >
                  <Text style={styles.stackTrace}>
                    {error.stack}
                  </Text>
                </ScrollView>
              )}
            </View>

            {errorInfo?.componentStack && (
              <View style={styles.errorBox}>
                <Text style={styles.errorName}>Component Stack</Text>
                <ScrollView 
                  horizontal
                  style={styles.stackContainer}
                  showsHorizontalScrollIndicator={false}
                >
                  <Text style={styles.stackTrace}>
                    {errorInfo.componentStack}
                  </Text>
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {/* Support Contact */}
        <View style={styles.supportContainer}>
          <Text style={styles.supportText}>
            Butuh bantuan? Hubungi support@modiva.app
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Minimal Error Fallback for smaller sections
 */
export const MinimalErrorFallback = ({ error, resetError, message }) => {
  return (
    <View style={styles.minimalContainer}>
      <Ionicons name="alert-circle" size={32} color={COLORS.secondary} />
      <Text style={styles.minimalMessage}>
        {message || 'Gagal memuat konten'}
      </Text>
      <TouchableOpacity
        style={styles.minimalButton}
        onPress={resetError}
      >
        <Text style={styles.minimalButtonText}>Coba Lagi</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Card Error Fallback for card components
 */
export const CardErrorFallback = ({ resetError, height = 150 }) => {
  return (
    <View style={[styles.cardError, { height }]}>
      <Ionicons name="cloud-offline" size={24} color={COLORS.gray} />
      <Text style={styles.cardErrorText}>Gagal memuat</Text>
      <TouchableOpacity onPress={resetError}>
        <Text style={styles.cardRetryText}>Muat ulang</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * HOC to wrap component with error boundary
 * @param {Component} WrappedComponent - Component to wrap
 * @param {object} errorBoundaryProps - Error boundary props
 * @returns {Component} Wrapped component
 */
export const withErrorBoundary = (WrappedComponent, errorBoundaryProps = {}) => {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const WithErrorBoundary = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  return WithErrorBoundary;
};

/**
 * Hook alternative for functional components
 * Note: This is a workaround since hooks can't catch errors like class boundaries
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((err) => {
    setError(err);
  }, []);

  return { error, handleError, resetError };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.extraLarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: SIZES.extraLarge,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${COLORS.secondary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  message: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SIZES.extraLarge,
    paddingHorizontal: SIZES.medium,
  },
  buttonContainer: {
    width: '100%',
    gap: SIZES.medium,
    marginBottom: SIZES.extraLarge,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radius,
    gap: SIZES.small,
    ...SHADOWS.small,
  },
  primaryButtonText: {
    ...FONTS.bold,
    fontSize: SIZES.font,
    color: COLORS.white,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: SIZES.small,
  },
  secondaryButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.font,
    color: COLORS.primary,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
    marginBottom: SIZES.large,
    ...SHADOWS.small,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small,
    marginBottom: SIZES.medium,
  },
  detailsTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  errorBox: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius / 2,
    padding: SIZES.small,
    marginBottom: SIZES.small,
  },
  errorName: {
    ...FONTS.semiBold,
    fontSize: SIZES.small,
    color: COLORS.secondary,
    marginBottom: 4,
  },
  errorMessage: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.dark,
    marginBottom: SIZES.small,
  },
  stackContainer: {
    maxHeight: 100,
  },
  stackTrace: {
    ...FONTS.regular,
    fontSize: 10,
    color: COLORS.gray,
    // FIX 1: Platform sekarang sudah didefinisikan
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
  },
  supportContainer: {
    marginTop: SIZES.medium,
  },
  supportText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
  },
  // Minimal Fallback Styles
  minimalContainer: {
    padding: SIZES.large,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.small,
  },
  minimalMessage: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
  },
  minimalButton: {
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
  },
  minimalButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.font,
    color: COLORS.primary,
  },
  // Card Error Styles
  cardError: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.small,
  },
  cardErrorText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  cardRetryText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.primary,
  },
});

export default ErrorBoundary;