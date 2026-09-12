import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  // Still checking session with the server — render nothing (or a spinner)
  // rather than redirecting prematurely, since `admin` starts as null.
  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center', color: '#666666' }}>Loading...</div>;
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}