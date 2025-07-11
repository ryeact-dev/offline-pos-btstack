import type { DefaultDataModalObject } from '@/utils/types';
import React from 'react';
import ModalFooterButtons from '../modal-footer-buttons';
import { useDeleteProductMutation } from '@/hooks/inventory.hook';

export default function DeleteProduct({
  data,
  onClose,
}: {
  data: DefaultDataModalObject;
  onClose: () => void;
}) {
  const { mutate: deleteProductMutate, isPending: isDeletingProduct } =
    useDeleteProductMutation(onClose);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteProductMutate({ id: Number(data.id) });
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        Deleting product <span className='font-semibold'>{data.name}</span> will
        remove all data associated with it
      </div>

      <ModalFooterButtons isLoading={isDeletingProduct} />
    </form>
  );
}
