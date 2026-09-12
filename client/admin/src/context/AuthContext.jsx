import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing session

  // On mount: ask the server if there's already a valid session (cookie-based).
  // This also naturally primes the CSRF token, since every response carries
  // the x-csrf-token header regardless of which endpoint was hit.
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get('/admin/me');
      if (res.data.status && res.data.admin) {
        setAdmin(res.data.admin);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/admin/login', { email, password });
    if (res.data.status) {
      // No token to store — the server already set an httpOnly session
      // cookie on this response. Just update local state from the body.
      setAdmin(res.data.admin);
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/admin/logout'); // destroys the session server-side (Redis)
    } catch {
      // Even if this fails, clear local state and redirect anyway —
      // no point leaving the UI in a logged-in-looking state.
    } finally {
      setAdmin(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);