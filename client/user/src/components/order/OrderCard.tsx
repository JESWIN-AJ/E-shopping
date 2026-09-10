// components/order/OrderCard.tsx
import type { Order } from '@/types'
import { Badge } from '@/components/ui'
import styles from './OrderCard.module.css'

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const statusMap = {
    placed: 'success',
    pending: 'warning',
    shipped: 'primary',
    delivered: 'secondary',
    cancelled: 'danger',
  } as const

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</h3>
          <p className={styles.date}>{new Date(order.Date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <Badge variant={statusMap[order.status] as any}>{order.status}</Badge>
      </div>
      <ul className={styles.items}>
        {order.products.map((p, i) => (
          <li key={i} className={styles.item}>
            <span className={styles.itemName}>{p.name} × {p.quantity}</span>
            <span className={styles.itemTotal}>₹{p.total.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <span className={styles.method}>Payment: {order.paymentmethod === 'cod' ? 'Cash on Delivery' : 'Online'}</span>
        <span className={styles.grandTotal}>Total: ₹{order.totalAmount.toFixed(2)}</span>
      </div>
    </article>
  )
}