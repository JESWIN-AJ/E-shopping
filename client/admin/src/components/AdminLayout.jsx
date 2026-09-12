import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const touchStartX = useRef(null);
  const touchCurrentX = useRef(null);

  const isActive = (path) =>
    location.pathname === path ? 'active' : '';

  // Close sidebar automatically on route change (mobile/tablet)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Swipe handling: swipe right from left edge to open, swipe left to close
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = touchStartX.current;
  };

  const handleTouchMove = (e) => {
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchCurrentX.current === null) return;
    const delta = touchCurrentX.current - touchStartX.current;

    // Opening: swipe starting near left edge, moving right
    if (!sidebarOpen && touchStartX.current < 40 && delta > 60) {
      setSidebarOpen(true);
    }
    // Closing: swipe left while open
    if (sidebarOpen && delta < -60) {
      setSidebarOpen(false);
    }

    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  return (
    <div
      className="admin-layout"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Toggle button — visible on tablet/mobile */}
      <button
        className={`sidebar-toggle ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label="Toggle sidebar"
        aria-expanded={sidebarOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Backdrop overlay for mobile/tablet when sidebar is open */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div>
        <h2 className="admin-brand">
          SHOP<span className="admin-accent">-</span>ADMIN
        </h2>

        <nav className="admin-nav">
          <Link to="/" className={`admin-link ${isActive('/')}`}>Products</Link>
          <Link to="/products/add" className={`admin-link ${isActive('/products/add')}`}>+ Add Product</Link>
          <Link to="/orders" className={`admin-link ${isActive('/orders')}`}>Orders</Link>
          <Link to="/users" className={`admin-link ${isActive('/users')}`}>Users</Link>
          <Link to="/admins" className={`admin-link ${isActive('/admins')}`}>Admins</Link>
        </nav>

        <div className="admin-bottom">
          <span className="admin-name">{admin?.email}</span>
          <button onClick={logout} className="admin-logout-btn">Logout</button>
        </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}