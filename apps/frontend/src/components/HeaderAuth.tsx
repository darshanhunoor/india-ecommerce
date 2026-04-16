'use client';

import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { User as UserIcon, LogOut, ShoppingCart } from 'lucide-react';

export default function HeaderAuth() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const cart = useCartStore();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      logout();
    } catch (e) {
      console.error(e);
    }
  };

  const CartIconLink = () => (
    <Link 
      href="/cart"
      className="relative p-2 text-slate-600 hover:text-primary-600 transition-colors"
      title="View Full Cart"
    >
      <ShoppingCart size={24} />
      {cart.itemCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full">
          {cart.itemCount}
        </span>
      )}
    </Link>
  );

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-full transition-colors">
          <UserIcon size={16} />
          Login
        </Link>
        <CartIconLink />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Hi, {user.name || user.mobile}
      </span>
      <CartIconLink />
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-full transition-colors"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}
