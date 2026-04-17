'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Bell } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import { motion } from 'framer-motion';
import { motionVariants } from '@/styles/design-system';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  brand?: string;
  images: string[];
  price_paise: number;
  mrp_paise: number;
  discountPercentage?: number;
  stock: number;
  average_rating?: number;
  reviews?: any[];
}

interface ProductCardProps {
  product: Product;
  locale: string;
  layout?: 'grid' | 'list';
}

export default function ProductCard({ product, locale, layout = 'grid' }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const name = product.name[locale] || product.name['en'];
  const p = product;
  const discount = p.discountPercentage || 0;
  const isOutOfStock = p.stock === 0;

  const reviewCount = p.reviews ? p.reviews.length : 0;

  const handleNotify = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("You will be notified when this is back in stock!");
  };

  const isList = layout === 'list';

  return (
    <motion.div variants={motionVariants.item} className={`group flex ${isList ? 'flex-row gap-4' : 'flex-col'} bg-surface border border-border hover:shadow-card hover:border-primary-100 transition-all rounded-2xl overflow-hidden ${isOutOfStock ? 'opacity-70 grayscale-[30%]' : ''}`}>
      {/* Image container */}
      <Link href={`/products/${p.slug}`} className={`relative block bg-surface-alt ${isList ? 'w-48 flex-shrink-0' : 'aspect-[4/5]'} overflow-hidden`}>
        {!imgLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        )}
        
        {p.images[0] ? (
          <>
            <Image
              src={p.images[0]}
              alt={name}
              fill
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              onLoad={() => setImgLoaded(true)}
              className={`object-cover object-top transition-all duration-700 ${p.images[1] ? 'group-hover:opacity-0' : 'group-hover:scale-105'} ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {p.images[1] && (
              <Image
                src={p.images[1]}
                alt={name + ' alternate view'}
                fill
                sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                className="object-cover object-top absolute inset-0 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-700 ease-out"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-navy-400 text-5xl">🛍️</div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="badge badge-green text-[10px] sm:text-xs font-black shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Quick Add Overlay */}
        {!isOutOfStock && !isList && (
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 bg-gradient-to-t from-black/60 to-transparent">
            {/* Quick Add To Cart Button uses the AddToCartButton with specific styles, but AddToCartButton might be custom. We'll wrap it or style it here. Actually AddToCartButton renders its own button. */}
            <div className="bg-white/95 backdrop-blur-md rounded-xl p-0.5 shadow-lg">
               <AddToCartButton product={p} />
            </div>
          </div>
        )}
      </Link>

      {/* Info Container */}
      <div className={`p-4 flex flex-col flex-1 ${isList ? 'justify-center' : ''}`}>
        
        {p.brand && (
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-1 line-clamp-1">{p.brand}</span>
        )}

        <Link href={`/products/${p.slug}`} className="hover:text-primary-600 transition-colors">
          <h3 className="font-semibold text-text-main text-sm sm:text-base leading-snug line-clamp-2 mb-2">{name}</h3>
        </Link>

        {/* Rating Row */}
        {(p.average_rating || 0) > 0 && (
          <div className="flex items-center gap-1.5 mb-2 mt-auto">
            <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md text-[11px] font-bold text-amber-700">
              <Star size={10} className="fill-amber-400 text-amber-500" />
              <span>{p.average_rating!.toFixed(1)}</span>
            </div>
            {reviewCount > 0 && <span className="text-xs text-muted">({reviewCount})</span>}
          </div>
        )}

        <div className={!p.average_rating ? 'mt-auto' : ''}></div>

        {/* Price Row */}
        <div className="flex items-baseline flex-wrap gap-1.5 mb-1">
          <span className="text-base sm:text-lg font-black text-text-heading">
            ₹{(p.price_paise / 100).toLocaleString('en-IN')}
          </span>
          {p.mrp_paise > p.price_paise && (
            <span className="text-xs text-muted line-through font-medium">
              ₹{(p.mrp_paise / 100).toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <div className="text-[10px] text-muted mb-3 flex items-center gap-1">
           GST included
        </div>

        {/* Stock / Actions */}
        {isOutOfStock ? (
           <button onClick={handleNotify} className="w-full flex items-center justify-center gap-2 py-2 md:py-2.5 bg-surface-alt hover:bg-slate-200 text-text-main font-semibold rounded-lg transition-colors text-sm border border-border">
             <Bell size={14} /> Notify Me
           </button>
        ) : (
          <div className="flex flex-col gap-2">
            {p.stock < 5 && p.stock > 0 && (
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block w-fit">
                Only {p.stock} left
              </span>
            )}
            {isList && (
              <div className="mt-2 p-0.5 w-[200px]">
                <AddToCartButton product={p} />
              </div>
            )}
          </div>
        )}

      </div>
    </motion.div>
  );
}
