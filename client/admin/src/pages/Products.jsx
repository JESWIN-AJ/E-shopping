import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get('/admin/');
      setProducts(res.data.products);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/admin/delete-product/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (loading) return <p style={{ color: '#7a7570' }}>Loading...</p>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Product <span style={{ color: '#c9a84c' }}>Management</span></h1>
        <Link to="/products/add" style={styles.addBtn}>+ Add Product</Link>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} style={styles.tr}>
                <td style={styles.td}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={styles.thumb} />
                  ) : (
                    <div style={{ ...styles.thumb, background: '#1e1e1e' }} />
                  )}
                </td>
                <td style={{ ...styles.td, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{p.name}</td>
                <td style={styles.td}><span style={styles.badge}>{p.category}</span></td>
                <td style={{ ...styles.td, color: '#c9a84c' }}>₹{p.price}</td>
                <td style={{ ...styles.td, color: '#7a7570', fontSize: '0.82rem' }}>{p.description}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/products/${p._id}/edit`} style={styles.editBtn}>Edit</Link>
                    <button onClick={() => handleDelete(p._id, p.name)} style={styles.deleteBtn}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} style={{ ...styles.td, textAlign: 'center', color: '#7a7570', padding: 60 }}>No products found</td></tr>
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
  tableWrap: { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 16, overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 600 },
  th: { padding: '16px 20px', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a7570', textAlign: 'left', borderBottom: '1px solid #2a2a2a', background: '#1f1b1b' },
  tr: { borderBottom: '1px solid #2a2a2a', transition: '0.2s' },
  td: { padding: '16px 20px', color: '#f0ece4', fontSize: '0.88rem', verticalAlign: 'middle' },
  thumb: { width: 52, height: 52, borderRadius: 10, objectFit: 'cover', border: '1px solid #2a2a2a' },
  badge: { background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100, whiteSpace: 'nowrap' },
  editBtn: { background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '7px 14px', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'none' },
  deleteBtn: { background: 'rgba(220,60,60,0.1)', border: '1px solid rgba(220,60,60,0.25)', color: '#e05555', borderRadius: 8, padding: '7px 14px', fontSize: '0.75rem', cursor: 'pointer' },
};