// components/layout/Header.tsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/hooks/useCart'
import styles from './Header.module.css'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { cart, loading } = useCart(user != null)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <span className={styles.brandName}>E-Shop</span>
      </Link>

      <nav className={styles.nav}>
        <Link to="/products" className={styles.navLink}>Shop</Link>
        {user && (
          <>
            <Link to="/cart" className={styles.cartLink}>
              Cart
              {!loading && cart.products.length > 0 && (
                <span className={styles.cartCount}>{cart.products.length}</span>
              )}
            </Link>
            <Link to="/orders" className={styles.navLink}>Orders</Link>
            <div className={styles.userMenu}>
              <span className={styles.userName}>{user.firstname}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </div>
          </>
        )}
        {!user && (
          <div className={styles.authButtons}>
            <Link to="/login" className={styles.authBtn}>Login</Link>
            <Link to="/signup" className={styles.authBtnPrimary}>Sign Up</Link>
          </div>
        )}
      </nav>
    </header>
  )
}