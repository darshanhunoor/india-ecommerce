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
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
        // Automatically merge the physical guest cart to the user's DB profile immediately upon login success
        if (user) {
          import('./cartStore').then(m => m.useCartStore.getState().mergeCarts());
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // saves to localStorage so memory is preserved across reloads
      // Wait, rule: "Never store JWT in localStorage — use memory + HttpOnly cookie only".
      // Storing the User object in localStorage is fine, but NEVER store the accessToken or refreshToken.
      // This state object DOES NOT contain tokens, only the generic User details, which is safe.
    }
  )
);
