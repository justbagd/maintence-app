import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { requestsApi } from '@/api/requests';
import { usersApi } from '@/api/users';
import { usePageTitle } from '@/hooks/usePageTitle';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityLabel } from '@/components/shared/PriorityLabel';
import { fmtDate, fmtReqId } from '@/lib/formatters';
import type { MaintenanceRequest, User, Status, Priority } from '@/types';

export default function StaffDashboard() {
  usePageTitle('Dashboard');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [all, setAll] = useState<MaintenanceRequest[]>([]);
  const [tenantList, setTenantList] = useState<User[]>([]);
  const [status, setStatus] = useState<Status | ''>('');
  const [priority, setPriority] = useState<Priority | ''>('');

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const [reqs, tenants] = await Promise.all([
        requestsApi.getByStaff(user.id),
        usersApi.getByRole('TENANT'),
      ]);
      setAll(reqs);
      setTenantList(tenants);
    } catch { /* ignore */ }
  }, [user]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    window.addEventListener('sse:refresh', load);
    return () => window.removeEventListener('sse:refresh', load);
  }, [load]);

  function tenantLabel(tenantId: number): string {
    const t = tenantList.find(u => u.id === tenantId);
    return t?.apartmentNumber ? `Unit ${t.apartmentNumber}` : `Tenant #${tenantId}`;
  }

  const filtered = all.filter(r =>
    (!status || r.status === status) && (!priority || r.priority === priority)
  );

  const urgentOpen = all.filter(r => r.priority === 'URGENT' && r.status !== 'COMPLETED').length;

  return (
    <div>
      <h1 className="text-[26px] font-bold text-[var(--color-text)] mb-1">
        Welcome back, {user?.name}
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-7">
        {all.length > 0
          ? `${all.filter(r => r.status !== 'COMPLETED').length} open assignment${all.filter(r => r.status !== 'COMPLETED').length !== 1 ? 's' : ''}${urgentOpen > 0 ? ` · ${urgentOpen} urgent` : ''}`
          : 'No assignments yet'}
      </p>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-3 flex-wrap">
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
          <select
            aria-label="Filter by status"
            value={status}
            onChange={e => setStatus(e.target.value as Status | '')}
            className={sel}
          >
            <option value="">All Statuses</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Request ID', 'Tenant', 'Category', 'Priority', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} scope="col" className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-sm text-[var(--color-text-muted)]">No assigned requests</td></tr>
              ) : filtered.map(r => (
                <tr key={r.requestId} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] transition-colors last:border-0">
                  <td className="px-4 py-3 text-sm font-medium text-[var(--color-accent)]">{fmtReqId(r.requestId)}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{tenantLabel(r.tenantId)}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text)]">{r.category}</td>
                  <td className="px-4 py-3"><PriorityLabel priority={r.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{fmtDate(r.dateSubmitted)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/staff/requests/${r.requestId}`)}
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
