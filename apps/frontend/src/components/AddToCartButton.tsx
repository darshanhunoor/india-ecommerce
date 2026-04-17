'use client';

import { ShoppingCart, Check, Loader2, Zap } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({ product }: { product: any }) {
  const { addItem, isItemLoading } = useCartStore();
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const loading = isItemLoading(product.id);
  const outOfStock = product.stock === 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading || outOfStock || added) return;
    await addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000); // show "Buy Now" for 3s
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/cart');
  };

  if (outOfStock) {
    return (
      <button disabled className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 px-4 font-semibold rounded-xl text-sm bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed">
        <ShoppingCart size={16} />
        Out of Stock
      </button>
    );
  }

  // After adding — show two micro-buttons side by side
  if (added) {
    return (
      <div className="mt-auto flex gap-2">
        <button
          onClick={handleAdd}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 font-semibold rounded-xl text-xs bg-green-50 dark:bg-green-900/30 text-green-600 border border-green-200 dark:border-green-700 transition-all"
        >
          <Check size={14} />
          Added!
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 font-bold rounded-xl text-xs text-white
            bg-gradient-to-r from-primary-600 to-violet-600
            hover:from-primary-700 hover:to-violet-700
            shadow-md shadow-primary-500/30
            transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Zap size={14} />
          Buy Now
        </button>
      </div>
    );
  }

  // Default state
  return (
    <button
      disabled={loading}
      onClick={handleAdd}
      className={`mt-auto w-full flex items-center justify-center gap-2 py-2.5 px-4 font-semibold rounded-xl transition-all duration-300 text-sm
        ${loading
          ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-400 cursor-wait'
          : 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 hover:bg-primary-600 hover:text-white hover:shadow-lg hover:shadow-primary-500/20 hover:-translate-y-0.5'
        }`}
    >
      {loading
        ? <Loader2 size={16} className="animate-spin" />
        : <ShoppingCart size={16} />
      }
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
