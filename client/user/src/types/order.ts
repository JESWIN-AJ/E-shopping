export type OrderStatus = 'placed' | 'pending' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentMethod = 'cod' | 'online'

export interface OrderProduct {
  item: string
  name: string
  quantity: number
  price: number
  total: number
}

export interface Order {
  _id: string
  userId: string
  deliveryDetails: {
    mobile: string
    pincode: string
    address: string
  }
  paymentmethod: PaymentMethod
  products: OrderProduct[]
  totalAmount: number
  status: OrderStatus
  Date: string
}