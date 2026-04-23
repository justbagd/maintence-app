import { Outlet, useNavigate } from 'react-router-dom';
import { Home, Plus, List, HelpCircle } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useSSE } from '@/hooks/useSSE';

const NAV = [
  { label: 'Dashboard',    icon: <Home className="w-4 h-4" />,        to: '/tenant' },
  { label: 'New Request',  icon: <Plus className="w-4 h-4" />,        to: '/tenant/new-request' },
  { label: 'My Requests',  icon: <List className="w-4 h-4" />,        to: '/tenant/my-requests' },
  { label: 'Help',         icon: <HelpCircle className="w-4 h-4" />,  to: '/tenant/help' },
];

export default function TenantLayout() {
  const navigate = useNavigate();
  // SSE — child pages handle their own refetch via window events or navigate triggers
  const isConnected = useSSE({
    'request-created':  () => window.dispatchEvent(new CustomEvent('sse:refresh')),
    'status-updated':   () => window.dispatchEvent(new CustomEvent('sse:refresh')),
    'request-assigned': () => window.dispatchEvent(new CustomEvent('sse:refresh')),
    'note-added':       () => window.dispatchEvent(new CustomEvent('sse:note-added')),
    'request-updated':  () => window.dispatchEvent(new CustomEvent('sse:refresh')),
  });

  return (
    <AppShell navItems={NAV} isConnected={isConnected}>
      <div key={navigate.toString()} className="view-entering">
        <Outlet />
      </div>
    </AppShell>
  );
}
