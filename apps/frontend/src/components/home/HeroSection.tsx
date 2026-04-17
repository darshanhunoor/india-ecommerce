'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { motionVariants } from '@/styles/design-system';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-navy-900 texture-noise min-h-[88vh] flex items-center">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — Copy */}
          <motion.div
            variants={motionVariants.stagger}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.span variants={motionVariants.item} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-400 text-xs font-bold tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              New Season Arrivals
            </motion.span>

            <motion.h1 variants={motionVariants.item} className="font-display font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.08] text-balance mb-6">
              Where India{' '}
              <span className="relative inline-block">
                <span className="gradient-text">Shops</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 220 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 9C50 3 110 1 218 9" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
              {' '}Fashion
            </motion.h1>

            <motion.p variants={motionVariants.item} className="text-navy-300 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
              Premium Men, Women & Kids collections — authentic Indian brands with GST-inclusive pricing and pan-India delivery.
            </motion.p>

            <motion.div variants={motionVariants.item} className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link href="/products" className="btn-primary text-base px-7 py-3.5 rounded-2xl gap-2">
                <ShoppingBag size={18} />
                Shop Now
              </Link>
              <Link href="/products?cat=men" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base border-2 border-navy-600 text-navy-200 hover:border-primary-500 hover:text-primary-400 transition-all duration-200">
                Explore Categories
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={motionVariants.item} className="flex gap-8 mt-12 justify-center lg:justify-start">
              {[['10K+','Happy Customers'], ['1200+','Products'], ['5★','Avg Rating']].map(([num, label]) => (
                <div key={label} className="text-center lg:text-left">
                  <div className="text-2xl font-black text-white">{num}</div>
                  <div className="text-xs text-navy-400 font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Hero Product Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Main image card with slow zoom */}
            <div className="relative w-72 sm:w-80 lg:w-96">
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="rounded-3xl overflow-hidden aspect-square shadow-glow-saffron"
                style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #2d1200 100%)' }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8">
                  {/* Decorative product showcase placeholder */}
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-900/60 via-navy-800/80 to-navy-900 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="text-8xl">👗</div>
                    <div className="text-white font-display font-bold text-xl">Women's Collection</div>
                    <div className="text-primary-400 text-sm font-semibold">Starting at ₹499</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating discount badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: -8 }}
                transition={{ duration: 0.5, delay: 0.9, type: 'spring', stiffness: 200 }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-primary-500 rounded-full flex flex-col items-center justify-center shadow-glow-saffron text-white"
              >
                <span className="font-black text-xl leading-none">50%</span>
                <span className="text-[10px] font-bold opacity-90">OFF</span>
              </motion.div>

              {/* Floating trust badge bottom-left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5 text-white"
              >
                <div className="text-xs text-navy-300 font-medium">Free Delivery</div>
                <div className="text-sm font-bold">On orders above ₹499</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="#FAFAFA"/>
        </svg>
      </div>
    </section>
  );
}
