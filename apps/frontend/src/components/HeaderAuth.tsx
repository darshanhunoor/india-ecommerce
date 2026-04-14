'use client';

import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { User as UserIcon, LogOut } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function HeaderAuth() {
  const { user, isAuthenticated, logout } = useAuthStore();
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

  if (!isAuthenticated || !user) {
    return (
      <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-full transition-colors">
        <UserIcon size={16} />
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Hi, {user.name || user.mobile}
      </span>
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
