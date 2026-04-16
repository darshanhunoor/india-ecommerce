import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface CartItem {
  id: string; // product id or variant id
  name: string;
  slug: string;
  price_paise: number;
  mrp_paise: number;
  quantity: number;
  image: string;
  stock: number;
  gst_rate: number;
}

interface CartState {
  guestUuid: string;
  items: CartItem[];
  itemCount: number;
  subtotal_paise: number;
  discount_paise: number;
  gst_paise: number;
  delivery_paise: number;
  total_paise: number;
  couponCode: string | null;
  isLoading: boolean;
  isDrawerOpen: boolean;
  
  // Actions
  setDrawerOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  syncCartDetails: (data: any) => void;
  addItem: (product: any, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  mergeCarts: () => Promise<void>;
  logoutClear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      guestUuid: '', // will be set on hydration if null
      items: [],
      itemCount: 0,
      subtotal_paise: 0,
      discount_paise: 0,
      gst_paise: 0,
      delivery_paise: 0,
      total_paise: 0,
      couponCode: null,
      isLoading: false,
      isDrawerOpen: false,

      setDrawerOpen: (open: boolean) => set({ isDrawerOpen: open }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      syncCartDetails: (data: any) => {
        set({
          items: data.items || [],
          itemCount: data.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0,
          subtotal_paise: data.subtotal_paise || 0,
          discount_paise: data.discount_paise || 0,
          gst_paise: data.gst_paise || 0,
          delivery_paise: data.delivery_paise || 0,
          total_paise: data.total_paise || 0,
          couponCode: data.couponCode || null,
        });
      },

      addItem: async (product, quantity) => {
        const { guestUuid } = get();
        // Here we will eventually send POST /api/cart
        // For right now, state is pure backend-truth. We'll implement actual fetch inside UI or this thunk.
        set({ isLoading: true });
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/cart`, {
            method: 'POST',
            credentials: 'include',
            headers: { 
              'Content-Type': 'application/json',
              'x-guest-uuid': guestUuid
            },
            body: JSON.stringify({ productId: product.id, quantity })
          });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          get().syncCartDetails(data.cart);
        } catch (e) {
          console.error("Cart Add Error", e);
        } finally {
          set({ isLoading: false, isDrawerOpen: true });
        }
      },

      removeItem: async (itemId) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/cart/${itemId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'x-guest-uuid': get().guestUuid }
          });
          const data = await res.json();
          get().syncCartDetails(data.cart);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/cart/${itemId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 
              'Content-Type': 'application/json',
              'x-guest-uuid': get().guestUuid
            },
            body: JSON.stringify({ quantity })
          });
          if (!res.ok) throw new Error('Stock check failed or limit reached');
          const data = await res.json();
          get().syncCartDetails(data.cart);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/cart`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'x-guest-uuid': get().guestUuid }
          });
          set({
            items: [], itemCount: 0, subtotal_paise: 0, discount_paise: 0,
            gst_paise: 0, delivery_paise: 0, total_paise: 0, couponCode: null
          });
        } finally {
          set({ isLoading: false });
        }
      },

      applyCoupon: async (code) => {
        set({ isLoading: true });
        try {
           const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/cart/coupon`, {
             method: 'POST',
             credentials: 'include',
             headers: { 'Content-Type': 'application/json', 'x-guest-uuid': get().guestUuid },
             body: JSON.stringify({ couponCode: code })
           });
           const data = await res.json();
           get().syncCartDetails(data.cart);
        } finally {
          set({ isLoading: false });
        }
      },

      mergeCarts: async () => {
        // Called strictly from AuthStore instantly on login
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/cart/merge`, {
             method: 'POST',
             credentials: 'include',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ guestUuid: get().guestUuid })
          });
          const data = await res.json();
          get().syncCartDetails(data.cart);
        } catch (e) {
          console.error("Cart Merge failed:", e);
        }
      },

      logoutClear: () => {
        // Hard wipe guest ID to get a fresh anonymous session upon log out
        set({
           guestUuid: uuidv4(), items: [], itemCount: 0, 
           subtotal_paise: 0, discount_paise: 0, gst_paise: 0, 
           delivery_paise: 0, total_paise: 0, couponCode: null 
        });
      }
    }),
    {
      name: 'guest_cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        guestUuid: state.guestUuid || uuidv4() // only persist the uuid natively to map to the remote cart cleanly!
      }),
      onRehydrateStorage: () => (state) => {
        if (state && !state.guestUuid) {
          state.guestUuid = uuidv4();
        }
      }
    }
  )
);
