// src/hooks/useCart.ts
import { useState, useEffect, useCallback } from 'react';
import { cartService } from '@/services/cartService';
import type { CartResponse } from '@/types';

export function useCart(enabled = true) {
  const [cart, setCart] = useState<CartResponse>({ products: [], grandTotal: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!enabled) { setLoading(false); return; }
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => { fetchCart() }, [fetchCart]);

  const addToCart = async (productId: string) => {
    await cartService.addToCart(productId);
    await fetchCart();
  };

  const updateQuantity = async (cartId: string, productId: string, count: number) => {
    await cartService.updateQuantity(cartId, productId, count);
    await fetchCart();
  };

  const removeItem = async (cartId: string, productId: string) => {
    await cartService.removeItem(cartId, productId);
    await fetchCart();
  };

  return { cart, loading, error, addToCart, updateQuantity, removeItem, refresh: fetchCart };
}