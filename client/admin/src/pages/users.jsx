import { useState, useEffect } from 'react';
import api from '../api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/all-users');
      setUsers(res.data.users);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ color: '#7a7570', padding: 60 }}>Loading...</p>;

  return (
    <div>
      <h1 style={styles.title}>User <span style={{ color: '#c9a84c' }}>Management</span></h1>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={styles.tr}>
                <td style={{ ...styles.td, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
                  {u.firstname} {u.lastname}
                </td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>{u.phone}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} style={{ ...styles.td, textAlign: 'center', color: '#7a7570', padding: 60 }}>
                  No users found
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
  title: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#f0ece4', marginBottom: 32 },
  error: { background: 'rgba(220,60,60,0.1)', border: '1px solid rgba(220,60,60,0.25)', color: '#e05555', padding: '12px 16px', borderRadius: 8, marginBottom: 20, textAlign: 'center', fontSize: '0.85rem' },
  tableWrap: { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 16, overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 500 },
  th: { padding: '16px 20px', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a7570', textAlign: 'left', borderBottom: '1px solid #2a2a2a', background: '#1f1b1b' },
  tr: { borderBottom: '1px solid #2a2a2a', transition: '0.2s' },
  td: { padding: '16px 20px', color: '#f0ece4', fontSize: '0.88rem', verticalAlign: 'middle' },
};