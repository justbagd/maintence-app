import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { requestsApi } from '@/api/requests';
import { usersApi } from '@/api/users';
import { usePageTitle } from '@/hooks/usePageTitle';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityLabel } from '@/components/shared/PriorityLabel';
import { fmtDate, fmtReqId } from '@/lib/formatters';
import type { MaintenanceRequest, User } from '@/types';

export default function MyAssignments() {
  usePageTitle('My Assignments');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [tenantList, setTenantList] = useState<User[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const [reqs, tenants] = await Promise.all([
        requestsApi.getByStaff(user.id),
        usersApi.getByRole('TENANT'),
      ]);
      setRequests(reqs);
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

  const open = requests.filter(r => r.status !== 'COMPLETED').length;

  return (
    <div>
      <h1 className="text-[26px] font-bold text-[var(--color-text)] mb-1">
        My Assignments
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        {requests.length > 0
          ? `${open} open · ${requests.length - open} completed`
          : 'No assignments yet'}
      </p>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Request ID', 'Tenant', 'Category', 'Priority', 'Status', 'Submitted', 'Actions'].map(h => (
                  <th key={h} scope="col" className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-sm text-[var(--color-text-muted)]">No assignments yet</td></tr>
              ) : requests.map(r => (
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
