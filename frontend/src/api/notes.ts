import { apiFetch } from './client';
import type { RequestNote, AddNotePayload } from '@/types';

export const notesApi = {
  getByRequest: (requestId: number) =>
    apiFetch<RequestNote[]>(`/requests/${requestId}/notes`),

  add: (requestId: number, payload: AddNotePayload) =>
    apiFetch<RequestNote>(`/requests/${requestId}/notes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
