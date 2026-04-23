import { apiFetch } from './client';
import type { User, Role } from '@/types';

export const usersApi = {
  getByRole: (role: Role) => apiFetch<User[]>(`/users/role/${role}`),
  getById: (id: number) => apiFetch<User>(`/users/${id}`),
};
