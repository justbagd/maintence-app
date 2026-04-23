import type { Status } from '@/types';
import { STATUS_LABELS } from '@/lib/formatters';

const styles: Record<Status, string> = {
  PENDING:     'bg-[var(--color-status-pending-bg)] text-[var(--color-status-pending-fg)] border-[var(--color-status-pending-border)]',
  ASSIGNED:    'bg-[var(--color-status-assigned-bg)] text-[var(--color-status-assigned-fg)] border-[var(--color-status-assigned-border)]',
  IN_PROGRESS: 'bg-[var(--color-status-in-progress-bg)] text-[var(--color-status-in-progress-fg)] border-[var(--color-status-in-progress-border)]',
  COMPLETED:   'bg-[var(--color-status-completed-bg)] text-[var(--color-status-completed-fg)] border-[var(--color-status-completed-border)]',
  ARCHIVED:    'bg-[var(--color-status-archived-bg)] text-[var(--color-status-archived-fg)] border-[var(--color-status-archived-border)]',
  CANCELLED:   'bg-[var(--color-status-cancelled-bg)] text-[var(--color-status-cancelled-fg)] border-[var(--color-status-cancelled-border)]',
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
