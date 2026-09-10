// src/services/productService.ts
import api from '@/api/axios'
import type { Product } from '@/types'
import { ENDPOINTS } from '@/config/constants'

export const productService = {
  // GET / — returns { products: Product[] }
  getProducts: async (): Promise<Product[]> => {
    const res = await api.get<{ products: Product[] }>(ENDPOINTS.PRODUCTS)
    return res.data.products
  }
}