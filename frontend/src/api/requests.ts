import { apiFetch } from './client';
import type { MaintenanceRequest, CreateRequestPayload } from '@/types';

export const requestsApi = {
  getAll: () => apiFetch<MaintenanceRequest[]>('/requests'),

  getById: (id: number) => apiFetch<MaintenanceRequest>(`/requests/${id}`),

  getByTenant: (tenantId: number) =>
    apiFetch<MaintenanceRequest[]>(`/requests/tenant/${tenantId}`),

  getByStaff: (staffId: number) =>
    apiFetch<MaintenanceRequest[]>(`/requests/staff/${staffId}`),

  create: (payload: CreateRequestPayload) =>
    apiFetch<MaintenanceRequest>('/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateStatus: (id: number, status: string) =>
    apiFetch<MaintenanceRequest>(`/requests/${id}/status?status=${status}`, {
      method: 'POST',
    }),

  assign: (id: number, staffId: number) =>
    apiFetch<MaintenanceRequest>(`/requests/${id}/assign?staffId=${staffId}`, {
      method: 'POST',
    }),

  updatePriority: (id: number, priority: string) =>
    apiFetch<MaintenanceRequest>(`/requests/${id}/priority?priority=${priority}`, {
      method: 'POST',
    }),

  reopen: (id: number) =>
    apiFetch<MaintenanceRequest>(`/requests/${id}/reopen`, { method: 'POST' }),

  cancel: (id: number) =>
    apiFetch<MaintenanceRequest>(`/requests/${id}/cancel`, { method: 'POST' }),
};
