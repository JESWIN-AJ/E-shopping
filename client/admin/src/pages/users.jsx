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

  if (loading) return <p style={{ color: '#666666', padding: 60 }}>Loading...</p>;

  return (
    <div>
      <h1 style={styles.title}>User <span style={{ color: '#000000' }}>Management</span></h1>

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
                <td colSpan={3} style={{ ...styles.td, textAlign: 'center', color: '#666666', padding: 60 }}>
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
  title: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#000000', marginBottom: 32 },
  error: { background: '#fbe9e9', border: '1px solid #a30000', color: '#a30000', padding: '12px 16px', borderRadius: 8, marginBottom: 20, textAlign: 'center', fontSize: '0.85rem' },
  tableWrap: { background: '#ffffff', border: '1px solid #000000', borderRadius: 16, overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 500 },
  th: { padding: '16px 20px', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#333333', textAlign: 'left', borderBottom: '1px solid #000000', background: '#f5f5f5' },
  tr: { borderBottom: '1px solid #d9d9d9', transition: '0.2s' },
  td: { padding: '16px 20px', color: '#111111', fontSize: '0.88rem', verticalAlign: 'middle' },
};