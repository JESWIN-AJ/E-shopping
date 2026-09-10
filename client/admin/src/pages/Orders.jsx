import { useState, useEffect } from 'react';
import api from '../api';

export default function Orders() {
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get('/admin/all-orders');
      setGroupedOrders(res.data.groupedOrders);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleShip = async (orderId) => {
    try {
      await api.post('/admin/ship-order', { id: orderId });
      setGroupedOrders((prev) =>
        prev.map((group) => ({
          ...group,
          userOrders: group.userOrders.map((o) =>
            o._id === orderId ? { ...o, status: 'shipped' } : o
          ),
        }))
      );
    } catch {
      alert('Failed to ship order');
    }
  };

  if (loading) return <p style={{ color: '#7a7570', padding: 60 }}>Loading...</p>;

  return (
    <div>
      <h1 style={styles.title}>Order <span style={{ color: '#c9a84c' }}>Management</span></h1>

      {error && <div style={styles.error}>{error}</div>}

      {groupedOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#7a7570' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#f0ece4', marginBottom: 8 }}>No orders yet</h3>
          <p>Orders will appear here once customers make purchases.</p>
        </div>
      ) : (
        groupedOrders.map((group) => (
          <div key={group.userId} style={styles.card}>
            <div style={styles.cardHeader}>
              <span><strong style={{ color: '#c9a84c' }}>User ID:</strong> {group.userId}</span>
              <span><strong style={{ color: '#c9a84c' }}>Contact:</strong> {group.mobile}</span>
            </div>
            <div style={styles.cardBody}>
              <p style={styles.address}><strong>Shipping Address:</strong> {group.address}</p>

              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Products</th>
                      <th style={styles.th}>Total</th>
                      <th style={styles.th}>Payment</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.userOrders.map((order) => (
                      <tr key={order._id} style={styles.tr}>
                        <td style={styles.td}>{order.Date}</td>
                        <td style={styles.td}>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {order.products?.map((p, i) => (
                              <li key={i} style={{ marginBottom: 3 }}>
                                • {p.name}{' '}
                                <span style={styles.qtyBadge}>x{p.quantity}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td style={{ ...styles.td, color: '#c9a84c' }}>₹{order.totalAmount}</td>
                        <td style={styles.td}>
                          <span style={styles.paymentBadge}>{order.paymentmethod}</span>
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadge,
                            background: order.status === 'shipped'
                              ? 'rgba(46,125,50,0.15)'
                              : 'rgba(184,134,11,0.15)',
                            color: order.status === 'shipped' ? '#4caf50' : '#cddc39',
                            borderColor: order.status === 'shipped'
                              ? 'rgba(46,125,50,0.3)'
                              : 'rgba(184,134,11,0.3)',
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => handleShip(order._id)}
                            disabled={order.status === 'shipped'}
                            style={{
                              ...styles.shipBtn,
                              opacity: order.status === 'shipped' ? 0.4 : 1,
                              cursor: order.status === 'shipped' ? 'not-allowed' : 'pointer',
                            }}
                          >
                            Ship Order
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#f0ece4', marginBottom: 32 },
  error: { background: 'rgba(220,60,60,0.1)', border: '1px solid rgba(220,60,60,0.25)', color: '#e05555', padding: '12px 16px', borderRadius: 8, marginBottom: 20, textAlign: 'center', fontSize: '0.85rem' },
  card: { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 16, marginBottom: 32, overflow: 'hidden' },
  cardHeader: { background: '#1f1b1b', padding: '16px 24px', borderBottom: '1px solid #2a2a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, color: '#f0ece4', fontSize: '0.85rem' },
  cardBody: { padding: 24 },
  address: { color: '#7a7570', fontSize: '0.85rem', margin: '0 0 20px', lineHeight: 1.5 },
  tableWrap: { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 12, overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 550 },
  th: { padding: '14px 18px', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a7570', textAlign: 'left', borderBottom: '1px solid #2a2a2a', background: '#1f1b1b', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #2a2a2a' },
  td: { padding: '14px 18px', color: '#f0ece4', fontSize: '0.85rem', verticalAlign: 'middle' },
  qtyBadge: { background: 'rgba(205,218,156,0.15)', color: '#cdda9c', fontSize: '0.7rem', padding: '2px 8px', borderRadius: 100, marginLeft: 4 },
  paymentBadge: { background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100, whiteSpace: 'nowrap' },
  statusBadge: { fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100, whiteSpace: 'nowrap', border: '1px solid' },
  shipBtn: { background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '7px 14px', fontSize: '0.75rem', whiteSpace: 'nowrap' },
};