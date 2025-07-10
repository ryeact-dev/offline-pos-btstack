import type { DefaultDataModalObject } from '@/utils/types';
import React from 'react';
import ModalFooterButtons from '../modal-footer-buttons';

export default function DeleteProduct({
  data,
  onClose,
}: {
  data: DefaultDataModalObject;
  onClose: () => void;
}) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // onClose();

    console.log(data);
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        Deleting product <span className='font-semibold'>{data.name}</span> will
        remove all data associated with it
      </div>

      <ModalFooterButtons isLoading={false} />
    </form>
  );
}
