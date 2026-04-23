import { apiFetch } from './client';
import type { LoginResponse } from '@/types';

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  signup: (name: string, email: string, password: string) =>
    apiFetch<LoginResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role: 'TENANT' }),
    }),
};
