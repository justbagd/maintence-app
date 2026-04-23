import type { Priority } from '@/types';
import { PRIORITY_LABELS } from '@/lib/formatters';

const textTokens: Record<Priority, string> = {
  URGENT: 'text-[var(--color-urgent)] font-bold',
  HIGH:   'text-[var(--color-high)] font-semibold',
  MEDIUM: 'text-[var(--color-medium)] font-medium',
  LOW:    'text-[var(--color-low)] font-medium',
};

const dotTokens: Record<Priority, string> = {
  URGENT: 'bg-[var(--color-urgent)]',
  HIGH:   'bg-[var(--color-high)]',
  MEDIUM: 'bg-[var(--color-medium)]',
  LOW:    'bg-[var(--color-low)]',
};

export function PriorityLabel({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${textTokens[priority]}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotTokens[priority]}`} />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
