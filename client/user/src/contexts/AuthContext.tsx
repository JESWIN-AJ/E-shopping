// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '@/services/authService';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ status: boolean; error?: string }>;
  signup: (data: { 
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<{ status: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    let mounted = true;
    authService.me()
      .then((res) => {
        if (mounted && res.status && res.user) {
          setUser(res.user);
        }
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    if (res.status && res.user) setUser(res.user);
    return { status: res.status, error: res.error };
  };

  const signup = async (data: { 
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    password: string;
  }) => {
    const res = await authService.signup(data);
    if (res.status && res.user) setUser(res.user);
    return { status: res.status, error: res.error };
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};