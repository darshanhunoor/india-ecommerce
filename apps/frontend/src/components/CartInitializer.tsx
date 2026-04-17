'use client';
import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

// Mounted once in layout — hydrates cart count from server on every page load/refresh
export default function CartInitializer() {
  const fetchCart = useCartStore(s => s.fetchCart);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // re-fetch whenever auth state changes (login/logout)

  return null; // renders nothing
}
