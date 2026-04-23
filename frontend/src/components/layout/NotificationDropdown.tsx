import { useEffect, useRef } from 'react';
import { fmtDateTime } from '@/lib/formatters';
import { notificationsApi } from '@/api/notifications';
import type { Notification } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onReload: () => void;
  userId: number;
}

export function NotificationDropdown({ isOpen, onClose, notifications, onReload, userId }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    if (isOpen) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function markRead(id: number) {
    await notificationsApi.markRead(id).catch(() => {});
    onReload();
  }

  async function markAll() {
    await notificationsApi.markAllRead(userId).catch(() => {});
    onReload();
  }

  return (
    <div
      ref={ref}
      className="absolute top-[64px] right-6 w-[340px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl z-[150] overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
        <h4 className="text-sm font-semibold text-[var(--color-text)]">Notifications</h4>
        <button
          onClick={markAll}
          className="text-xs text-[var(--color-accent)] hover:underline"
        >
          Mark all read
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] text-center py-6">No notifications</p>
        ) : (
          notifications.map(n => (
            <div
              key={n.notificationId}
              onClick={() => markRead(n.notificationId)}
              className={`px-4 py-3 border-b border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-bg)] transition-colors ${
                !n.readStatus ? 'bg-[var(--color-surface-subtle)]' : ''
              }`}
            >
              <p className="text-sm text-[var(--color-text)]">{n.message}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{fmtDateTime(n.timestamp)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
