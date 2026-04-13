import {setRequestLocale} from 'next-intl/server';
import { ShoppingCart, Star, ShieldCheck, Truck } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

async function getProduct(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/api/products/${slug}`, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch product');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ProductDetailPage({params}: {params: {locale: string, slug: string}}) {
  setRequestLocale(params.locale);
  const p = await getProduct(params.slug);
  
  if (!p) {
    notFound();
  }

  const name = p.name[params.locale] || p.name['en'];
  const desc = p.description[params.locale] || p.description['en'];
  const price = (p.price_paise / 100).toLocaleString('en-IN');
  const mrp = (p.mrp_paise / 100).toLocaleString('en-IN');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        
        {/* Image Gallery */}
        <div className="space-y-4 animate-fade-in">
          <div className="aspect-square relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-border">
            <Image 
              src={p.images[0]} 
              alt={name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {p.discountPercentage > 0 && (
               <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-accent-500 shadow-md">
                 {p.discountPercentage}% OFF
               </div>
            )}
          </div>
          {/* Thumbnails if > 1 image */}
          {p.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {p.images.map((img: string, i: number) => (
                <div key={i} className="aspect-square relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-border cursor-pointer hover:border-primary-500 transition-colors">
                  <Image src={img} alt={`${name} thumbnail ${i+1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col animate-slide-up" style={{animationDelay: '100ms'}}>
          <div className="text-sm text-primary-600 font-bold tracking-wider uppercase mb-2">
            {p.brand}
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            {name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500 px-2.5 py-1 rounded-md text-sm font-bold">
              <span>{p.average_rating > 0 ? p.average_rating.toFixed(1) : 'New'}</span>
              <Star size={14} className="fill-current" />
            </div>
            <span className="text-sm text-slate-500">{p.reviews?.length || 0} Ratings</span>
          </div>

          <div className="flex items-end gap-3 mb-8">
            <span className="text-4xl font-bold text-foreground">₹{price}</span>
            {p.mrp_paise > p.price_paise && (
              <span className="text-xl text-slate-400 line-through mb-1">₹{mrp}</span>
            )}
            <span className="text-xs text-slate-500 mb-2 ml-2">Inclusive of all taxes</span>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none mb-10 text-slate-600 dark:text-slate-300 border-b border-border pb-8">
            <p>{desc}</p>
          </div>

          <div className="flex gap-4 mb-8">
            <button 
              disabled={p.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-lg transition-all ${
                p.stock === 0 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-primary-500/25 transform hover:-translate-y-0.5'
              }`}
            >
              <ShoppingCart size={20} />
              {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            {p.stock > 0 && (
              <button className="flex-1 py-4 px-6 rounded-2xl font-bold text-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                Buy Now
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-auto pt-8 border-t border-border">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <Truck className="text-primary-500" />
              <span className="text-sm font-medium">Pan India Delivery</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <ShieldCheck className="text-primary-500" />
              <span className="text-sm font-medium">100% Original Products</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
