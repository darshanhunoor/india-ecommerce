'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function AddToCartButton({ product }: { product: any }) {
  const cart = useCartStore();

  return (
    <button 
      disabled={product.stock === 0 || cart.isLoading}
      onClick={(e) => {
        e.preventDefault(); // Prevents link navigation
        cart.addItem(product, 1);
      }}
      className={`mt-auto w-full flex items-center justify-center gap-2 py-2.5 font-medium rounded-xl transition-colors ${
        product.stock === 0 || cart.isLoading
          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          : 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900'
      }`}
    >
      <ShoppingCart size={18} />
      {product.stock === 0 ? 'Out of Stock' : (cart.isLoading ? 'Adding...' : 'Add to Cart')}
    </button>
  );
}
