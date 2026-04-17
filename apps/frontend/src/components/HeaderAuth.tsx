'use client';

import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { User, LogOut, ShoppingBag } from 'lucide-react';

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
    <Link
      href="/cart"
      title="View Cart"
      className="relative p-2 rounded-xl text-navy-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
    >
      <ShoppingBag size={22} />
      {cart.itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-black text-white bg-primary-500 rounded-full shadow-sm leading-none">
          {cart.itemCount > 99 ? '99+' : cart.itemCount}
        </span>
      )}
    </Link>
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
