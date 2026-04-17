'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motionVariants } from '@/styles/design-system';

const CATEGORIES = [
  {
    label: 'Men',
    slug: 'men',
    emoji: '👔',
    hslStart: 'hsl(222, 47%, 20%)',
    hslEnd: 'hsl(217, 91%, 45%)',
    count: '120+ styles',
  },
  {
    label: 'Women',
    slug: 'women',
    emoji: '👗',
    hslStart: 'hsl(330, 75%, 25%)',
    hslEnd: 'hsl(335, 85%, 55%)',
    count: '200+ styles',
  },
  {
    label: 'Kids',
    slug: 'kids',
    emoji: '🧒',
    hslStart: 'hsl(25, 85%, 35%)',
    hslEnd: 'hsl(35, 95%, 55%)',
    count: '80+ styles',
  },
  {
    label: 'Electronics',
    slug: 'electronics',
    emoji: '📱',
    hslStart: 'hsl(170, 75%, 20%)',
    hslEnd: 'hsl(175, 80%, 40%)',
    count: '50+ products',
  },
  {
    label: 'Home & Kitchen',
    slug: 'home-kitchen',
    emoji: '🏠',
    hslStart: 'hsl(15, 60%, 25%)',
    hslEnd: 'hsl(20, 65%, 50%)',
    count: '90+ products',
  },
  {
    label: 'All Products',
    slug: '',
    emoji: '✨',
    hslStart: 'hsl(265, 75%, 30%)',
    hslEnd: 'hsl(275, 85%, 55%)',
    count: 'Browse all',
  },
];

export default function CategoriesGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* Header */}
      <motion.div
        variants={motionVariants.stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
      >
        <motion.div variants={motionVariants.item}>
          <span className="badge badge-saffron mb-2">Shop by Category</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-900">
            Find Your <span className="gradient-text">Style</span>
          </h2>
        </motion.div>
        <motion.div variants={motionVariants.item}>
          <Link href="/products" className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors group">
            View all categories
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>

      {/* 2x3 Grid */}
      <motion.div
        variants={motionVariants.stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
      >
        {CATEGORIES.map((cat, i) => (
          <motion.div key={cat.slug} variants={motionVariants.item}>
            <Link
              href={cat.slug ? `/products?cat=${cat.slug}` : '/products'}
              className={`group relative block overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] aspect-[4/3] border border-white/10 shadow-sm hover:shadow-2xl transition-shadow duration-300 ${
                i === 5 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              {/* Background gradient using HSL */}
              <div 
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${cat.hslStart} 0%, ${cat.hslEnd} 100%)` }}
              />

              {/* Noise overlay */}
              <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay" style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
              }} />

              {/* Decorative Glow */}
              <div 
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                style={{ background: cat.hslEnd }}
              />

              {/* Emoji icon — large, decorative */}
              <div className="absolute top-5 right-5 text-5xl sm:text-6xl opacity-70 group-hover:opacity-100 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 transform origin-center">
                {cat.emoji}
              </div>

              {/* Bottom overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[hsl(0,0%,0%)] via-[hsla(0,0%,0%,0.3)] to-transparent p-5 sm:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="font-display font-black text-white text-xl sm:text-2xl leading-tight tracking-wide">{cat.label}</div>
                <div className="text-white/80 text-sm font-semibold tracking-wider mt-1">{cat.count}</div>
              </div>

              {/* Hover arrow */}
              <div className="absolute bottom-6 right-5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md shadow-inner flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-500 border border-white/20">
                <ArrowRight size={14} className="text-navy-50" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
