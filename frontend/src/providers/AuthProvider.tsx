import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AxiosResponse } from 'axios';
import { api } from '../lib/api';
import type { User } from '../types/user';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('notes_token') : null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get<User>('/auth/me')
      .then(({ data }: AxiosResponse<User>) => setUser(data))
      .catch(() => {
        localStorage.removeItem('notes_token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleAuthSuccess = (jwt: string) => {
    localStorage.setItem('notes_token', jwt);
    setToken(jwt);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post<{ token: string }>('/auth/login', { email, password });
      handleAuthSuccess(data.token);
      const profile = await api.get<User>('/auth/me');
      setUser(profile.data);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      await api.post('/auth/register', { email, password });
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('notes_token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout, register }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
