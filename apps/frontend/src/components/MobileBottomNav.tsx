'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/products', icon: Grid },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
    { name: 'Account', href: '/orders', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-surface/90 backdrop-blur-lg border-t border-border z-40 px-2 pb-safe">
      <nav className="h-full flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full py-1 gap-1"
            >
              <Icon size={20} className={`transition-colors ${isActive ? 'text-primary-600' : 'text-navy-400'}`} />
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-navy-400'}`}>
                {item.name}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute -top-[1px] w-8 h-[2px] bg-primary-500 rounded-b-full"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
