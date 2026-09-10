import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadAdmins(); }, []);

  const loadAdmins = async () => {
    try {
      const res = await api.get('/admin/admin-list');
      setAdmins(res.data.admins);
    } catch {
      setError('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ color: '#7a7570', padding: 60 }}>Loading...</p>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin <span style={{ color: '#c9a84c' }}>Management</span></h1>
        <Link to="/admins/add" style={styles.addBtn}>+ Add Admin</Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a._id} style={styles.tr}>
                <td style={{ ...styles.td, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
                  {a.firstname} {a.lastname}
                </td>
                <td style={styles.td}>{a.email}</td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={2} style={{ ...styles.td, textAlign: 'center', color: '#7a7570', padding: 60 }}>
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#f0ece4', margin: 0 },
  addBtn: { background: '#c9a84c', color: '#0d0d0d', border: 'none', borderRadius: 100, padding: '10px 24px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap' },
  error: { background: 'rgba(220,60,60,0.1)', border: '1px solid rgba(220,60,60,0.25)', color: '#e05555', padding: '12px 16px', borderRadius: 8, marginBottom: 20, textAlign: 'center', fontSize: '0.85rem' },
  tableWrap: { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 16, overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 400 },
  th: { padding: '16px 20px', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a7570', textAlign: 'left', borderBottom: '1px solid #2a2a2a', background: '#1f1b1b' },
  tr: { borderBottom: '1px solid #2a2a2a', transition: '0.2s' },
  td: { padding: '16px 20px', color: '#f0ece4', fontSize: '0.88rem', verticalAlign: 'middle' },
};