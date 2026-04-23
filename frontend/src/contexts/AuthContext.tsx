import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStored(): { user: User | null; token: string | null } {
  try {
    const raw = localStorage.getItem('ac_user');
    const token = localStorage.getItem('ac_token');
    return { user: raw ? (JSON.parse(raw) as User) : null, token };
  } catch {
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const stored = readStored();
  const [user, setUser] = useState<User | null>(stored.user);
  const [token, setToken] = useState<string | null>(stored.token);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    localStorage.setItem('ac_user', JSON.stringify(res.user));
    localStorage.setItem('ac_token', res.token);
    setUser(res.user);
    setToken(res.token);
    const role = res.user.role;
    if (role === 'TENANT') navigate('/tenant');
    else if (role === 'STAFF') navigate('/staff');
    else if (role === 'ADMIN') navigate('/admin');
  }, [navigate]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await authApi.signup(name, email, password);
    localStorage.setItem('ac_user', JSON.stringify(res.user));
    localStorage.setItem('ac_token', res.token);
    setUser(res.user);
    setToken(res.token);
    navigate('/tenant');
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('ac_user');
    localStorage.removeItem('ac_token');
    setUser(null);
    setToken(null);
    navigate('/');
  }, [navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, login, signup, logout, isAuthenticated: !!user }),
    [user, token, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
