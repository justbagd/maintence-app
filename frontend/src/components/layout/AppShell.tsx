import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { Sidebar, type NavItem } from './Sidebar';
import { Header } from './Header';
import { NotificationDropdown } from './NotificationDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { notificationsApi } from '@/api/notifications';
import type { Notification } from '@/types';

interface Props {
  navItems: NavItem[];
  isConnected: boolean;
  children: ReactNode;
}

export function AppShell({ navItems, isConnected, children }: Props) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await notificationsApi.getByUser(user.id);
      setNotifications(data);
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        items={navItems}
        isConnected={isConnected}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen md:ml-[230px] relative">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onBellClick={() => setNotifOpen(o => !o)}
          notifications={notifications}
        />

        {notifOpen && user && (
          <NotificationDropdown
            isOpen={notifOpen}
            onClose={() => setNotifOpen(false)}
            notifications={notifications}
            onReload={loadNotifications}
            userId={user.id}
          />
        )}

        <main className="flex-1 p-7 md:p-9">
          {children}
        </main>
      </div>
    </div>
  );
}

