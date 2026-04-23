import { apiFetch } from './client';
import type { Notification } from '@/types';

export const notificationsApi = {
  getByUser: (userId: number) =>
    apiFetch<Notification[]>(`/notifications/user/${userId}`),

  markRead: (id: number) =>
    apiFetch<void>(`/notifications/${id}/read`, { method: 'POST' }),

  markAllRead: (userId: number) =>
    apiFetch<void>(`/notifications/read-all/${userId}`, { method: 'POST' }),
};
