import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      if (res.status) {
        navigate('/');
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } catch {
      setError('Login failed. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glow} />
      <div style={styles.card}>
        <h1 style={styles.title}>Admin <span style={{ color: '#c9a84c' }}>Login</span></h1>
        <p style={styles.subtitle}>Sign in to manage your store</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
  glow: { position: 'fixed', inset: 0, background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' },
  card: { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 24, padding: '48px 44px', width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#f0ece4', marginBottom: 4 },
  subtitle: { color: '#7a7570', fontSize: '0.85rem', marginBottom: 32 },
  error: { background: 'rgba(220,60,60,0.1)', border: '1px solid rgba(220,60,60,0.25)', color: '#e05555', padding: '12px 16px', borderRadius: 8, marginBottom: 20, textAlign: 'center', fontSize: '0.85rem' },
  field: { marginBottom: 20 },
  label: { fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a7570', marginBottom: 8, display: 'block' },
  input: { width: '100%', background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 10, color: '#f0ece4', fontSize: '0.9rem', padding: '13px 16px', outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', background: '#c9a84c', color: '#0d0d0d', border: 'none', borderRadius: 100, padding: 14, fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', marginTop: 8 },
};