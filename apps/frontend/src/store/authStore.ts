import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  mobile: string;
  role: string;
  name?: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: async (user) => {
        set({ user, isAuthenticated: !!user });
        if (user) {
          // Merge guest cart into user cart, then sync count immediately
          const { useCartStore } = await import('./cartStore');
          await useCartStore.getState().mergeCarts();
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        // Clear cart state and assign fresh guest UUID on logout
        import('./cartStore').then(m => m.useCartStore.getState().logoutClear());
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user object - NEVER tokens
    }
  )
);
