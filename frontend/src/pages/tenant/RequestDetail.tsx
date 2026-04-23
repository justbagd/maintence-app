import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';
import { ArrowLeft } from 'lucide-react';
import { requestsApi } from '@/api/requests';
import { notesApi } from '@/api/notes';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityLabel } from '@/components/shared/PriorityLabel';
import { NotesList } from '@/components/shared/NotesList';
import { StatusTimeline } from '@/components/shared/StatusTimeline';
import { fmtDate, fmtReqId } from '@/lib/formatters';
import { toast } from 'sonner';
import type { MaintenanceRequest, RequestNote } from '@/types';

export default function TenantRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<MaintenanceRequest | null>(null);
  const [notesList, setNotesList] = useState<RequestNote[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

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

  async function handleReopen() {
    setActionLoading(true);
    try {
      await requestsApi.reopen(requestId);
      toast.success('Request reopened!');
      setTimeout(() => load(), 800);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to reopen');
    } finally { setActionLoading(false); }
  }

  async function handleCancel() {
    if (!confirmCancel) {
      setConfirmCancel(true);
      setTimeout(() => setConfirmCancel(false), 4000);
      return;
    }
    setActionLoading(true);
    try {
      await requestsApi.cancel(requestId);
      toast.success('Request cancelled.');
      setTimeout(() => load(), 800);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to cancel');
    } finally { setActionLoading(false); setConfirmCancel(false); }
  }

  if (!request) return <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">Loading…</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] transition-colors"
        >
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
              {request.completionDate && <InfoRow label="Completed" value={fmtDate(request.completionDate)} />}
              <InfoRow label="Entry Allowed" value={request.allowEntry ? 'Yes' : 'No'} />
              <div className="col-span-2">
                <InfoRow label="Description" value={request.description} />
              </div>
            </div>
          </Card>

          <Card title="Repair Notes">
            <NotesList notes={notesList} />
            {/* Action buttons */}
            {(request.status === 'COMPLETED' || request.status === 'ARCHIVED') && (
              <button
                onClick={handleReopen}
                disabled={actionLoading}
                className="mt-4 px-4 py-2 rounded-[10px] text-sm font-semibold text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] transition-colors disabled:opacity-60"
              >
                Reopen Request
              </button>
            )}
            {(request.status === 'PENDING' || request.status === 'ASSIGNED') && (
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className={`mt-4 px-4 py-2 rounded-[10px] text-sm font-semibold transition-colors disabled:opacity-60 ${
                  confirmCancel
                    ? 'bg-[var(--color-status-cancelled-bg)] text-[var(--color-status-cancelled-fg)] border-[var(--color-status-cancelled-border)]'
                    : 'text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)]'
                }`}
              >
                {confirmCancel ? 'Tap again to confirm' : 'Cancel Request'}
              </button>
            )}
          </Card>
        </div>

        {/* Right */}
        <Card title="Status">
          <div className="mb-4"><StatusBadge status={request.status} /></div>
          <StatusTimeline request={request} />
        </Card>
      </div>
    </div>
  );
}

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
