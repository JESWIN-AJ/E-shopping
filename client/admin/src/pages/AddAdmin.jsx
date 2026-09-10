import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function AddAdmin() {
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/admin/add-admin', form);
      if (res.data.status) {
        navigate('/admins');
      } else {
        setError(res.data.error || 'Failed to create admin');
      }
    } catch {
      setError('Failed to create admin. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={styles.section}>
      <div style={styles.card}>
        <Link to="/admins" style={styles.backBtn}>← Back to Admins</Link>
        <h1 style={styles.title}>Create <span style={{ color: '#c9a84c' }}>Admin</span></h1>
        <p style={styles.subtext}>Add a new administrator account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.fieldRow}>
            <div style={styles.field}>
              <label style={styles.label}>First Name</label>
              <input style={styles.input} name="firstname" value={form.firstname} onChange={handleChange} placeholder="John" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Last Name</label>
              <input style={styles.input} name="lastname" value={form.lastname} onChange={handleChange} placeholder="Doe" required />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input style={styles.input} type="email" name="email" value={form.email} onChange={handleChange} placeholder="admin@example.com" required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" required />
          </div>

          <hr style={styles.divider} />

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Creating...' : 'Create Admin'}
          </button>
        </form>
      </div>
    </section>
  );
}

const styles = {
  section: { background: '#0d0d0d', minHeight: '100vh', padding: '60px 24px', fontFamily: "'DM Sans', sans-serif" },
  card: { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 16, padding: 40, maxWidth: 520, margin: '0 auto' },
  backBtn: { color: '#7a7570', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-block', marginBottom: 24 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#f0ece4', margin: '0 0 4px' },
  subtext: { color: '#7a7570', fontSize: '0.85rem', marginBottom: 36 },
  error: { background: 'rgba(220,60,60,0.1)', border: '1px solid rgba(220,60,60,0.25)', color: '#e05555', padding: '12px 16px', borderRadius: 8, marginBottom: 20, textAlign: 'center', fontSize: '0.85rem' },
  fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field: { marginBottom: 22 },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a7570', marginBottom: 8 },
  input: { width: '100%', background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 10, color: '#f0ece4', fontSize: '0.9rem', padding: '12px 16px', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif" },
  divider: { border: 'none', borderTop: '1px solid #2a2a2a', margin: '28px 0' },
  btn: { width: '100%', background: '#c9a84c', color: '#0d0d0d', border: 'none', borderRadius: 100, padding: 14, fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', marginTop: 10 },
};