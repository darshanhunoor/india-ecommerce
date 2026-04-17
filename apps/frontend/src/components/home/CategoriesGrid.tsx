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
    gradient: 'from-[#0F172A] via-[#1e3a8a] to-[#1e40af]',
    count: '120+ styles',
  },
  {
    label: 'Women',
    slug: 'women',
    emoji: '👗',
    gradient: 'from-[#4a0030] via-[#831843] to-[#be185d]',
    count: '200+ styles',
  },
  {
    label: 'Kids',
    slug: 'kids',
    emoji: '🧒',
    gradient: 'from-[#78350f] via-[#b45309] to-[#d97706]',
    count: '80+ styles',
  },
  {
    label: 'Electronics',
    slug: 'electronics',
    emoji: '📱',
    gradient: 'from-[#064e3b] via-[#065f46] to-[#0d9488]',
    count: '50+ products',
  },
  {
    label: 'Home & Kitchen',
    slug: 'home-kitchen',
    emoji: '🏠',
    gradient: 'from-[#1c1917] via-[#292524] to-[#44403c]',
    count: '90+ products',
  },
  {
    label: 'All Products',
    slug: '',
    emoji: '✨',
    gradient: 'from-[#3b0764] via-[#6d28d9] to-[#7c3aed]',
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
              className={`group relative block overflow-hidden rounded-2xl sm:rounded-3xl aspect-[4/3] ${
                i === 5 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} transition-transform duration-500 group-hover:scale-105`} />

              {/* Noise overlay */}
              <div className="absolute inset-0 opacity-[0.06]" style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
              }} />

              {/* Emoji icon — large, decorative */}
              <div className="absolute top-4 right-4 text-4xl sm:text-5xl opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-300">
                {cat.emoji}
              </div>

              {/* Hover lift shadow */}
              <div className="absolute inset-0 shadow-card transition-shadow duration-300 group-hover:shadow-card-hover rounded-2xl sm:rounded-3xl" />

              {/* Bottom overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 sm:p-4">
                <div className="font-display font-black text-white text-lg sm:text-xl leading-tight">{cat.label}</div>
                <div className="text-white/60 text-xs font-medium mt-0.5">{cat.count}</div>
              </div>

              {/* Hover arrow */}
              <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
                <ArrowRight size={14} className="text-white" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
