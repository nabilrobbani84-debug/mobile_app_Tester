// src/state/index.js
// State Management Export
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
// Combined Provider for all contexts
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
// Export individual providers and hooks
export { AuthProvider, useAuth } from './AuthContext';
export default AppProviders;