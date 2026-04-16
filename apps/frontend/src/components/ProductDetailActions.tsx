'use client';

import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';

export default function ProductDetailActions({ product }: { product: any }) {
  const cart = useCartStore();
  const router = useRouter();

  const handleAddToCart = () => {
    cart.addItem(product, 1);
  };

  const handleBuyNow = () => {
    // Add item to cart and immediately redirect to checkout securely
    cart.addItem(product, 1);
    router.push('/checkout');
  };

  return (
    <div className="flex gap-4 mb-8">
      <button 
        disabled={product.stock === 0 || cart.isLoading}
        onClick={handleAddToCart}
        className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-lg transition-all ${
          product.stock === 0 || cart.isLoading
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-primary-500/25 transform hover:-translate-y-0.5'
        }`}
      >
        {cart.isLoading ? <Loader2 className="animate-spin" size={20} /> : <ShoppingCart size={20} />}
        {product.stock === 0 ? 'Out of Stock' : (cart.isLoading ? 'Processing...' : 'Add to Cart')}
      </button>

      {product.stock > 0 && (
        <button 
          onClick={handleBuyNow}
          disabled={cart.isLoading}
          className="flex-1 py-4 px-6 rounded-2xl font-bold text-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all disabled:opacity-50"
        >
          Buy Now
        </button>
      )}
    </div>
  );
}
