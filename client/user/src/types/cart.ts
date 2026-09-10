import type { Product } from './product'

export interface CartItem {
  _id: string
  item: string
  quantity: number
  product: Product
  total: number
}

export interface CartResponse {
  products: CartItem[]
  grandTotal: number
}