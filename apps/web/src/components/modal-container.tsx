import React from 'react';

import { useStore } from '@tanstack/react-store';
import { closeModal, modalStore } from '@/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import DeleteProduct from './modals/delete-product';
import type { DefaultDataModalObject } from '@/utils/types';

export default function ModalContainer() {
  const { isModalOpen, data, title } = useStore(modalStore);

  let body = <div />;

  switch (data.type) {
    case 'delete-product':
      body = (
        <DeleteProduct
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
