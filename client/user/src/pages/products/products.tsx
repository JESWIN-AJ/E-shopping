import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product/ProductCard/ProductCard'
import { Spinner } from '@/components/ui'
import { EmptyState } from '@/components/ui'
import styles from './product.module.css'

export default function Products() {
  const { products, loading, error } = useProducts()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>All <span>Products</span></h1>
        <p className={styles.sub}>Browse our complete collection</p>
      </header>

      {loading ? (
        <div className={styles.loading}>
          <Spinner size="lg" />
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <EmptyState
          icon="⚠️"
          title="Failed to load"
          description={error}
          action={<button onClick={() => window.location.reload()} className={styles.retryBtn}>Retry</button>}
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No products available"
          description="Check back later for new arrivals."
        />
      ) : (
        <div className={styles.grid}>
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  )
}