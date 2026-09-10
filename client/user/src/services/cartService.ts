// src/services/cartService.ts
import api from '@/api/axios';
import type { CartResponse } from '@/types';
import { ENDPOINTS } from '@/config/constants';

export const cartService = {
  getCart: async (): Promise<CartResponse> => {
    const res = await api.get<CartResponse>(ENDPOINTS.CART);
    return res.data;
  },

  addToCart: async (productId: string): Promise<{ status: boolean }> => {
    const res = await api.post<{ status: boolean }>(`${ENDPOINTS.ADD_TO_CART}/${productId}`);
    return res.data;
  },

  updateQuantity: async (cartId: string, productId: string, count: number): Promise<{ status: boolean }> => {
    const res = await api.post<{ status: boolean }>(ENDPOINTS.UPDATE_QTY, {
      cart: cartId,
      product: productId,
      count,
    });
    return res.data;
  },

  removeItem: async (cartId: string, productId: string): Promise<{ status: boolean }> => {
    const res = await api.post<{ status: boolean }>(ENDPOINTS.REMOVE_FROM_CART, {
      cart: cartId,
      product: productId,
    });
    return res.data;
  },
};