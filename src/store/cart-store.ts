import type { InventoryItemFormValues } from "@/zod/inventory.validation";
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

interface CartStore {
  cartItems: InventoryItemFormValues[];
  addToCart: (item: InventoryItemFormValues) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateCartItem: (
    id: number,
    updatedFields: Partial<InventoryItemFormValues>,
  ) => void;

  // 🧮 Derived Getters
  cartTotal: () => number;
  cartTax: () => number;
  cartTotalWithTax: () => number;
  itemCount: () => number;
  formatPrice: (price: number) => string;
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        cartItems: [],

        // 🛒 Mutations
        addToCart: (item) =>
          set((state) => ({
            cartItems: [...state.cartItems, item],
          })),

        removeFromCart: (id) =>
          set((state) => ({
            cartItems: state.cartItems.filter((item) => item.id !== id),
          })),

        clearCart: () => set({ cartItems: [] }),

        updateCartItem: (id, updatedFields) =>
          set((state) => ({
            cartItems: state.cartItems.map((item) =>
              item.id === id ? { ...item, ...updatedFields } : item,
            ),
          })),

        // 💡 Derived Getters
        cartTotal: () => {
          const items = get().cartItems;
          return items.reduce(
            (total, item) => total + Number(item.price) * item.stockQuantity,
            0,
          );
        },

        cartTax: () => {
          return get().cartTotal() * 0.1;
        },

        cartTotalWithTax: () => {
          const total = get().cartTotal();
          const tax = get().cartTax();
          return total + tax;
        },

        itemCount: () => {
          const items = get().cartItems;
          return items.reduce((count, item) => count + item.stockQuantity, 0);
        },

        formatPrice: (price: number) => price.toFixed(2),
      }),
      {
        name: "order-list-zustand", // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      },
    ),
  ),
);
