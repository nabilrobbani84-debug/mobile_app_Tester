// src/state/AuthContext.js
// Authentication Context for managing user authentication state
import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { saveAuthToken, saveUserData, clearUserSession, getAuthToken, getUserData } from '../utils/helpers/storageHelpers';
// Initial state
const initialState = {
  isAuthenticated: false,
  isLoading: false,
  token: null,
  user: null,
  error: null,
};
// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  RESTORE_SESSION: 'RESTORE_SESSION',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
};
// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        token: null,
        user: null,
        error: action.payload,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };
    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};
// Create context
const AuthContext = createContext(null);
// Mock API for login
const mockLoginAPI = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const { nisn, schoolId } = credentials;
  
  // Mock validation
  if (nisn === '0110222079' && schoolId === 'SMPN1JKT') {
    return {
      success: true,
      data: {
        token: 'jwt_siswa_token_' + Date.now(),
        user: {
          id: '20231001',
          name: 'Aisyah Putri',
          nisn: '0110222079',
          email: 'aisyah@email.com',
          phone: '081234567890',
          schoolId: 'SMPN1JKT',
          schoolName: 'SMPN 1 Jakarta',
          className: 'IX-A',
          hbLast: 12.5,
          consumptionCount: 8,
          totalTarget: 48,
          height: 165,
          weight: 52,
          birthDate: '2009-05-15',
          gender: 'female',
          bloodType: 'O',
          avatar: null,
          createdAt: '2023-07-01T00:00:00Z',
        },
      },
    };
  }
  
  // Invalid credentials
  return {
    success: false,
    error: 'NISN atau ID Sekolah tidak valid',
  };
};
// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  // Login function
  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await mockLoginAPI(credentials);
      
      if (response.success) {
        const { token, user } = response.data;
        
        // Save to storage
        await saveAuthToken(token);
        await saveUserData(user);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { token, user },
        });
        
        return { success: true, user };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.error,
        });
        
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Terjadi kesalahan saat login';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  }, []);
  // Logout function
  const logout = useCallback(async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      await clearUserSession();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true };
    }
  }, []);
  // Restore session function
  const restoreSession = useCallback(async (token, user) => {
    if (token && user) {
      dispatch({
        type: AUTH_ACTIONS.RESTORE_SESSION,
        payload: { token, user },
      });
      return true;
    }
    
    // Try to get from storage
    try {
      const storedToken = await getAuthToken();
      const storedUser = await getUserData();
      
      if (storedToken && storedUser) {
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SESSION,
          payload: { token: storedToken, user: storedUser },
        });
        return true;
      }
    } catch (error) {
      console.error('Restore session error:', error);
    }
    
    return false;
  }, []);
  // Update user data
  const updateUser = useCallback(async (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData,
    });
    
    // Update storage
    const currentUser = state.user;
    if (currentUser) {
      await saveUserData({ ...currentUser, ...userData });
    }
  }, [state.user]);
  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);
  // Memoized value
  const value = useMemo(() => ({
    // State
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    token: state.token,
    user: state.user,
    error: state.error,
    
    // Actions
    login,
    logout,
    restoreSession,
    updateUser,
    clearError,
  }), [
    state.isAuthenticated,
    state.isLoading,
    state.token,
    state.user,
    state.error,
    login,
    logout,
    restoreSession,
    updateUser,
    clearError,
  ]);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
// Export for testing
export { AUTH_ACTIONS, authReducer, initialState };
export default AuthContext;