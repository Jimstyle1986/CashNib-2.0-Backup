import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { store } from '../store';
import { logout, refreshToken } from '../store/slices/authSlice';
import { setNetworkStatus } from '../store/slices/uiSlice';
import { showToast } from '../utils/toast';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://api.cashnib.com/api';

const API_TIMEOUT = 30000; // 30 seconds

// Storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

class ApiService {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Add auth token if available
        const token = await this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Set network status to loading
        store.dispatch(setNetworkStatus({ isOnline: true, isLoading: true }));

        return config;
      },
      (error) => {
        store.dispatch(setNetworkStatus({ isOnline: false, isLoading: false }));
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Set network status to success
        store.dispatch(setNetworkStatus({ isOnline: true, isLoading: false }));
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Set network status to error
        store.dispatch(setNetworkStatus({ isOnline: false, isLoading: false }));

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.axiosInstance(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshTokenValue = await this.getRefreshToken();
            if (refreshTokenValue) {
              const response = await this.axiosInstance.post('/auth/refresh', {
                refreshToken: refreshTokenValue,
              });

              const { accessToken, refreshToken: newRefreshToken } = response.data;
              await this.setAccessToken(accessToken);
              await this.setRefreshToken(newRefreshToken);

              // Update Redux store
              store.dispatch(refreshToken({ accessToken, refreshToken: newRefreshToken }));

              // Process queued requests
              this.processQueue(null, accessToken);

              // Retry original request
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            this.processQueue(refreshError, null);
            await this.clearTokens();
            store.dispatch(logout());
            showToast('Session expired. Please login again.', 'error');
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  private handleApiError(error: any) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          showToast(data.message || 'Bad request', 'error');
          break;
        case 403:
          showToast('Access forbidden', 'error');
          break;
        case 404:
          showToast('Resource not found', 'error');
          break;
        case 422:
          showToast(data.message || 'Validation error', 'error');
          break;
        case 500:
          showToast('Server error. Please try again later.', 'error');
          break;
        default:
          showToast(data.message || 'An error occurred', 'error');
      }
    } else if (error.request) {
      // Network error
      showToast('Network error. Please check your connection.', 'error');
    } else {
      // Other error
      showToast('An unexpected error occurred', 'error');
    }
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // Token management methods
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  async setAccessToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting access token:', error);
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  async setRefreshToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting refresh token:', error);
    }
  }

  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  // HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // File upload
  async uploadFile<T = any>(
    url: string,
    file: any,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.axiosInstance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });

    return response.data;
  }

  // File download
  async downloadFile(
    url: string,
    onDownloadProgress?: (progressEvent: any) => void
  ): Promise<Blob> {
    const response = await this.axiosInstance.get(url, {
      responseType: 'blob',
      onDownloadProgress,
    });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get('/health');
  }

  // Utility methods
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  updateBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  addHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }

  setTimeout(timeout: number): void {
    this.axiosInstance.defaults.timeout = timeout;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

// Export types
export type { AxiosRequestConfig, AxiosResponse };