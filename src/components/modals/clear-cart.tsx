import type { DefaultDataModalObject } from "@/utils/types";
import React from "react";
import ModalFooterButtons from "../modal-footer-buttons";
import { useDeleteCartListMutation } from "@/hooks/cart.hooks";

export default function ClearCart({
  data,
  onClose,
}: {
  data: DefaultDataModalObject;
  onClose: () => void;
}) {
  const { mutate: deleteCartListMutate, isPending: isDeletingCartList } =
    useDeleteCartListMutation(onClose);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteCartListMutate({ id: Number(data.id), name: data.name });
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        Are you sure you want to clear your cart? All items will be removed
      </div>

      <ModalFooterButtons isLoading={isDeletingCartList} />
    </form>
  );
}
