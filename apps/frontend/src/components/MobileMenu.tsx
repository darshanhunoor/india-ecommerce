'use client';

import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'All Products' },
    { href: '/products?cat=men', label: 'Men' },
    { href: '/products?cat=women', label: 'Women' },
    { href: '/products?cat=kids', label: 'Kids' },
  ];

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 text-navy-900 hover:text-primary-600" aria-label="Menu">
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy-900/60 backdrop-blur-md z-[110]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-surface z-[120] shadow-2xl flex flex-col pt-safe-top"
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-surface-alt">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-saffron">
                    <span className="text-white font-display font-black text-sm leading-none">M</span>
                  </div>
                  <span className="font-display font-bold text-xl text-navy-900">MBEcommerce</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-surface rounded-full border border-border text-navy-600 hover:bg-slate-100 shadow-sm">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl text-lg font-bold text-navy-800 hover:bg-primary-50 hover:text-primary-600 transition-colors border border-transparent hover:border-primary-100"
                  >
                    {link.label}
                    <ArrowRight size={18} className="text-primary-300 opacity-50" />
                  </Link>
                ))}
              </div>

              <div className="p-5 border-t border-border bg-surface-alt">
                <div className="flex gap-2">
                  <button className="flex-1 py-3 px-4 bg-navy-900 text-white rounded-xl text-sm font-bold shadow-sm">English</button>
                  <button className="flex-1 py-3 px-4 bg-surface text-navy-600 border border-border rounded-xl text-sm font-bold shadow-sm">हिन्दी</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
