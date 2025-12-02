import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import { 
  saveAuthToken, 
  saveUserData, 
  clearUserSession, 
  getAuthToken, 
  getUserData 
} from '../utils/helpers/storageHelpers';

// Initial state
const initialState = {
  isAuthenticated: false,
  isLoading: true, // Default true agar aplikasi menunggu cek storage
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

// Mock API yang lebih detail
const mockLoginAPI = async ({ nisn, schoolId }) => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Delay simulasi
  
  // Validasi Hardcode untuk Demo
  if (nisn === '0110222079' && schoolId === 'SMPN1JKT') {
    return {
      success: true,
      data: {
        token: 'dummy-jwt-token-' + Date.now(),
        user: {
          id: 'u123',
          name: 'Nabil Robbani',
          role: 'student',
          nisn: nisn,
          schoolId: schoolId,
          email: 'nabil@example.com',
          avatar: 'https://i.pravatar.cc/150?u=nabil'
        },
      },
    };
  }
  
  return { 
    success: false, 
    error: 'NISN atau ID Sekolah tidak ditemukan. Coba: 0110222079 / SMPN1JKT' 
  };
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Inisialisasi: Cek Login saat aplikasi dibuka
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
      const response = await mockLoginAPI(credentials);
      
      if (response.success) {
        // Simpan ke storage HP
        await saveAuthToken(response.data.token);
        await saveUserData(response.data.user);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { token: response.data.token, user: response.data.user },
        });
        return { success: true };
      } else {
        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_FAILURE, 
          payload: response.error 
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_FAILURE, 
        payload: 'Terjadi kesalahan jaringan' 
      });
      return { success: false, error: 'Network Error' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await clearUserSession(); // Hapus dari storage HP
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