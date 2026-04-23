import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';
import { requestsApi } from '@/api/requests';
import { usersApi } from '@/api/users';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityLabel } from '@/components/shared/PriorityLabel';
import { fmtDate, fmtReqId } from '@/lib/formatters';
import { toast } from 'sonner';
import type { MaintenanceRequest, User, Status, Priority } from '@/types';

export default function AllRequests() {
  usePageTitle('All Requests');
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [tenantList, setTenantList] = useState<User[]>([]);
  const [status, setStatus] = useState<Status | ''>('');
  const [priority, setPriority] = useState<Priority | ''>('');

  const load = useCallback(async () => {
    try {
      const [reqs, staff, tenants] = await Promise.all([
        requestsApi.getAll(),
        usersApi.getByRole('STAFF'),
        usersApi.getByRole('TENANT'),
      ]);
      setRequests(reqs);
      setStaffList(staff);
      setTenantList(tenants);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    window.addEventListener('sse:refresh', load);
    return () => window.removeEventListener('sse:refresh', load);
  }, [load]);

  async function assignStaff(requestId: number, staffId: number) {
    try {
      await requestsApi.assign(requestId, staffId);
      toast.success('Staff assigned!');
      load();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Failed'); }
  }

  function tenantLabel(tenantId: number): string {
    const t = tenantList.find(u => u.id === tenantId);
    return t?.apartmentNumber ? `Unit ${t.apartmentNumber}` : `Tenant #${tenantId}`;
  }

  const filtered = requests.filter(r =>
    (!status || r.status === status) && (!priority || r.priority === priority)
  );

  return (
    <div>
      <h1 className="text-[26px] font-bold text-[var(--color-text)] mb-1">
        All Requests
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        {requests.length > 0
          ? `${filtered.length} of ${requests.length} request${requests.length !== 1 ? 's' : ''}`
          : 'Complete history of every maintenance request.'}
      </p>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-3 flex-wrap">
          <select
            aria-label="Filter by status"
            value={status}
            onChange={e => setStatus(e.target.value as Status | '')}
            className={sel}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select
            aria-label="Filter by priority"
            value={priority}
            onChange={e => setPriority(e.target.value as Priority | '')}
            className={sel}
          >
            <option value="">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['ID', 'Tenant', 'Assigned To', 'Priority', 'Status', 'Date', 'Assign', 'Actions'].map(h => (
                  <th key={h} scope="col" className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-sm text-[var(--color-text-muted)]">No requests found</td></tr>
              ) : filtered.map(r => (
                <tr key={r.requestId} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] transition-colors last:border-0">
                  <td className="px-4 py-3 text-sm font-medium text-[var(--color-accent)]">{fmtReqId(r.requestId)}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{tenantLabel(r.tenantId)}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text)]">
                    {r.assignedStaffId
                      ? (staffList.find(s => s.id === r.assignedStaffId)?.name ?? `Staff #${r.assignedStaffId}`)
                      : <span className="text-[var(--color-status-cancelled-fg)] text-xs font-medium">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3"><PriorityLabel priority={r.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{fmtDate(r.dateSubmitted)}</td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={`Assign technician for ${fmtReqId(r.requestId)}`}
                      value={r.assignedStaffId ?? ''}
                      onChange={e => e.target.value && assignStaff(r.requestId, Number(e.target.value))}
                      className="border border-[var(--color-border)] rounded-[8px] px-2 py-2 text-xs bg-[var(--color-surface)] text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] transition-colors min-h-[36px]"
                    >
                      <option value="">Assign…</option>
                      {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/admin/requests/${r.requestId}`)}
                      className="px-3 py-2 rounded-[8px] text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] transition-colors min-h-[36px]"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const sel = `border border-[var(--color-border)] rounded-[10px] px-3 py-2 text-sm bg-[var(--color-surface)] text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] transition-colors`;
