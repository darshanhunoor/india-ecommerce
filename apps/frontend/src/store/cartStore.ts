import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface CartItem {
  id: string;
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
  // Per-product loading state: productId → boolean
  loadingItemIds: Set<string>;

  // Actions
  setLoading: (loading: boolean) => void;
  syncCartDetails: (data: any) => void;
  fetchCart: () => Promise<void>;
  addItem: (product: any, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeCarts: () => Promise<void>;
  logoutClear: () => void;
  isItemLoading: (id: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      guestUuid: '',
      items: [],
      itemCount: 0,
      subtotal_paise: 0,
      discount_paise: 0,
      gst_paise: 0,
      delivery_paise: 0,
      total_paise: 0,
      couponCode: null,
      isLoading: false,
      loadingItemIds: new Set<string>(),

      setLoading: (loading) => set({ isLoading: loading }),

      isItemLoading: (id) => get().loadingItemIds.has(id),

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

      // Fetch current cart from server (used on login/mount)
      fetchCart: async () => {
        const { guestUuid } = get();
        set({ isLoading: true });
        try {
          const res = await fetch(`${API}/api/cart`, {
            credentials: 'include',
            headers: { 'x-guest-uuid': guestUuid },
          });
          if (res.ok) {
            const data = await res.json();
            get().syncCartDetails(data.cart ?? data);
          }
        } catch (e) {
          console.error('fetchCart error', e);
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (product, quantity) => {
        const { guestUuid, loadingItemIds } = get();
        const pid = product.id as string;

        // Mark only this product as loading
        const nextSet = new Set(loadingItemIds);
        nextSet.add(pid);
        set({ loadingItemIds: nextSet });

        try {
          const res = await fetch(`${API}/api/cart`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'x-guest-uuid': guestUuid,
            },
            body: JSON.stringify({ productId: pid, quantity }),
          });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          get().syncCartDetails(data.cart);
        } catch (e) {
          console.error('Cart Add Error', e);
        } finally {
          const after = new Set(get().loadingItemIds);
          after.delete(pid);
          set({ loadingItemIds: after });
        }
      },

      removeItem: async (itemId) => {
        const nextSet = new Set(get().loadingItemIds);
        nextSet.add(itemId);
        set({ loadingItemIds: nextSet });
        try {
          const res = await fetch(`${API}/api/cart/${itemId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'x-guest-uuid': get().guestUuid },
          });
          const data = await res.json();
          get().syncCartDetails(data.cart);
        } finally {
          const after = new Set(get().loadingItemIds);
          after.delete(itemId);
          set({ loadingItemIds: after });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        const nextSet = new Set(get().loadingItemIds);
        nextSet.add(itemId);
        set({ loadingItemIds: nextSet });
        try {
          const res = await fetch(`${API}/api/cart/${itemId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'x-guest-uuid': get().guestUuid,
            },
            body: JSON.stringify({ quantity }),
          });
          if (!res.ok) throw new Error('Stock limit reached');
          const data = await res.json();
          get().syncCartDetails(data.cart);
        } finally {
          const after = new Set(get().loadingItemIds);
          after.delete(itemId);
          set({ loadingItemIds: after });
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          await fetch(`${API}/api/cart`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'x-guest-uuid': get().guestUuid },
          });
          set({
            items: [], itemCount: 0, subtotal_paise: 0, discount_paise: 0,
            gst_paise: 0, delivery_paise: 0, total_paise: 0, couponCode: null,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // Called on login: merge guest → user cart, then re-fetch to sync count
      mergeCarts: async () => {
        const { guestUuid } = get();
        set({ isLoading: true });
        try {
          const res = await fetch(`${API}/api/cart/merge`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guestUuid }),
          });
          const data = await res.json();
          // Sync whatever the server returned (merged cart)
          get().syncCartDetails(data.cart ?? data);
        } catch (e) {
          console.error('Cart merge failed:', e);
          // Even if merge fails, fetch the logged-in user cart
          await get().fetchCart();
        } finally {
          set({ isLoading: false });
        }
      },

      logoutClear: () => {
        set({
          guestUuid: uuidv4(),
          items: [], itemCount: 0,
          subtotal_paise: 0, discount_paise: 0,
          gst_paise: 0, delivery_paise: 0,
          total_paise: 0, couponCode: null,
          loadingItemIds: new Set(),
        });
      },
    }),
    {
      name: 'guest_cart',
      storage: createJSONStorage(() => localStorage),
      // Only persist the guestUuid; all cart data is server-authoritative
      partialize: (state) => ({
        guestUuid: state.guestUuid || uuidv4(),
      }),
      onRehydrateStorage: () => (state) => {
        if (state && !state.guestUuid) {
          state.guestUuid = uuidv4();
        }
      },
    }
  )
);
