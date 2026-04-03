import { post, get } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';
const PERMISSIONS_KEY = 'user_permissions';

// Token stored in memory for better security (not accessible via XSS on storage)
let inMemoryToken: string | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

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
    permissions: Record<string, { read: boolean; write: boolean; delete: boolean }>;
  };
}

export interface BackendMeResponse {
  success: boolean;
  data: AdminUser;
}

export interface BackendRefreshResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    abilities: string[];
  };
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await post<BackendLoginResponse>(API_ENDPOINTS.admin.login, credentials);
    const { token, admin, permissions } = response.data;
    this.setToken(token);
    this.setUser(admin);
    this.setPermissions(permissions || {});
    this.setTokenExpiry();
    this.scheduleTokenRefresh();
    return { token, user: admin };
  },

  async logout(): Promise<void> {
    try {
      await post(API_ENDPOINTS.admin.logout);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearSession();
    }
  },

  async getAuthenticatedUser(): Promise<AdminUser> {
    const response = await get<BackendMeResponse>(API_ENDPOINTS.admin.me);
    return response.data;
  },

  /**
   * Validate token with the server — used by ProtectedRoute
   */
  async validateToken(): Promise<boolean> {
    try {
      await this.getAuthenticatedUser();
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Proactively refresh the token before it expires
   */
  async refreshToken(): Promise<boolean> {
    try {
      const response = await post<BackendRefreshResponse>(API_ENDPOINTS.admin.refresh, {});
      const { token } = response.data;
      this.setToken(token);
      this.setTokenExpiry();
      this.scheduleTokenRefresh();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearSession();
      window.location.href = '/admin/login';
      return false;
    }
  },

  /**
   * Schedule a token refresh 5 minutes before expiry
   */
  scheduleTokenRefresh(): void {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }

    const expiry = this.getTokenExpiry();
    if (!expiry) return;

    const now = Date.now();
    // Refresh 5 minutes before expiry
    const refreshAt = expiry - 5 * 60 * 1000;
    const delay = refreshAt - now;

    if (delay <= 0) {
      // Token already expired or about to expire, refresh now
      this.refreshToken();
      return;
    }

    refreshTimer = setTimeout(() => {
      this.refreshToken();
    }, delay);
  },

  // ---- Token Management ----

  setToken(token: string): void {
    inMemoryToken = token;
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    // Prefer in-memory token, fallback to sessionStorage
    if (inMemoryToken) return inMemoryToken;
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (stored) {
      inMemoryToken = stored; // Restore to memory
    }
    return stored;
  },

  setTokenExpiry(): void {
    // Token expires in 24 hours (matches backend config)
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
  },

  getTokenExpiry(): number | null {
    const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  },

  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    return Date.now() >= expiry;
  },

  // ---- User Management ----

  setUser(user: AdminUser): void {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser(): AdminUser | null {
    const user = sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // ---- Permissions Management ----

  setPermissions(permissions: Record<string, { read: boolean; write: boolean; delete: boolean }>): void {
    sessionStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
  },

  getPermissions(): Record<string, { read: boolean; write: boolean; delete: boolean }> {
    const perms = sessionStorage.getItem(PERMISSIONS_KEY);
    return perms ? JSON.parse(perms) : {};
  },

  /**
   * Check if the current user has a specific permission for a section.
   * super_admin and admin always have full access (their permissions object contains all sections).
   * Editors only have permissions for their assigned sections.
   */
  hasPermission(section: string, action: 'read' | 'write' | 'delete' = 'read'): boolean {
    const user = this.getUser();
    if (!user) return false;

    // super_admin and admin always have full access
    if (user.role === 'super_admin' || user.role === 'admin') {
      return true;
    }

    const perms = this.getPermissions();
    const sectionPerm = perms[section];
    if (!sectionPerm) return false;

    return sectionPerm[action] === true;
  },

  // ---- Session Management ----

  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  },

  clearSession(): void {
    inMemoryToken = null;
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    sessionStorage.removeItem(PERMISSIONS_KEY);
    // Also clean up old localStorage entries (migration)
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Initialize auth on app load (restore session from sessionStorage)
   */
  initializeAuth(): void {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token && !this.isTokenExpired()) {
      inMemoryToken = token;
      this.scheduleTokenRefresh();
    } else if (token) {
      // Token exists but is expired
      this.clearSession();
    }
  },
};

// Initialize auth on module load
authService.initializeAuth();
