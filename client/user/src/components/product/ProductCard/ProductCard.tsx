// components/product/ProductCard.tsx
import type { Product } from '@/types'
import { useCart } from '@/hooks/useCart'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, loading: cartLoading } = useCart(false)

  const handleAdd = () => addToCart(product._id)

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        {product.image ? (
          <img src={product.image} alt={product.name} className={styles.image} />
        ) : (
          <div className={styles.placeholder} />
        )}
        <span className={styles.badge}>{product.category}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.desc}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>₹{product.price}</span>
          <button
            onClick={handleAdd}
            disabled={cartLoading}
            className={styles.addBtn}
          >
            {cartLoading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  )
}