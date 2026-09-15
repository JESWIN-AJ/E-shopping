import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  // With token-based auth, there's no server session to restore on mount —
  // the token only lives in memory, so a fresh page load always starts
  // logged out. `loading` resolves to false almost immediately (no async
  // check needed), so this mainly guards the brief initial render.
  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center', color: '#666666' }}>Loading...</div>;
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}