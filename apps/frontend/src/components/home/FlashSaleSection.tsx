'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap } from 'lucide-react';
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
}

// Flash sale ends at midnight
function getFlashSaleEnd() {
  const end = new Date();
  end.setHours(23, 59, 59, 0);
  return end;
}

function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      h: Math.floor((diff / (1000 * 60 * 60)) % 24),
      m: Math.floor((diff / (1000 * 60)) % 60),
      s: Math.floor((diff / 1000) % 60),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  });
  return time;
}

const Pad = (n: number) => String(n).padStart(2, '0');

export default function FlashSaleSection({ products }: { products: Product[] }) {
  const end = getFlashSaleEnd();
  const { h, m, s } = useCountdown(end);
  const saleProducts = products.filter(p => p.discountPercentage >= 30).slice(0, 8);

  if (!saleProducts.length) return null;

  return (
    <section className="bg-navy-900 texture-noise py-12 sm:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          variants={motionVariants.stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <motion.div variants={motionVariants.item} className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-navy-50 flex items-center gap-2">
              <Zap size={24} className="text-primary-500" />
              Flash Sale
            </h2>
          </motion.div>

          {/* Countdown */}
          <motion.div variants={motionVariants.item} className="flex items-center gap-2">
            <span className="text-navy-400 text-sm font-medium">Ends in</span>
            {[['h', h], ['m', m], ['s', s]].map(([unit, val]) => (
              <div key={unit as string} className="flex flex-col items-center">
                <div className="bg-primary-500 text-navy-50 font-black text-lg sm:text-xl w-12 h-12 rounded-xl flex items-center justify-center tabular-nums shadow-glow-saffron">
                  {Pad(val as number)}
                </div>
                <span className="text-navy-500 text-[9px] font-bold uppercase mt-1">{unit}</span>
              </div>
            ))}
            <Link href="/products" className="ml-2 btn-primary text-sm px-4 py-2.5 rounded-xl hidden sm:flex items-center gap-1.5">
              View All <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Horizontal scroll row */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {saleProducts.map((p, i) => {
            const name = p.name['en'];
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex-shrink-0 w-44 sm:w-52 bg-navy-800/60 border border-navy-700 rounded-2xl overflow-hidden group hover:border-primary-500/50 transition-colors duration-200"
              >
                <Link href={`/products/${p.slug}`}>
                  <div className="relative aspect-square overflow-hidden">
                    {p.images[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={name}
                        fill
                        sizes="208px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-navy-700 flex items-center justify-center text-4xl">🏷️</div>
                    )}
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {p.discountPercentage}% OFF
                    </div>
                  </div>
                </Link>
                <div className="p-3">
                  <p className="text-navy-50 text-xs font-semibold line-clamp-2 mb-2">{name}</p>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-primary-400 font-black text-sm">₹{(p.price_paise / 100).toLocaleString('en-IN')}</span>
                    <span className="text-navy-500 text-[10px] line-through">₹{(p.mrp_paise / 100).toLocaleString('en-IN')}</span>
                  </div>
                  <AddToCartButton product={p} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
