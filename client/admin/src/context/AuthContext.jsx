import { createContext, useContext, useState, useEffect } from 'react';
import api, { setAdminToken, clearAdminToken } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false); // no session to check on mount anymore

  useEffect(() => {
    setLoading(false); // in-memory token means no persisted session across refresh — known trade-off
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/admin/login', { email, password });
    if (res.data.status) {
      setAdminToken(res.data.token);
      setAdmin(res.data.admin);
    }
    return res.data;
  };

  const logout = async () => {
    try { await api.post('/admin/logout'); } catch {}
    clearAdminToken();
    setAdmin(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);