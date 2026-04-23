import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';
import { ArrowLeft } from 'lucide-react';
import { requestsApi } from '@/api/requests';
import { notesApi } from '@/api/notes';
import { usersApi } from '@/api/users';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityLabel } from '@/components/shared/PriorityLabel';
import { NotesList } from '@/components/shared/NotesList';
import { StatusTimeline } from '@/components/shared/StatusTimeline';
import { fmtDate, fmtReqId } from '@/lib/formatters';
import { toast } from 'sonner';
import type { MaintenanceRequest, RequestNote, User, Priority } from '@/types';

export default function AdminRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<MaintenanceRequest | null>(null);
  const [notesList, setNotesList] = useState<RequestNote[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  usePageTitle('Request Detail');
  const requestId = Number(id);

  const load = useCallback(async () => {
    try {
      const [r, n, staff] = await Promise.all([
        requestsApi.getById(requestId),
        notesApi.getByRequest(requestId),
        usersApi.getByRole('STAFF'),
      ]);
      setRequest(r);
      setNotesList(n);
      setStaffList(staff);
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

  async function handleAssign(staffId: number) {
    try {
      await requestsApi.assign(requestId, staffId);
      toast.success('Staff assigned!');
      load();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Failed'); }
  }

  async function handlePriority(priority: string) {
    try {
      await requestsApi.updatePriority(requestId, priority);
      toast.success('Priority updated!');
      load();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Failed'); }
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
      load();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Failed'); }
    finally { setActionLoading(false); setConfirmCancel(false); }
  }

  if (!request) return <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">Loading…</div>;

  const assignedName = request.assignedStaffId
    ? (staffList.find(s => s.id === request.assignedStaffId)?.name ?? `Staff #${request.assignedStaffId}`)
    : 'Unassigned';

  const canCancel = !['COMPLETED', 'ARCHIVED', 'CANCELLED'].includes(request.status);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-display)' }}>
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
              <InfoRow label="Tenant" value={`Unit ${request.tenantId}`} />
              <InfoRow label="Assigned To" value={assignedName} />
              <InfoRow label="Location" value={request.locationInUnit?.replace(/_/g, ' ')} />
              <InfoRow label="Submitted" value={fmtDate(request.dateSubmitted)} />
              {request.completionDate && <InfoRow label="Completed" value={fmtDate(request.completionDate)} />}
              <div className="col-span-2"><InfoRow label="Description" value={request.description} /></div>
            </div>
          </Card>

          <Card title="Repair Notes">
            <NotesList notes={notesList} />
          </Card>

          {canCancel && (
            <Card title="Actions">
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className={`px-4 py-2 rounded-[10px] text-sm font-semibold transition-colors disabled:opacity-60 ${
                  confirmCancel
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)]'
                }`}
              >
                {confirmCancel ? 'Tap again to confirm' : 'Cancel Request'}
              </button>
            </Card>
          )}
        </div>

        {/* Right */}
        <div className="flex flex-col gap-5">
          <Card title="Status">
            <div className="mb-4"><StatusBadge status={request.status} /></div>
            <StatusTimeline request={request} />
          </Card>

          <Card title="Assign Technician">
            <select
              value={request.assignedStaffId ?? ''}
              onChange={e => e.target.value && handleAssign(Number(e.target.value))}
              className="w-full border border-[var(--color-border)] rounded-[10px] px-3 py-2.5 text-sm bg-[var(--color-surface)] text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] transition-colors"
            >
              <option value="">Select technician…</option>
              {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Card>

          <Card title="Priority">
            <select
              value={request.priority}
              onChange={e => handlePriority(e.target.value as Priority)}
              className="w-full border border-[var(--color-border)] rounded-[10px] px-3 py-2.5 text-sm bg-[var(--color-surface)] text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] transition-colors"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </Card>
        </div>
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
