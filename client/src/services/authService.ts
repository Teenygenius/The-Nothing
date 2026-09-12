import { request } from './api';
import { User } from '../types';

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: User;
}

export const authService = {
  register: async (data: { name: string; email: string; password: string; confirmPassword?: string }) => {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: { email: string; password: string }) => {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMe: async () => {
    return request<{ success: boolean; user: User }>('/auth/me');
  },

  updateProfile: async (data: { name?: string; avatar?: string; settings?: any }) => {
    return request<{ success: boolean; message: string; user: User }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updatePassword: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    return request<{ success: boolean; message: string }>('/users/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteAccount: async () => {
    return request<{ success: boolean; message: string }>('/users/account', {
      method: 'DELETE',
    });
  },
};
