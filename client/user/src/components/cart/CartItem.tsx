// components/cart/CartItem.tsx
import type { CartItem as CartItemType } from '@/types'
import styles from './CartItem.module.css'

interface CartItemProps {
  item: CartItemType
  onPlus: () => void
  onMinus: () => void
  onRemove: () => void
  loading?: boolean
}

export function CartItem({ item, onPlus, onMinus, onRemove, loading }: CartItemProps) {
  const { product, quantity, total } = item

  return (
    <div className={styles.row}>
      <div className={styles.imageWrap}>
        {product.image ? (
          <img src={product.image} alt={product.name} className={styles.image} />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>
      <div className={styles.info}>
        <h4 className={styles.name}>{product.name}</h4>
        <p className={styles.price}>₹{product.price} each</p>
      </div>
      <div className={styles.qty}>
        <button onClick={onMinus} disabled={loading} className={styles.qtyBtn} aria-label="Decrease">−</button>
        <span className={styles.qtyVal}>{quantity}</span>
        <button onClick={onPlus} disabled={loading} className={styles.qtyBtn} aria-label="Increase">+</button>
      </div>
      <div className={styles.total}>₹{total.toFixed(2)}</div>
      <button onClick={onRemove} disabled={loading} className={styles.removeBtn} aria-label="Remove">
        ✕
      </button>
    </div>
  )
}