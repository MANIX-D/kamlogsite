import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    // Supprimer Content-Type si FormData (le navigateur le gère avec le bon boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // Injecter le token Bearer uniquement sur les routes admin
    const isAdminRoute = config.url?.includes('/admin/') || config.url?.startsWith('admin/');
    if (isAdminRoute) {
      const token = sessionStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    const currentLanguage = localStorage.getItem('i18nextLng') || 'fr';
    config.headers['Accept-Language'] = currentLanguage;

    // Don't set Content-Type for FormData - let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

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
      // Nettoyer la session
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('auth_token_expiry');
      sessionStorage.removeItem('user_permissions');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      // Rediriger vers le login si on est sur une page admin
      if (
        window.location.pathname.startsWith('/admin') &&
        !window.location.pathname.includes('/admin/login')
      ) {
        window.location.href = '/admin/login';
      }
    }

    if (error.response?.status === 403) {
      // Déclencher un événement global pour afficher un toast
      window.dispatchEvent(new CustomEvent('kamlog:forbidden', {
        detail: {
          message: error.response?.data?.message || 'Accès refusé : permissions insuffisantes.',
        },
      }));
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
  // Si data est FormData et contient _method=PUT, utiliser POST au lieu de PUT
  if (data instanceof FormData && data.get('_method') === 'PUT') {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  }
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
};

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
};
