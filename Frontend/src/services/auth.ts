import { post, get } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  phone: string | null;
}

export interface BackendLoginResponse {
  success: boolean;
  message: string;
  data: {
    admin: AdminUser;
    token: string;
    abilities: string[];
  };
}

export interface BackendMeResponse {
  success: boolean;
  data: AdminUser;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await post<BackendLoginResponse>(API_ENDPOINTS.admin.login, credentials);
    const { token, admin } = response.data;
    this.setToken(token);
    this.setUser(admin);
    return { token, user: admin };
  },

  async logout(): Promise<void> {
    try {
      await post(API_ENDPOINTS.admin.logout);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  async getAuthenticatedUser(): Promise<AdminUser> {
    const response = await get<BackendMeResponse>(API_ENDPOINTS.admin.me);
    return response.data;
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setUser(user: AdminUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser(): AdminUser | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
