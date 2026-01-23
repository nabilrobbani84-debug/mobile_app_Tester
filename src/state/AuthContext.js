import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
// Imports from your storage helper utility
import {
    clearUserSession,
    getAuthToken,
    getUserData,
    saveAuthToken,
    saveUserData
} from '../utils/helpers/storageHelpers';

// Initial state
const initialState = {
  isAuthenticated: false,
  isLoading: true, // Default true to wait for storage check
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
  STOP_LOADING: 'STOP_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return { ...state, isLoading: true, error: null };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return { 
        ...state, 
        isAuthenticated: true, 
        isLoading: false, 
        token: action.payload.token, 
        user: action.payload.user, 
        error: null 
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return { 
        ...state, 
        isAuthenticated: false, 
        isLoading: false, 
        error: action.payload 
      };
    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState, isLoading: false };
    case AUTH_ACTIONS.RESTORE_SESSION:
      return { 
        ...state, 
        isAuthenticated: true, 
        isLoading: false, 
        token: action.payload.token, 
        user: action.payload.user 
      };
    case AUTH_ACTIONS.STOP_LOADING:
      return { ...state, isLoading: false };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext(null);

// Mock API removed in favor of services/api/auth.api.js
import { AuthAPI } from '../services/api/auth.api';

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize: Check for login session on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await getAuthToken();
        const storedUser = await getUserData();

        if (storedToken && storedUser) {
          dispatch({
            type: AUTH_ACTIONS.RESTORE_SESSION,
            payload: { token: storedToken, user: storedUser },
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.STOP_LOADING });
        }
      } catch (e) {
        console.error('Restore session failed:', e);
        dispatch({ type: AUTH_ACTIONS.STOP_LOADING });
      }
    };

    bootstrapAsync();
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      // Use standard AuthAPI which handles Real/Mock switching based on config
      const response = await AuthAPI.loginSiswa(credentials);
      
      if (response && (response.success || response.token)) {
        // Normalize response data
        const token = response.token || response.data?.token;
        const user = response.user || response.data?.user;
        
        // Save to device storage
        await saveAuthToken(token);
        await saveUserData(user);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { token, user },
        });
        return { success: true };
      } else {
        const errorMessage = response.message || response.error || 'Login gagal';
        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_FAILURE, 
          payload: errorMessage
        });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage = error.userMessage || error.message || 'Terjadi kesalahan jaringan';
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_FAILURE, 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await clearUserSession(); // Clear from device storage
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = useMemo(() => ({
    ...state,
    login,
    logout,
    clearError
  }), [state, login, logout, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;