import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import DeleteProduct from "./modals/delete-product";
import type {
  AddProductModalData,
  DefaultDataModalObject,
  OrderDetails,
} from "@/utils/types";
import AddOrder from "./modals/add-order";
import { useDialogStore } from "@/store/dialog-store";
import CheckOutOrder from "./modals/check-out-order";
import ClearCart from "./modals/clear-cart";

export default function ModalContainer() {
  const { modal, closeModal } = useDialogStore();

  const { isModalOpen, data, title } = modal;

  let body = <div />;

  switch (data.type) {
    case "delete-product":
      body = (
        <DeleteProduct
          data={data.data as DefaultDataModalObject}
          onClose={closeModal}
        />
      );
      break;

    case "add-order":
      body = (
        <AddOrder
          data={data.data as unknown as AddProductModalData}
          onClose={closeModal}
        />
      );
      break;

    case "checkout-order":
      body = (
        <CheckOutOrder data={data.data as OrderDetails} onClose={closeModal} />
      );
      break;

    case "clear-cart":
      body = (
        <ClearCart
          data={data.data as DefaultDataModalObject}
          onClose={closeModal}
        />
      );
      break;

    default:
      body;
  }

  return (
    <Dialog open={isModalOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div>{body}</div>
      </DialogContent>
    </Dialog>
  );
}
