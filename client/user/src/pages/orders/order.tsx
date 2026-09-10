// pages/orders/orders.tsx
import { useOrders } from '@/hooks/useOrders'
import { OrderCard } from '@/components/order/OrderCard'
import { Spinner } from '@/components/ui'
import { EmptyState } from '@/components/ui'
import styles from './order.module.css'

export default function Orders() {
  const { orders, loading, error, refresh } = useOrders()

  if (loading) return <div className={styles.loading}><Spinner size="lg" /><p>Loading orders...</p></div>
  if (error) return <EmptyState icon="⚠️" title="Failed to load orders" description={error} action={<button onClick={refresh} className={styles.retryBtn}>Retry</button>} />

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>My <span>Orders</span></h1>
        <p className={styles.sub}>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </header>

      {orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders yet"
          description="Your order history will appear here."
          action={<a href="/products" className={styles.cta}>Start Shopping</a>}
        />
      ) : (
        <div className={styles.list}>
          {orders.map(order => <OrderCard key={order._id} order={order} />)}
        </div>
      )}
    </div>
  )
}