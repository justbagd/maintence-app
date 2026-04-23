import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { requestsApi } from '@/api/requests';
import { usePageTitle } from '@/hooks/usePageTitle';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityLabel } from '@/components/shared/PriorityLabel';
import { fmtDate, fmtReqId } from '@/lib/formatters';
import type { MaintenanceRequest } from '@/types';

export default function TenantDashboard() {
  usePageTitle('Dashboard');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const all = await requestsApi.getByTenant(user.id);
      setRequests(all.filter(r => r.status !== 'COMPLETED' && r.status !== 'ARCHIVED' && r.status !== 'CANCELLED'));
    } catch { /* ignore */ }
  }, [user]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    window.addEventListener('sse:refresh', load);
    return () => window.removeEventListener('sse:refresh', load);
  }, [load]);

  const urgentCount = requests.filter(r => r.priority === 'URGENT').length;

  return (
    <div>
      <h1 className="text-[26px] font-bold text-[var(--color-text)] mb-1">
        Welcome back, {user?.name}
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-7">
        {user?.apartmentNumber ? `Unit ${user.apartmentNumber}` : ''}
        {user?.leaseEnd ? `${user.apartmentNumber ? ' · ' : ''}Lease ends ${fmtDate(user.leaseEnd)}` : ''}
        {requests.length > 0 && urgentCount > 0 ? ` · ${urgentCount} urgent` : ''}
      </p>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--color-text)]">Active Requests</h2>
          <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] px-2 py-0.5 rounded-full">
            {requests.length} active
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Request ID', 'Category', 'Priority', 'Status', 'Date'].map(h => (
                  <th key={h} scope="col" className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-sm text-[var(--color-text-muted)]">
                    No active requests — you're all caught up
                  </td>
                </tr>
              ) : requests.map(r => (
                <tr
                  key={r.requestId}
                  tabIndex={0}
                  role="button"
                  aria-label={`View request ${fmtReqId(r.requestId)}`}
                  onClick={() => navigate(`/tenant/requests/${r.requestId}`)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(`/tenant/requests/${r.requestId}`)}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] focus:bg-[var(--color-surface-subtle)] focus:outline-none cursor-pointer transition-colors last:border-0"
                >
                  <td className="px-4 py-3 text-sm font-medium text-[var(--color-accent)]">{fmtReqId(r.requestId)}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text)]">{r.category}</td>
                  <td className="px-4 py-3"><PriorityLabel priority={r.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{fmtDate(r.dateSubmitted)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
