"use client";

import { CartItem, Product } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  isOpen: boolean;
  items: CartItem[];
  open: () => void;
  close: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      isOpen: false,
      items: [],
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          const maxStock = product.stock ?? 99;
          
          if (existing) {
            const newQty = Math.min(maxStock, existing.quantity + quantity);
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: newQty } : item,
              ),
            };
          }
          const finalQty = Math.min(maxStock, quantity);
          return { items: [...state.items, { ...product, quantity: finalQty }] };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          const maxStock = item?.stock ?? 99;
          const finalQty = Math.max(1, Math.min(maxStock, quantity));
          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity: finalQty } : item,
            ),
          };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "noor-bakers-cart",
      // Only persist the items, not the drawer state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
