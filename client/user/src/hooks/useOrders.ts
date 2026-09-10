// src/hooks/useOrders.ts
import { useState, useEffect } from 'react'
import { orderService } from '@/services/orderService'
import type { Order } from '@/types'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderService.getOrders()
      setOrders(data)
      setError(null)
    } catch {
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    await fetchOrders()
  }

  useEffect(() => {
    void fetchOrders()
  }, [])

  return { orders, loading, error, refresh }
}