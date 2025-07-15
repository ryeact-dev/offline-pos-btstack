import type { OrderDetails } from "@/utils/types";
import React from "react";
import ModalFooterButtons from "../modal-footer-buttons";
import { Separator } from "../ui/separator";
// import { useCheckOutSalesMutation } from "@/hooks/cart.hooks";

export default function CheckOutOrder({
  data: item,
  onClose,
}: {
  data: OrderDetails;
  onClose: () => void;
}) {
  // const { mutate: addSalesMutate, isPending: isAddingSales } =
  // useCheckOutSalesMutation(onClose);

  // const itemCount = useCartStore((state) => state.itemCount());

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // addSalesMutate(item);
    //   onClose();
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <h2 className="mb-1 text-xl font-medium">
          {/* Check out {itemCount} items? */}
        </h2>
        {/* <Separator className="my-3" /> */}
        <p>Subtotal: P{item.subTotal.toFixed(2)}</p>
        <p>Tax: P{item.tax.toFixed(2)}</p>
        <Separator className="my-3" />
        <p>Total: P{item.totalWithTax.toFixed(2)}</p>
      </div>
      <ModalFooterButtons isLoading={false} />
    </form>
  );
}
