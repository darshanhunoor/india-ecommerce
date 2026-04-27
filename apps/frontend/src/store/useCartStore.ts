import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  discountPercentage: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setIsOpen: (open: boolean) => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  mergeCarts: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      discountPercentage: 0,
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
            ),
            isOpen: true,
          };
        }
        return { items: [...state.items, item], isOpen: true };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),
      updateQty: (id, qty) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, qty } : i
        )
      })),
      clearCart: () => set({ items: [], couponCode: null, discountPercentage: 0 }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setIsOpen: (open) => set({ isOpen: open }),
      applyCoupon: (code) => {
        // mock valid coupon check
        if (code.toUpperCase() === 'MB10' || code.toUpperCase() === 'FIRST10') {
            set({ couponCode: code.toUpperCase(), discountPercentage: 10 });
        } else {
            set({ couponCode: null, discountPercentage: 0 });
            throw new Error('Invalid coupon');
        }
      },
      removeCoupon: () => set({ couponCode: null, discountPercentage: 0 }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.qty, 0),
      totalPrice: () => {
        const t = get().items.reduce((acc, item) => acc + (item.price * item.qty), 0);
        return t - (t * get().discountPercentage / 100);
      },
      mergeCarts: async () => {
        const items = get().items;
        if (items.length === 0) return;
        
        try {
          const { api } = await import('@/lib/api');
          const data = await api.cart.merge(items.map(i => ({ productId: i.id, quantity: i.qty })));
          
          if (data && data.items) {
             // Future extension: sync local state completely with server
          }
        } catch (e) {
          console.error('Cart merge failed', e);
        }
      },
    }),
    {
      name: 'mbecommerce-cart-storage',
    }
  )
);
