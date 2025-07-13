import React, { useCallback, useState } from "react";
import ModalFooterButtons from "../modal-footer-buttons";
import type { InventoryItemFormValues } from "@/zod/inventory.validation";
import { Input } from "../ui/input";
import { toastNotification } from "../toastTotification";
import { useCartStore } from "@/store/cart-store";

export default function AddOrder({
  data: product,
  onClose,
}: {
  data: InventoryItemFormValues;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState<number>(0);

  // Cart Getters
  const cart = useCartStore((state) => state.cartItems);

  // Cart Mutations
  const updateQuantity = useCartStore((state) => state.updateCartItem);
  const addToCart = useCartStore((state) => state.addToCart);

  const onInputChangeHanlder = useCallback((value: number) => {
    setQuantity(value);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (quantity === 0) {
      toastNotification({
        toastType: "warning",
        title: "Ordering Item",
        description: `Please enter valid order quantity ${product.name} `,
      });
      return;
    }

    if (product.stockQuantity - quantity <= 0) {
      toastNotification({
        toastType: "warning",
        title: "Ordering Item",
        description: `Quantity ordered for ${product.name} was exceeded`,
      });
      return;
    }

    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex < 0) {
      addToCart({ ...product, stockQuantity: quantity });
    } else {
      updateQuantity(cart[existingItemIndex].id, {
        stockQuantity: cart[existingItemIndex].stockQuantity + quantity,
      });
    }

    onClose();
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <h2>{product.name}</h2>
        <p>{product.stockQuantity}</p>
      </div>
      <div>
        <Input
          value={quantity}
          onChange={(e) => onInputChangeHanlder(Number(e.target.value))}
        />
      </div>
      <ModalFooterButtons isLoading={false} />
    </form>
  );
}
