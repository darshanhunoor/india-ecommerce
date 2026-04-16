import {setRequestLocale} from 'next-intl/server';
import { ChevronDown, SlidersHorizontal, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';

async function getProducts() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // Using no-store for MVP to always fetch fresh products
    const res = await fetch(`${apiUrl}/api/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
}

export default async function ProductsPage({params: {locale}}: {params: {locale: string}}) {
  setRequestLocale(locale);
  
  const { data: products } = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-foreground">Explore Collection</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-full bg-surface text-sm font-medium hover:bg-surface-hover transition-colors">
            <SlidersHorizontal size={16} />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-full bg-surface text-sm font-medium hover:bg-surface-hover transition-colors">
            Sort By
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-border shadow-sm">
          <p className="text-lg text-slate-500 font-medium">No products found. (Ensure Backend is running on port 3001)</p>
          <p className="text-sm text-slate-400 mt-2">Run `npm run start:dev` in the apps/backend folder.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p: Record<string, any>, i: number) => (
            <Link href={`/products/${p.slug}`} key={p.id} className="glass-card overflow-hidden group flex flex-col animate-slide-up" style={{animationDelay: `${(i % 10) * 50}ms`}}>
              <div className="h-64 bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex-shrink-0">
                <Image 
                  src={p.images[0]} 
                  alt={p.name[locale] || p.name['en']} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                 {p.discountPercentage > 0 && (
                   <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-accent-500 shadow-sm">
                     {p.discountPercentage}% OFF
                   </div>
                 )}
                 {p.stock === 0 && (
                   <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                     <span className="bg-black/80 text-white px-4 py-1.5 rounded-full font-bold text-sm">OUT OF STOCK</span>
                   </div>
                 )}
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="text-xs text-slate-500 mb-1 font-medium">{p.brand}</div>
                <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{p.name[locale] || p.name['en']}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-lg font-bold text-primary-600">₹{(p.price_paise / 100).toLocaleString('en-IN')}</span>
                  {p.mrp_paise > p.price_paise && (
                    <span className="text-sm text-slate-400 line-through">₹{(p.mrp_paise / 100).toLocaleString('en-IN')}</span>
                  )}
                </div>
                <AddToCartButton product={p} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
