import api from './api';
import { User, LoginCredentials, SignupCredentials } from '../types/auth.types';

// ─────────────────────────────────────────────────────────────────────────────
// Auth Service — NO mock fallbacks. All errors are thrown to the caller.
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
}

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<{ user: User }>('/auth/me');
      return response.data.user ?? null;
    } catch {
      return null;
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async signup(data: SignupCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Google OAuth — redirects browser to backend OAuth flow
  googleLogin(): void {
    const backendUrl = (import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:5000/api')
      .replace('/api', '');
    window.location.href = `${backendUrl}/api/auth/google`;
  },

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>('/auth/verify-email', { token });
    return response.data;
  },

  async resendVerification(email: string): Promise<{ success: boolean }> {
    const res = await api.post<{ success: boolean }>('/auth/resend-verification', { email });
    return res.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/reset-password', { token, password });
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  async updateProfile(data: { name: string; avatarUrl?: string }): Promise<User> {
    const response = await api.patch<{ user: User }>('/auth/profile', data);
    return response.data.user;
  },

  async changePassword(passwords: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.post('/auth/change-password', passwords);
  },

  async deleteAccount(): Promise<void> {
    await api.delete('/auth/profile');
    localStorage.removeItem('token');
  },
};
