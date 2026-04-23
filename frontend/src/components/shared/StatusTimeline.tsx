import { fmtDate } from '@/lib/formatters';
import type { MaintenanceRequest } from '@/types';

interface Step {
  label: string;
  time: string | null;
  done: boolean;
}

export function StatusTimeline({ request: r }: { request: MaintenanceRequest }) {
  const steps: Step[] = [
    { label: 'Request Submitted',      time: r.dateSubmitted,  done: true },
    { label: 'Assigned to Technician', time: null,             done: !!r.assignedStaffId },
    { label: 'In Progress',            time: null,             done: r.status === 'IN_PROGRESS' || r.status === 'COMPLETED' },
    { label: 'Completed',              time: r.completionDate, done: r.status === 'COMPLETED' },
  ];

  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
            step.done ? 'bg-green-500' : 'bg-[var(--color-border)]'
          }`} />
          <div>
            <p className={`text-sm font-medium ${step.done ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>
              {step.label}
            </p>
            {step.time && (
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{fmtDate(step.time)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
