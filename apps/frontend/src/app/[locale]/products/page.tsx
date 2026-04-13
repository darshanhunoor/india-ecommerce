import {useTranslations} from 'next-intl';
import {unstable_setRequestLocale} from 'next-intl/server';
import { Filter, ChevronDown, SlidersHorizontal, ShoppingCart } from 'lucide-react';

export default function ProductsPage({params: {locale}}: {params: {locale: string}}) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('ProductList');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-foreground">Explore Collection</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-full bg-surface text-sm font-medium hover:bg-surface-hover transition-colors">
            <SlidersHorizontal size={16} />
            {t('filters')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-full bg-surface text-sm font-medium hover:bg-surface-hover transition-colors">
            {t('sort')}
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="glass-card overflow-hidden group flex flex-col animate-slide-up" style={{animationDelay: `${i * 50}ms`}}>
            <div className="h-64 bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex-shrink-0">
               {/* Product Image Placeholder */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-slate-300 dark:text-slate-600 font-display font-bold">Product Image</span>
               </div>
               <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-accent-500 shadow-sm">
                 20% OFF
               </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="text-xs text-slate-500 mb-1">Brand Name</div>
              <h3 className="font-semibold text-foreground mb-1 line-clamp-1">Product Title {i}</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-lg font-bold text-primary-600">₹{1299 + i * 100}</span>
                <span className="text-sm text-slate-400 line-through">₹{1599 + i * 100}</span>
              </div>
              <button className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-medium rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors">
                <ShoppingCart size={18} />
                {t('addToCart')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
