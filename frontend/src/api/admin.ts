import { apiFetch } from './client';
import type { AnalyticsResponse, TechnicianWorkload } from '@/types';

export const adminApi = {
  getAnalytics: () => apiFetch<AnalyticsResponse>('/admin/analytics'),
  getTechnicians: () => apiFetch<TechnicianWorkload[]>('/admin/technicians'),
};
