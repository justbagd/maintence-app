import { Outlet } from 'react-router-dom';
import { Home, ClipboardList, Users } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useSSE } from '@/hooks/useSSE';

const NAV = [
  { label: 'Dashboard',     icon: <Home className="w-4 h-4" />,         to: '/admin' },
  { label: 'All Requests',  icon: <ClipboardList className="w-4 h-4" />, to: '/admin/all-requests' },
  { label: 'Technicians',   icon: <Users className="w-4 h-4" />,         to: '/admin/technicians' },
];

export default function AdminLayout() {
  const isConnected = useSSE({
    'request-created':  () => window.dispatchEvent(new CustomEvent('sse:refresh')),
    'request-assigned': () => window.dispatchEvent(new CustomEvent('sse:refresh')),
    'status-updated':   () => window.dispatchEvent(new CustomEvent('sse:refresh')),
    'priority-updated': () => window.dispatchEvent(new CustomEvent('sse:refresh')),
    'note-added':       () => window.dispatchEvent(new CustomEvent('sse:note-added')),
    'request-updated':  () => window.dispatchEvent(new CustomEvent('sse:refresh')),
  });

  return (
    <AppShell navItems={NAV} isConnected={isConnected}>
      <div className="view-entering">
        <Outlet />
      </div>
    </AppShell>
  );
}
