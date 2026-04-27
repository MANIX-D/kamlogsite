import { post, get, put } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

// Token en mémoire — non accessible via XSS
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
  role: 'super_admin' | 'admin';
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
    const { token, admin } = response.data;
    this.setToken(token);
    this.setUser(admin);
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
   * Valider le token côté serveur — utilisé par ProtectedRoute
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
   * Rafraîchir le token proactivement avant expiration
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
   * Planifier un refresh 5 minutes avant l'expiration
   */
  scheduleTokenRefresh(): void {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }

    const expiry = this.getTokenExpiry();
    if (!expiry) return;

    const now = Date.now();
    const refreshAt = expiry - 5 * 60 * 1000;
    const delay = refreshAt - now;

    if (delay <= 0) {
      this.refreshToken();
      return;
    }

    refreshTimer = setTimeout(() => {
      this.refreshToken();
    }, delay);
  },

  // ── Token ────────────────────────────────────────────────

  setToken(token: string): void {
    inMemoryToken = token;
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    if (inMemoryToken) return inMemoryToken;
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      inMemoryToken = stored;
    }
    return stored;
  },

  setTokenExpiry(): void {
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
  },

  getTokenExpiry(): number | null {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  },

  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    return Date.now() >= expiry;
  },

  // ── Utilisateur ─────────────────────────────────────────

  setUser(user: AdminUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser(): AdminUser | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Mettre à jour partiellement les données du user en session
   */
  updateUser(partial: Partial<AdminUser>): void {
    const current = this.getUser();
    if (!current) return;
    const updated = { ...current, ...partial };
    this.setUser(updated);
    inMemoryToken = inMemoryToken; // keep in memory
  },

  // ── Session ──────────────────────────────────────────────

  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  },

  clearSession(): void {
    inMemoryToken = null;
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    // Migration : nettoyer l'ancien sessionStorage
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  /**
   * Initialiser l'auth au chargement de l'app
   */
  initializeAuth(): void {
    // Migration : déplacer depuis sessionStorage si existant
    const sessionToken = sessionStorage.getItem(TOKEN_KEY);
    if (sessionToken) {
      localStorage.setItem(TOKEN_KEY, sessionToken);
      sessionStorage.removeItem(TOKEN_KEY);
      const sessionExpiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
      if (sessionExpiry) {
        localStorage.setItem(TOKEN_EXPIRY_KEY, sessionExpiry);
        sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
      }
      const sessionUser = sessionStorage.getItem(USER_KEY);
      if (sessionUser) {
        localStorage.setItem(USER_KEY, sessionUser);
        sessionStorage.removeItem(USER_KEY);
      }
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (token && !this.isTokenExpired()) {
      inMemoryToken = token;
      this.scheduleTokenRefresh();
    } else if (token) {
      this.clearSession();
    }
  },
};

// Initialiser au chargement du module
authService.initializeAuth();
