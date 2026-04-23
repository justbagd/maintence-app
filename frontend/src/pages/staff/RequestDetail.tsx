import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';
import { ArrowLeft } from 'lucide-react';
import { requestsApi } from '@/api/requests';
import { notesApi } from '@/api/notes';
import { useAuth } from '@/contexts/AuthContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityLabel } from '@/components/shared/PriorityLabel';
import { NotesList } from '@/components/shared/NotesList';
import { fmtDate, fmtReqId } from '@/lib/formatters';
import { toast } from 'sonner';
import type { MaintenanceRequest, RequestNote } from '@/types';

export default function StaffRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState<MaintenanceRequest | null>(null);
  const [notesList, setNotesList] = useState<RequestNote[]>([]);
  const [noteText, setNoteText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  usePageTitle('Request Detail');
  const requestId = Number(id);

  const load = useCallback(async () => {
    try {
      const [r, n] = await Promise.all([
        requestsApi.getById(requestId),
        notesApi.getByRequest(requestId),
      ]);
      setRequest(r);
      setNotesList(n);
    } catch { /* ignore */ }
  }, [requestId]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    window.addEventListener('sse:refresh', load);
    window.addEventListener('sse:note-added', load);
    return () => {
      window.removeEventListener('sse:refresh', load);
      window.removeEventListener('sse:note-added', load);
    };
  }, [load]);

  async function changeStatus(newStatus: string) {
    setStatusLoading(true);
    try {
      await requestsApi.updateStatus(requestId, newStatus);
      toast.success('Status updated!');
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update status');
    } finally { setStatusLoading(false); }
  }

  async function addNote() {
    const text = noteText.trim();
    if (!text || !user) return;
    setNoteLoading(true);
    try {
      await notesApi.add(requestId, { authorId: user.id, noteText: text });
      setNoteText('');
      toast.success('Note added!');
      const notes = await notesApi.getByRequest(requestId);
      setNotesList(notes);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to add note');
    } finally { setNoteLoading(false); }
  }

  if (!request) return <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">Loading…</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-bold text-[var(--color-text)]">
          {fmtReqId(request.requestId)} — {request.category}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        {/* Left */}
        <div className="flex flex-col gap-5">
          <Card title="Request Information">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoRow label="Category" value={request.category} />
              <InfoRow label="Priority" value={<PriorityLabel priority={request.priority} />} />
              <InfoRow label="Location" value={request.locationInUnit?.replace(/_/g, ' ')} />
              <InfoRow label="Submitted" value={fmtDate(request.dateSubmitted)} />
              <InfoRow label="Entry Allowed" value={request.allowEntry ? 'Yes' : 'No'} />
              <div className="col-span-2"><InfoRow label="Description" value={request.description} /></div>
            </div>
          </Card>

          <Card title="Repair Notes">
            <NotesList notes={notesList} />
            <div className="mt-4">
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Add a repair note…"
                rows={3}
                className="w-full border border-[var(--color-border)] rounded-[10px] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/12 resize-y transition-all"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={addNote}
                  disabled={noteLoading || !noteText.trim()}
                  className="px-4 py-2 rounded-[10px] text-sm font-semibold text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] shadow-[0_2px_8px_rgba(42,92,228,0.25)] transition-all disabled:opacity-60"
                >
                  {noteLoading ? 'Adding…' : 'Add Note'}
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right */}
        <Card title="Update Status">
          <div className="mb-4"><StatusBadge status={request.status} /></div>
          <div className="flex flex-col gap-2">
            {request.status === 'ASSIGNED' && (
              <button onClick={() => changeStatus('IN_PROGRESS')} disabled={statusLoading} className={primaryBtn}>
                ▶ Mark In Progress
              </button>
            )}
            {request.status === 'IN_PROGRESS' && (
              <button onClick={() => changeStatus('COMPLETED')} disabled={statusLoading} className={primaryBtn}>
                ✓ Mark Completed
              </button>
            )}
            {request.status === 'COMPLETED' && (
              <p className="text-sm text-[var(--color-status-completed-fg)] font-medium">✓ This request is completed.</p>
            )}
            {request.status !== 'ASSIGNED' && request.status !== 'IN_PROGRESS' && request.status !== 'COMPLETED' && (
              <p className="text-sm text-[var(--color-text-muted)]">No actions available.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

const primaryBtn = `w-full px-4 py-2.5 rounded-[10px] text-sm font-semibold text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] shadow-[0_2px_8px_rgba(42,92,228,0.25)] transition-all disabled:opacity-60`;

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">{label}</p>
      <div className="text-sm text-[var(--color-text)]">{value}</div>
    </div>
  );
}
