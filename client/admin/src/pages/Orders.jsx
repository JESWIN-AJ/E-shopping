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

  if (loading) return <p style={{ color: '#666666', padding: 60 }}>Loading...</p>;

  return (
    <div>
      <h1 style={styles.title}>Order <span style={{ color: '#000000' }}>Management</span></h1>

      {error && <div style={styles.error}>{error}</div>}

      {groupedOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#666666' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#000000', marginBottom: 8 }}>No orders yet</h3>
          <p>Orders will appear here once customers make purchases.</p>
        </div>
      ) : (
        groupedOrders.map((group) => (
          <div key={group.userId} style={styles.card}>
            <div style={styles.cardHeader}>
              <span><strong style={{ color: '#000000' }}>User ID:</strong> {group.userId}</span>
              <span><strong style={{ color: '#000000' }}>Contact:</strong> {group.mobile}</span>
            </div>
            <div style={styles.cardBody}>
              <p style={styles.address}><strong style={{ color: '#111111' }}>Shipping Address:</strong> {group.address}</p>

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
                        <td style={{ ...styles.td, color: '#000000', fontWeight: 600 }}>₹{order.totalAmount}</td>
                        <td style={styles.td}>
                          <span style={styles.paymentBadge}>{order.paymentmethod}</span>
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadge,
                            background: order.status === 'shipped' ? '#000000' : '#ffffff',
                            color: order.status === 'shipped' ? '#ffffff' : '#333333',
                            borderColor: '#000000',
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
  title: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#000000', marginBottom: 32 },
  error: { background: '#fbe9e9', border: '1px solid #a30000', color: '#a30000', padding: '12px 16px', borderRadius: 8, marginBottom: 20, textAlign: 'center', fontSize: '0.85rem' },
  card: { background: '#ffffff', border: '1px solid #000000', borderRadius: 16, marginBottom: 32, overflow: 'hidden' },
  cardHeader: { background: '#f5f5f5', padding: '16px 24px', borderBottom: '1px solid #000000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, color: '#111111', fontSize: '0.85rem' },
  cardBody: { padding: 24 },
  address: { color: '#666666', fontSize: '0.85rem', margin: '0 0 20px', lineHeight: 1.5 },
  tableWrap: { background: '#ffffff', border: '1px solid #cccccc', borderRadius: 12, overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 550 },
  th: { padding: '14px 18px', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#333333', textAlign: 'left', borderBottom: '1px solid #000000', background: '#f5f5f5', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #e0e0e0' },
  td: { padding: '14px 18px', color: '#111111', fontSize: '0.85rem', verticalAlign: 'middle' },
  qtyBadge: { background: '#f0f0f0', color: '#333333', fontSize: '0.7rem', padding: '2px 8px', borderRadius: 100, marginLeft: 4, border: '1px solid #cccccc' },
  paymentBadge: { background: '#f5f5f5', border: '1px solid #999999', color: '#111111', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100, whiteSpace: 'nowrap' },
  statusBadge: { fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100, whiteSpace: 'nowrap', border: '1px solid' },
  shipBtn: { background: '#ffffff', border: '1px solid #000000', color: '#000000', borderRadius: 8, padding: '7px 14px', fontSize: '0.75rem', whiteSpace: 'nowrap' },
};