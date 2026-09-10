import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? 'active' : '';

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.brand}>E-SHOP<span style={styles.accent}>.</span>ADMIN</h2>
        <nav style={styles.nav}>


          <Link to="/" className={isActive('/')} style={styles.link}>Products</Link>
          <Link to="/products/add" className={isActive('/products/add')} style={styles.link}>+ Add Product</Link>
          <Link to="/orders" className={isActive('/orders')} style={styles.link}>Orders</Link>
          <Link to="/users" className={isActive('/users')} style={styles.link}>Users</Link>
          <Link to="/admins" className={isActive('/admins')} style={styles.link}>Admins</Link>
        </nav>
        <div style={styles.bottom}>
          <span style={styles.adminName}>{admin?.email}</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#0d0d0d', color: '#f0ece4', fontFamily: "'DM Sans', sans-serif" },
  sidebar: { width: 220, background: '#161616', borderRight: '1px solid #2a2a2a', padding: '24px 16px', display: 'flex', flexDirection: 'column' },
  brand: { fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', marginBottom: 32, color: '#f0ece4' },
  accent: { color: '#c9a84c' },
  nav: { display: 'flex', flexDirection: 'column', gap: 4, flex: 1 },
  link: { color: '#7a7570', textDecoration: 'none', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', transition: '0.2s' },
  bottom: { borderTop: '1px solid #2a2a2a', paddingTop: 16, marginTop: 16 },
  adminName: { fontSize: '0.8rem', color: '#7a7570', display: 'block', marginBottom: 8 },
  logoutBtn: { background: 'transparent', border: '1px solid #2a2a2a', color: '#e05555', borderRadius: 100, padding: '8px 16px', cursor: 'pointer', fontSize: '0.78rem', width: '100%' },
};