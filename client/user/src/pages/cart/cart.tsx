// pages/cart/cart.tsx
import { Link } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { CartItem } from '@/components/cart/CartItem'
import { EmptyState, Button, Spinner } from '@/components/ui'
import styles from './cart.module.css'

export default function Cart() {
  const { cart, loading, error, updateQuantity, removeItem, refresh } = useCart()

  if (loading) return <div className={styles.loading}><Spinner size="lg" /><p>Loading cart...</p></div>
  if (error) return <EmptyState icon="⚠️" title="Failed to load cart" description={error} action={<button onClick={refresh} className={styles.retryBtn}>Retry</button>} />

  if (cart.products.length === 0) {
    return (
      <div className={styles.page}>
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
          action={<Link to="/products" className={styles.cta}>Start Shopping</Link>}
        />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Shopping <span>Cart</span></h1>
      </header>

      <div className={styles.list}>
        {cart.products.map(item => (
          <CartItem
            key={item._id}
            item={item}
            onPlus={() => updateQuantity(item._id, item.item, 1)}
            onMinus={() => updateQuantity(item._id, item.item, -1)}
            onRemove={() => removeItem(item._id, item.item)}
          />
        ))}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span>Subtotal ({cart.products.length} items)</span>
          <span>₹{cart.grandTotal.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className={styles.summaryRowTotal}>
          <span>Total</span>
          <span>₹{cart.grandTotal.toFixed(2)}</span>
        </div>

        <Link to="/checkout">
          <Button fullWidth className={styles.checkoutBtn}>Proceed to Checkout</Button>
        </Link>

        <p className={styles.continue}><Link to="/products">← Continue Shopping</Link></p>
      </div>
    </div>
  )
}