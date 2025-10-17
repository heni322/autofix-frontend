import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types';

// Backend runs on port 3000, API is at /api/v1
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Helper function to get token
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Try localStorage first
  let token = localStorage.getItem('accessToken');
  
  // If not found, try to get from auth-storage (Zustand persist)
  if (!token) {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        token = parsed.state?.accessToken || null;
      }
    } catch (error) {
      console.error('Failed to parse auth storage:', error);
    }
  }
  
  return token;
};

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding token to request:', token.substring(0, 20) + '...');
    } else {
      console.log('No token found for request');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config;

    // Handle 401 errors - token expired or invalid
    if (error.response?.status === 401 && originalRequest) {
      console.error('401 Unauthorized - clearing auth and redirecting');
      
      if (typeof window !== 'undefined') {
        // Clear all auth data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('auth-storage');
        
        // Redirect to sign in with return URL
        const currentPath = window.location.pathname;
        const redirectUrl = `/auth/signin?redirect=${encodeURIComponent(currentPath)}`;
        window.location.href = redirectUrl;
      }
    }

    // Format error for consistent handling
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
