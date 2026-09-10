// pages/landing/landing.tsx
import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product/ProductCard/ProductCard'
import { Spinner } from '@/components/ui'
import { EmptyState } from '@/components/ui'
import styles from './landing.module.css'

export default function Landing() {
  const { products, loading, error } = useProducts()

  return (
    <div className={styles.page}>
      {/* Hero section - no local header, global Header from PageLayout */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Curated <span>Collection</span></h1>
          <p className={styles.heroSub}>Handpicked pieces, just for you</p>
          <Link to="/products" className={styles.cta}>Shop Now</Link>
        </div>
      </section>

      {/* Featured products */}
      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured</h2>
          <Link to="/products" className={styles.viewAll}>View all →</Link>
        </div>

        {loading ? (
          <div className={styles.gridLoading}>
            <Spinner size="lg" />
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <EmptyState
            icon="⚠️"
            title="Couldn't load products"
            description={error}
            action={<Link to="/products" className={styles.retryLink}>Retry</Link>}
          />
        ) : !Array.isArray(products) ? (
          <EmptyState
            icon="📦"
            title="No products yet"
            description="Check back soon for new arrivals."
          />
        ) : (
          <div className={styles.grid}>
            {products.slice(0, 8).map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}