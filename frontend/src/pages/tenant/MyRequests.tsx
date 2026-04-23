import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { requestsApi } from '@/api/requests';
import { usePageTitle } from '@/hooks/usePageTitle';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityLabel } from '@/components/shared/PriorityLabel';
import { fmtDate, fmtReqId } from '@/lib/formatters';
import type { MaintenanceRequest, Status, Priority } from '@/types';

export default function MyRequests() {
  usePageTitle('My Requests');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [all, setAll] = useState<MaintenanceRequest[]>([]);
  const [status, setStatus] = useState<Status | ''>('');
  const [priority, setPriority] = useState<Priority | ''>('');

  const load = useCallback(async () => {
    if (!user) return;
    try { setAll(await requestsApi.getByTenant(user.id)); } catch { /* ignore */ }
  }, [user]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    window.addEventListener('sse:refresh', load);
    return () => window.removeEventListener('sse:refresh', load);
  }, [load]);

  const filtered = all.filter(r =>
    (!status || r.status === status) && (!priority || r.priority === priority)
  );

  return (
    <div>
      <h1 className="text-[26px] font-bold text-[var(--color-text)] mb-1">
        My Requests
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        {all.length > 0
          ? `${filtered.length} of ${all.length} request${all.length !== 1 ? 's' : ''}`
          : 'No requests yet'}
      </p>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-3 flex-wrap">
          <select
            aria-label="Filter by status"
            value={status}
            onChange={e => setStatus(e.target.value as Status | '')}
            className={selectCls}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select
            aria-label="Filter by priority"
            value={priority}
            onChange={e => setPriority(e.target.value as Priority | '')}
            className={selectCls}
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
                {['Request ID', 'Category', 'Location', 'Priority', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} scope="col" className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-sm text-[var(--color-text-muted)]">No requests found</td></tr>
              ) : filtered.map(r => (
                <tr key={r.requestId} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] transition-colors last:border-0">
                  <td className="px-4 py-3 text-sm font-medium text-[var(--color-accent)]">{fmtReqId(r.requestId)}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text)]">{r.category}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{r.locationInUnit?.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3"><PriorityLabel priority={r.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{fmtDate(r.dateSubmitted)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/tenant/requests/${r.requestId}`)}
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

const selectCls = `border border-[var(--color-border)] rounded-[10px] px-3 py-2 text-sm bg-[var(--color-surface)] text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] transition-colors`;
