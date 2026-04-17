'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
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
}

export default function ProductsGrid({ products, locale }: { products: Product[]; locale: string }) {
  return (
    <motion.div
      variants={motionVariants.stagger}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
    >
      {products.map((p) => {
        const name = p.name[locale] || p.name['en'];
        const discount = p.mrp_paise > p.price_paise
          ? Math.round(((p.mrp_paise - p.price_paise) / p.mrp_paise) * 100)
          : 0;

        return (
          <motion.div
            key={p.id}
            variants={motionVariants.item}
            className="card group flex flex-col overflow-hidden"
          >
            {/* Image */}
            <Link href={`/products/${p.slug}`} className="relative block">
              <div className="relative aspect-square bg-navy-100 overflow-hidden">
                {p.images[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={name}
                    fill
                    sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-navy-400 text-5xl">🏷️</div>
                )}

                {/* Badges */}
                {discount > 0 && (
                  <span className="absolute top-2 left-2 badge badge-saffron text-[10px] px-2 py-0.5">
                    {discount}% OFF
                  </span>
                )}
                {p.stock === 0 && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-navy-900/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-navy-900/85 text-white px-3 py-1 rounded-full font-bold text-xs tracking-wide">OUT OF STOCK</span>
                  </div>
                )}
              </div>
            </Link>

            {/* Info */}
            <div className="p-3 sm:p-4 flex flex-col flex-grow">
              {p.brand && (
                <span className="text-[10px] sm:text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">{p.brand}</span>
              )}

              <Link href={`/products/${p.slug}`} className="hover:text-primary-600 transition-colors">
                <h3 className="font-semibold text-navy-900 text-sm sm:text-base leading-snug line-clamp-2 mb-2">{name}</h3>
              </Link>

              {/* Rating */}
              {p.average_rating && p.average_rating > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-bold text-amber-700">{p.average_rating.toFixed(1)}</span>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-3 mt-auto">
                <span className="text-base sm:text-lg font-black text-navy-900">
                  ₹{(p.price_paise / 100).toLocaleString('en-IN')}
                </span>
                {p.mrp_paise > p.price_paise && (
                  <span className="text-xs text-muted line-through">
                    ₹{(p.mrp_paise / 100).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <AddToCartButton product={p} />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
