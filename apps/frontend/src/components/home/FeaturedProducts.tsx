'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight } from 'lucide-react';
import AddToCartButton from '../AddToCartButton';
import { motionVariants } from '@/styles/design-system';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  brand?: string;
  images: string[];
  price_paise: number;
  mrp_paise: number;
  discountPercentage: number;
  stock: number;
  average_rating: number;
}

export default function FeaturedProducts({
  products,
  locale,
}: {
  products: Product[];
  locale: string;
}) {
  const featured = products.slice(0, 9);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* Header */}
      <motion.div
        variants={motionVariants.stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
      >
        <motion.div variants={motionVariants.item}>
          <span className="badge badge-navy mb-2">Curated for you</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-900">
            Featured <span className="gradient-text">Products</span>
          </h2>
        </motion.div>
        <motion.div variants={motionVariants.item}>
          <Link href="/products" className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 group transition-colors">
            View all products
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>

      {/* 3 / 2 / 1 col grid */}
      <motion.div
        variants={motionVariants.stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
      >
        {featured.map((p) => {
          const name = p.name[locale] || p.name['en'];
          const discount = p.discountPercentage;

          return (
            <motion.article
              key={p.id}
              variants={motionVariants.item}
              className="card group flex flex-row sm:flex-col overflow-hidden"
            >
              {/* Image */}
              <Link
                href={`/products/${p.slug}`}
                className="relative w-32 sm:w-full flex-shrink-0 sm:flex-shrink aspect-square sm:aspect-[4/3] block overflow-hidden bg-navy-50"
              >
                {p.images[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={name}
                    fill
                    sizes="(max-width:640px) 128px, (max-width:1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl bg-navy-100">🏷️</div>
                )}
                {discount > 0 && (
                  <span className="absolute top-3 left-3 badge badge-saffron px-2 py-0.5">
                    {discount}% OFF
                  </span>
                )}
                {p.stock === 0 && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <span className="bg-navy-900/85 text-white px-3 py-1 rounded-full font-bold text-xs">OUT OF STOCK</span>
                  </div>
                )}
              </Link>

              {/* Info */}
              <div className="flex flex-col flex-grow p-4 sm:p-5">
                {p.brand && (
                  <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1">{p.brand}</span>
                )}
                <Link href={`/products/${p.slug}`} className="hover:text-primary-600 transition-colors">
                  <h3 className="font-semibold text-navy-900 text-sm sm:text-base line-clamp-2 leading-snug mb-2">{name}</h3>
                </Link>

                {p.average_rating > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className={i < Math.round(p.average_rating) ? 'fill-amber-400 text-amber-400' : 'text-navy-200'}
                      />
                    ))}
                    <span className="text-[10px] text-muted ml-1">{p.average_rating.toFixed(1)}</span>
                  </div>
                )}

                <div className="flex items-baseline gap-2 mb-4 mt-auto">
                  <span className="font-black text-navy-900 text-base sm:text-lg">
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
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
