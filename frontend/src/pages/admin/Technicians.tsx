import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/api/admin';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { TechnicianWorkload } from '@/types';

function WorkloadBadge({ count }: { count: number }) {
  const cls = count === 0
    ? 'bg-[var(--color-status-completed-bg)] text-[var(--color-status-completed-fg)] border-[var(--color-status-completed-border)]'
    : count >= 3
    ? 'bg-[var(--color-status-pending-bg)] text-[var(--color-status-pending-fg)] border-[var(--color-status-pending-border)]'
    : 'bg-[var(--color-status-assigned-bg)] text-[var(--color-status-assigned-fg)] border-[var(--color-status-assigned-border)]';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {count}
    </span>
  );
}

function AvailabilityBadge({ available }: { available: boolean | undefined }) {
  const cls = available !== false
    ? 'bg-[var(--color-status-completed-bg)] text-[var(--color-status-completed-fg)] border-[var(--color-status-completed-border)]'
    : 'bg-[var(--color-status-cancelled-bg)] text-[var(--color-status-cancelled-fg)] border-[var(--color-status-cancelled-border)]';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {available !== false ? 'Available' : 'Unavailable'}
    </span>
  );
}

export default function Technicians() {
  usePageTitle('Technicians');
  const [data, setData] = useState<TechnicianWorkload[]>([]);

  const load = useCallback(async () => {
    try { setData(await adminApi.getTechnicians()); } catch { /* ignore */ }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    window.addEventListener('sse:refresh', load);
    return () => window.removeEventListener('sse:refresh', load);
  }, [load]);

  return (
    <div>
      <h1 className="text-[26px] font-bold text-[var(--color-text)] mb-1">
        Technicians
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        {data.length > 0
          ? `${data.filter(d => d.technician.available !== false).length} of ${data.length} available`
          : 'Current workload and availability of maintenance staff.'}
      </p>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Name', 'Email', 'Skill Type', 'Active Requests', 'Availability'].map(h => (
                  <th key={h} scope="col" className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-sm text-[var(--color-text-muted)]">No technicians found</td></tr>
              ) : data.map(({ technician: t, activeRequestCount }) => (
                <tr key={t.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] transition-colors last:border-0">
                  <td className="px-5 py-3 text-sm font-medium text-[var(--color-text)]">{t.name}</td>
                  <td className="px-5 py-3 text-sm text-[var(--color-text-muted)]">{t.email}</td>
                  <td className="px-5 py-3 text-sm text-[var(--color-text-muted)]">{t.skillType ?? '—'}</td>
                  <td className="px-5 py-3"><WorkloadBadge count={activeRequestCount} /></td>
                  <td className="px-5 py-3"><AvailabilityBadge available={t.available} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
