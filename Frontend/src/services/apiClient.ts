import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    // Read token from sessionStorage (avoids circular import with auth.ts)
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const currentLanguage = localStorage.getItem('i18nextLng') || 'fr';
    config.headers['Accept-Language'] = currentLanguage;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all session data
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('auth_token_expiry');
      // Also clean up old localStorage entries
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      // Only redirect if we're on an admin page (avoid redirect loops)
      if (window.location.pathname.startsWith('/admin') && 
          !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }

    if (error.response?.status === 403) {
      console.warn('Access denied: insufficient permissions');
    }

    return Promise.reject(error);
  }
);

export default apiClient;

export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.get<T>(url, config);
  return response.data;
};

export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
};

export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
};

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
};
