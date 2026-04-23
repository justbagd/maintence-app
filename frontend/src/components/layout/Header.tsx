import { Bell, Menu } from 'lucide-react';
import { initials } from '@/lib/formatters';
import { useAuth } from '@/contexts/AuthContext';
import type { Notification } from '@/types';

interface Props {
  onMenuClick: () => void;
  onBellClick: () => void;
  notifications: Notification[];
}

export function Header({ onMenuClick, onBellClick, notifications }: Props) {
  const { user } = useAuth();
  const unread = notifications.filter(n => !n.readStatus).length;

  return (
    <header className="sticky top-0 z-[99] h-[60px] bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-[10px] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-[var(--color-text-secondary)]" style={{ fontFamily: 'var(--font-display)' }}>
          ApartmentCare
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Bell */}
        <button
          onClick={onBellClick}
          className="relative w-9 h-9 flex items-center justify-center rounded-[10px] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] transition-colors"
        >
          <Bell className="w-4.5 h-4.5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[var(--color-accent)] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {unread}
            </span>
          )}
        </button>

        {/* User chip */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--color-navy-mid)] text-white flex items-center justify-center text-xs font-bold">
              {initials(user.name)}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[var(--color-text)] leading-tight">{user.name}</p>
              <p className="text-xs text-[var(--color-text-muted)] capitalize leading-tight">
                {user.role.toLowerCase()}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
