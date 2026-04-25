'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/type/product';

export interface CartItem {
  id: string;
  name: string;
  barcode: string;
  retail_price: number; // This is the "Current Price" in the cart
  quantity: number;
}

interface POSState {
  items: CartItem[];
  discount: number; // Global order discount
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updatePrice: (productId: string, newPrice: number) => void; // Item-level price
  setDiscount: (amount: number) => void; // Global-level discount
  clearCart: () => void;
  getTotal: () => number; // Sum of (price * qty)
  getFinalTotal: () => number; // Sum - global discount
}

export const usePOSStore = create<POSState>()(
  persist(
    (set, get) => ({
      items: [],
      discount: 0,

      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.id === product.id,
        );
        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.id !== productId) }),

      updateQuantity: (productId, quantity) =>
        set({
          items: get().items.map((i) =>
            i.id === productId ? { ...i, quantity: Math.max(1, quantity) } : i,
          ),
        }),

      updatePrice: (productId, newPrice) =>
        set({
          items: get().items.map((i) =>
            i.id === productId
              ? { ...i, retail_price: Math.max(0, newPrice) }
              : i,
          ),
        }),

      setDiscount: (amount) => set({ discount: Math.max(0, amount) }),

      clearCart: () => set({ items: [], discount: 0 }),

      getTotal: () =>
        get().items.reduce(
          (acc, item) => acc + item.retail_price * item.quantity,
          0,
        ),

      getFinalTotal: () => Math.max(0, get().getTotal() - get().discount),
    }),
    {
      name: 'active-pos-order',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
