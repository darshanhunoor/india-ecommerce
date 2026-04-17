'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { motionVariants } from '@/styles/design-system';

export default function HeroSection() {
  return (
    <section className="relative z-0 overflow-hidden bg-navy-900 texture-noise min-h-[88vh] flex items-center">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary-500/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[110px] pointer-events-none -z-10" />

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

            <motion.h1 variants={motionVariants.item} className="font-display font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-navy-50 leading-[1.08] text-balance mb-6">
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
                  <div className="text-2xl font-black text-navy-50">{num}</div>
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
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="rounded-[2.5rem] overflow-hidden aspect-square border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl flex flex-col items-center justify-center relative"
              >
                {/* Decorative glow inside the card */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/20 rounded-full blur-[80px]" />

                <div className="relative z-10 flex flex-col items-center text-center gap-5">
                  <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-5xl shadow-inner border border-white/5 backdrop-blur-md">
                    👗
                  </div>
                  <div>
                    <h3 className="text-white font-display font-black text-3xl tracking-tight mb-1">Women's Collection</h3>
                    <p className="text-primary-300 text-sm font-bold tracking-widest uppercase">From ₹499</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating discount badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: 6 }}
                transition={{ duration: 0.8, delay: 0.9, type: 'spring', stiffness: 150 }}
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600 shadow-[0_8px_32px_rgba(249,115,22,0.4)] border border-white/20 text-white z-20"
              >
                <span className="font-black text-2xl leading-none shadow-sm">50%</span>
                <span className="text-[11px] font-bold tracking-widest opacity-90 mt-0.5">OFF</span>
              </motion.div>

              {/* Floating trust badge bottom-left */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.1, ease: 'easeOut' }}
                className="absolute -bottom-6 -left-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.25rem] p-4 shadow-2xl text-white z-20 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 shadow-inner flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"><path d="M5 18H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3"/><path d="M19 18h2a2 2 0 0 0 2-2v-5l-3-4h-4"/><path d="M5 14h14"/><circle cx="8" cy="18" r="3"/><circle cx="16" cy="18" r="3"/></svg>
                </div>
                <div>
                  <div className="text-[11px] text-navy-200 font-bold tracking-wider uppercase mb-0.5">Free Delivery</div>
                  <div className="text-sm font-semibold text-white">On orders above ₹499</div>
                </div>
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
