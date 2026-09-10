// Product from API GET /
export interface Product {
  _id: string
  name: string
  category: string
  price: number
  description: string
  image?: string
}

// Cart item returned by GET /cart
export interface CartItem {
  _id: string          // cart document _id
  item: string         // product _id
  quantity: number
  product: Product     // populated product
  total: number        // quantity * price
}