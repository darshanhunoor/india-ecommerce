'use client';

import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductDetailActions({ product }: { product: any }) {
  const { addItem, isItemLoading } = useCartStore();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const loading = isItemLoading(product.id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = async () => {
    if (loading || outOfStock) return;
    await addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = async () => {
    if (loading || outOfStock) return;
    await addItem(product, 1);
    router.push('/cart');
  };

  return (
    <div className="flex gap-3 mb-8">
      <button
        disabled={outOfStock || loading}
        onClick={handleAddToCart}
        className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
          outOfStock
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
            : added
            ? 'bg-green-500 text-white scale-95'
            : loading
            ? 'bg-primary-100 text-primary-400 cursor-wait'
            : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-primary-500/25 transform hover:-translate-y-0.5'
        }`}
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : added ? <Check size={20} /> : <ShoppingCart size={20} />}
        {outOfStock ? 'Out of Stock' : added ? 'Added to Cart!' : loading ? 'Adding...' : 'Add to Cart'}
      </button>

      {!outOfStock && (
        <button
          onClick={handleBuyNow}
          disabled={loading}
          className="flex-1 py-4 px-6 rounded-2xl font-bold text-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-300 disabled:opacity-50"
        >
          Buy Now
        </button>
      )}
    </div>
  );
}
