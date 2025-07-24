import React, { useCallback, useState } from "react";
import ModalFooterButtons from "../modal-footer-buttons";
import { Input } from "../ui/input";
import { toastNotification } from "../toastTotification";
import type { AddProductModalData } from "@/utils/types";
import {
  useCreateCartMutation,
  useUpdateCartMutation,
} from "@/hooks/cart.hooks";
import { computeItemTotal } from "@/helpers/client/compute-item-total";

export default function AddOrder({
  data,
  onClose,
}: {
  data: AddProductModalData;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState<number>(1);

  const { cart, item } = data;

  console.log(cart);

  // Mutations
  const { mutate: createCartMutate, isPending: isCreatingCart } =
    useCreateCartMutation(onClose);
  const { mutate: updateCartMutate, isPending: isUpdatingCart } =
    useUpdateCartMutation(onClose);

  const onInputChangeHanlder = useCallback((value: number) => {
    setQuantity(value);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (quantity === 0) {
      toastNotification({
        toastType: "warning",
        title: "Ordering Item",
        description: `Please enter valid order quantity ${item.name} `,
      });
      return;
    }

    const { subTotal, tax, totalWithTax } = computeItemTotal(
      Number(item.price),
      quantity,
    );

    if (!cart) {
      if (quantity > item.stockQuantity) {
        toastNotification({
          toastType: "warning",
          title: "Ordering Item",
          description: `Quantity ordered for ${item.name} was exceeded`,
        });
        return;
      }

      const orderDetails = {
        subTotal,
        tax,
        totalWithTax,

        item: {
          name: item.name,
          price: Number(item.price),
          quantity,
          total: subTotal,
          itemStockQuantity: item.stockQuantity - quantity,
          productId: item.productId,
        },
      };

      createCartMutate(orderDetails);
    } else {
      const cartItems = cart.items;
      const existingItemIndex = cartItems.findIndex(
        (i) => i.productId === item.productId,
      );

      const cartItem = cartItems[existingItemIndex];
      const cartItemQuantity = cartItem ? Number(cartItem.quantity) : 0;

      console.log(cartItemQuantity, quantity, item.stockQuantity);

      if (quantity > item.stockQuantity) {
        toastNotification({
          toastType: "warning",
          title: "Ordering Itemss",
          description: `Quantity ordered for ${item.name} was exceeded`,
        });
        return;
      }

      const { subTotal, tax, totalWithTax } = computeItemTotal(
        Number(cartItem ? cartItem.price : item.price),
        quantity,
      );

      let itemOrder = {
        id: 0,
        name: item.name,
        price: Number(item.price),
        quantity: quantity,
        total: subTotal,
        productId: item.productId,
        itemStockQuantity: item.stockQuantity - quantity,
      };

      if (cartItem) {
        itemOrder = {
          ...itemOrder,
          id: cartItem.id,
          quantity: Number(cartItem.quantity) + quantity,
          total: Number(cartItem.total) + subTotal,
          itemStockQuantity: item.stockQuantity - quantity,
        };
      }

      const orderDetails = {
        id: cart.id,
        subTotal: Number(cart.subTotal) + subTotal,
        tax: Number(cart.tax) + tax,
        totalWithTax: Number(cart.totalWithTax) + totalWithTax,
        item: itemOrder,
        action: "update",
      };

      updateCartMutate(orderDetails);
    }

    onClose();
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <h2>{item.name}</h2>
        <p>{item.stockQuantity}</p>
      </div>
      <div>
        <Input
          value={quantity}
          onChange={(e) => onInputChangeHanlder(Number(e.target.value))}
          type="number"
          min={0}
          max={item.stockQuantity}
        />
      </div>
      <ModalFooterButtons isLoading={isCreatingCart || isUpdatingCart} />
    </form>
  );
}
