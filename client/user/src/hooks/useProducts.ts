// src/hooks/useProducts.ts
import { useState, useEffect } from 'react'
import { productService } from '@/services/productService'
import type { Product } from '@/types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    productService.getProducts()
      .then((data) => { if (mounted) setProducts(data) })
      .catch(() => { if (mounted) setError('Failed to load products') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return { products, loading, error }
}