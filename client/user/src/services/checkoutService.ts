// src/services/checkoutService.ts
import api from '@/api/axios'
import type { CartResponse } from '@/types'
import { ENDPOINTS } from '@/config/constants'

// Request payload for placing order
export interface PlaceOrderPayload {
  userId: string
  mobile: string
  pincode: string
  address: string
  payment: 'cod' | 'online'
}

// Backend response for COD success or Razorpay order
export interface CheckoutResponse {
  codSuccess?: boolean
  orderId?: string
  // Razorpay order fields (when payment === 'online')
  id?: string
  amount?: number
  currency?: string
  receipt?: string
  error?: string
}

// Payload for payment verification
export interface VerifyPaymentPayload {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
  orderId: string
}

export const checkoutService = {
  // GET /checkout — returns { products: CartItem[], grandTotal: number }
  getCheckout: async (): Promise<CartResponse> => {
    const res = await api.get<CartResponse>(ENDPOINTS.CHECKOUT)
    return res.data
  },

  // POST /checkout — body: PlaceOrderPayload
  // Returns: { codSuccess: true, orderId } OR Razorpay order object
  placeOrder: async (payload: PlaceOrderPayload): Promise<CheckoutResponse> => {
    const res = await api.post<CheckoutResponse>(ENDPOINTS.CHECKOUT, payload)
    return res.data
  },

  // POST /verify-payment — body: VerifyPaymentPayload
  // Returns: { status: boolean }
  verifyPayment: async (payload: VerifyPaymentPayload): Promise<{ status: boolean }> => {
    const res = await api.post<{ status: boolean }>(ENDPOINTS.VERIFY_PAYMENT, payload)
    return res.data
  }
}