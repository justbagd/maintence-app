import { fmtDateTime } from '@/lib/formatters';
import type { RequestNote } from '@/types';

export function NotesList({ notes }: { notes: RequestNote[] }) {
  if (notes.length === 0) {
    return <p className="text-sm text-[var(--color-text-muted)]">No repair notes yet.</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {notes.map(n => (
        <div key={n.noteId} className="bg-[var(--color-surface-subtle)] rounded-[10px] px-4 py-3">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">{fmtDateTime(n.createdAt)}</p>
          <p className="text-sm text-[var(--color-text)]">{n.noteText}</p>
        </div>
      ))}
    </div>
  );
}
