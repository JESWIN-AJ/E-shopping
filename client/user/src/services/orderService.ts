// src/services/orderService.ts
import api from '@/api/axios'
import type { Order } from '@/types'
import { ENDPOINTS } from '@/config/constants'

export const orderService = {
  // GET /order-success — returns { orders: Order[] }
  getOrders: async (): Promise<Order[]> => {
    const res = await api.get<{ orders: Order[] }>(ENDPOINTS.ORDERS)
    return res.data.orders
  }
}