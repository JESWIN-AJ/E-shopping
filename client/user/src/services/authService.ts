// src/services/authService.ts
import api from '@/api/axios';
import { ENDPOINTS } from '@/config/constants';
import type { AuthResponse, User } from '@/types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/login', { email, password });
    return res.data;
  },

  signup: async (data: {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/signup', data);
    return res.data;
  },

  logout: async (): Promise<{ status: boolean }> => {
    const res = await api.post<{ status: boolean }>(ENDPOINTS.LOGOUT);
    return res.data;
  },

  me: async (): Promise<{ status: boolean; user?: User }> => {
    const res = await api.get<{ status: boolean; user?: User }>(ENDPOINTS.ME);
    return res.data;
  },
};