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
        <span className={styles.brandName}>Shop</span>
      </Link>

      <nav className={styles.nav}>
        <Link to="/products" className={styles.navLink}>Shop</Link>
        {user && (
          <>
            <Link to="/cart" className={styles.cartLink}>
              CART
              {!loading && cart.products.length > 0 && (
                <span className={styles.cartCount}>{cart.products.length}</span>
              )}
            </Link>
            <Link to="/orders" className={styles.navLink}>Orders</Link>
            <div className={styles.userMenu}>
              <details className={styles.dropdownWrapper}>
                <summary className={styles.logoutBtn}>MENU</summary>
                <div className={styles.dropdownMenu}>
                  <Link to="/profile" className={styles.dropdownItem}>
                    profile
                  </Link>
                  <Link to="/orders" className={styles.dropdownItem}>
                    Track Order
                  </Link>
                  <Link to="/services" className={styles.dropdownItem}>
                    Our Services
                  </Link>
                  <Link to="/support" className={styles.dropdownItem}>
                    Contact Customer Support
                  </Link>
                  <Link to="/privacy-policy" className={styles.dropdownItem}>
                    Privacy Policy
                  </Link>
                  <button onClick={handleLogout} className={styles.dropdownItem}>
                    Logout
                  </button>
                </div>
              </details>
            </div>
          </>
        )}
        {!user && (
          <div className={styles.authButtons}>
            <details className={styles.dropdownWrapper}>
              <summary className={styles.authBtn}>Sign In</summary>
              <div className={styles.dropdownMenu}>
                <Link to="/login" className={styles.dropdownItem}>
                  Login
                </Link>
                <Link to="/signup" className={styles.dropdownItem}>
                  Sign Up
                </Link>
              </div>
            </details>
          </div>
        )}
      </nav>
    </header>
  )
}