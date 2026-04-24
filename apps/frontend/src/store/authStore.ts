import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  mobile: string;
  role: string;
  name?: string;
  email?: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isNewUser: boolean;
  setUser: (user: User | null, isNewUser?: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isNewUser: false,
      setUser: async (user, isNewUser = false) => {
        set({ user, isAuthenticated: !!user, isNewUser });
        if (user) {
          try {
            const { useCartStore } = await import('./useCartStore');
            await useCartStore.getState().mergeCarts();
          } catch (e) {
            console.error('Failed to merge cart', e);
          }
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        import('./useCartStore').then(m => m.useCartStore.getState().clearCart());
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user object - NEVER tokens
    }
  )
);
