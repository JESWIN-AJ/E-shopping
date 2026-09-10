import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function AddProduct() {
  const [form, setForm] = useState({ name: '', category: '', price: '', description: '' });
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('category', form.category);
      fd.append('price', form.price);
      fd.append('description', form.description);
      if (image) fd.append('image', image);

      const res = await api.post('/admin/add-product', fd);
      if (res.data.status) {
        navigate('/');
      } else {
        setError(res.data.error || 'Failed to add product');
      }
    } catch {
      setError('Failed to add product. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={styles.section}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>Add <span style={{ color: '#c9a84c' }}>Product</span></h1>
            <p style={styles.subtext}>Fill in the details to list a new item</p>
          </div>
          <Link to="/" style={styles.backBtn}>← Back</Link>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.fieldRow}>
            <div style={styles.field}>
              <label style={styles.label}>Product Name</label>
              <input style={styles.input} name="name" value={form.name} onChange={handleChange} placeholder="e.g. Leather Wallet" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Category</label>
              <input style={styles.input} name="category" value={form.category} onChange={handleChange} placeholder="e.g. Accessories" required />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Price (₹)</label>
            <input style={styles.input} name="price" type="number" value={form.price} onChange={handleChange} placeholder="0.00" required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea style={{ ...styles.input, ...styles.textarea }} name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Describe the product..." required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Product Image</label>
            <div style={styles.fileZone}>
              <input type="file" accept="image/*" onChange={handleFile} style={styles.fileInput} />
              <div style={styles.fileIcon}>🖼</div>
              <div style={styles.fileText}><span style={{ color: '#c9a84c' }}>Click to upload</span> or drag & drop</div>
              <div style={{ ...styles.fileText, fontSize: '0.75rem' }}>PNG, JPG, WEBP supported</div>
            </div>
            <div style={styles.fileName}>{fileName}</div>
          </div>

          <hr style={styles.divider} />

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Product'}
          </button>
        </form>
      </div>
    </section>
  );
}

const styles = {
  section: { background: '#0d0d0d', minHeight: '100vh', padding: '60px 24px', fontFamily: "'DM Sans', sans-serif" },
  card: { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 16, padding: 40, maxWidth: 620, margin: '0 auto' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#f0ece4', margin: 0, marginBottom: 4 },
  subtext: { color: '#7a7570', fontSize: '0.85rem', margin: 0 },
  backBtn: { color: '#7a7570', textDecoration: 'none', fontSize: '0.85rem', padding: '8px 14px', borderRadius: 8, border: '1px solid #2a2a2a' },
  error: { background: 'rgba(220,60,60,0.1)', border: '1px solid rgba(220,60,60,0.25)', color: '#e05555', padding: '12px 16px', borderRadius: 8, marginBottom: 20, textAlign: 'center', fontSize: '0.85rem' },
  fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field: { marginBottom: 22 },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a7570', marginBottom: 8 },
  input: { width: '100%', background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 10, color: '#f0ece4', fontSize: '0.9rem', padding: '12px 16px', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif" },
  textarea: { resize: 'vertical', minHeight: 100 },
  fileZone: { position: 'relative', background: '#1e1e1e', border: '1px dashed #2a2a2a', borderRadius: 10, padding: '28px 16px', textAlign: 'center', cursor: 'pointer', transition: '0.2s' },
  fileInput: { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' },
  fileIcon: { fontSize: '1.8rem', marginBottom: 8 },
  fileText: { color: '#7a7570', fontSize: '0.82rem', marginBottom: 4 },
  fileName: { marginTop: 8, fontSize: '0.78rem', color: '#c9a84c', minHeight: 16 },
  divider: { border: 'none', borderTop: '1px solid #2a2a2a', margin: '28px 0' },
  btn: { width: '100%', background: '#c9a84c', color: '#0d0d0d', border: 'none', borderRadius: 100, padding: 14, fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', marginTop: 10 },
};