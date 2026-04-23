import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
}

interface Props {
  items: NavItem[];
  isConnected: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ items, isConnected, isOpen, onClose }: Props) {
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[99] md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 w-[230px] bg-[var(--color-sidebar-bg)] flex flex-col z-[100]
        transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[var(--color-navy-mid)] text-xs font-bold shrink-0">
            AC
          </div>
          <span className="text-white font-bold text-[15px]" style={{ fontFamily: 'var(--font-display)' }}>
            ApartmentCare
          </span>
          <button className="ml-auto text-white/50 hover:text-white md:hidden" onClick={onClose}>✕</button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-4 flex flex-col gap-0.5">
          {items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) => `
                flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-sm font-medium
                min-h-[44px] transition-all duration-150 border-l-[3px]
                ${isActive
                  ? 'bg-white/10 text-white border-l-[var(--color-accent)]'
                  : 'text-white/55 border-l-transparent hover:bg-white/7 hover:text-white/88'
                }
              `}
              onClick={onClose}
            >
              <span className="w-4 h-4 shrink-0">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          {/* Live indicator */}
          {isConnected && (
            <div className="flex items-center gap-1.5 px-3 pt-3 text-[11px] font-semibold text-green-400 uppercase tracking-wider">
              <span
                className="w-1.5 h-1.5 rounded-full bg-green-500"
                style={{ animation: 'pulse-live 2s infinite' }}
              />
              Live
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3">
          <button
            onClick={logout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-[10px] text-sm font-medium text-white/55 hover:bg-white/7 hover:text-white/88 transition-all duration-150"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
