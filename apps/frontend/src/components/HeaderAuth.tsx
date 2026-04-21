'use client';

import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { User, LogOut, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeaderAuth() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const cart = useCartStore();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      logout();
    } catch (e) {
      console.error(e);
    }
  };

  const CartLink = () => (
    <button
      onClick={() => cart.toggleCart()}
      title="View Cart"
      className="relative p-2 rounded-xl text-navy-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 block"
    >
      <motion.div
        key={cart.totalItems()}
        animate={{ scale: [1, 1.25, 1], y: [0, -4, 0] }}
        transition={{ duration: 0.4, type: 'spring' }}
      >
        <ShoppingBag size={22} className="relative z-10" />
      </motion.div>
      {cart.totalItems() > 0 && (
        <motion.span 
          key={`badge-${cart.totalItems()}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 flex items-center justify-center text-[10px] font-black text-white bg-primary-500 rounded-full shadow-sm leading-none z-20 border-[2px] border-surface"
        >
          {cart.totalItems() > 99 ? '99+' : cart.totalItems()}
        </motion.span>
      )}
    </button>
  );

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <CartLink />
        <Link
          href="/login"
          className="flex items-center gap-1.5 text-sm font-semibold text-navy-900 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-glow-saffron"
        >
          <User size={15} />
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <CartLink />
      <Link
        href="/orders"
        className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-primary-600 px-3 py-2 rounded-xl hover:bg-primary-50 transition-all duration-200"
      >
        Orders
      </Link>
      <div className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-navy-700 bg-navy-100 px-3 py-2 rounded-xl">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
          <span className="text-white text-[10px] font-black">
            {(user.name || user.mobile).charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="max-w-[80px] truncate">{user.name || user.mobile}</span>
      </div>
      <button
        onClick={handleLogout}
        title="Logout"
        className="p-2 rounded-xl text-navy-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
}
