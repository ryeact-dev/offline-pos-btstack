import { Button } from './ui/button';
import { closeModal } from '@/store';
import { IconSend, IconX } from '@tabler/icons-react';
import { DialogClose, DialogFooter } from './ui/dialog';

export default function ModalFooterButtons({
  isLoading,
}: {
  isLoading: boolean;
}) {
  return (
    <DialogFooter className='p-0 flex flex-row gap-4 justify-end mt-6'>
      <DialogClose asChild>
        <Button
          type='button'
          onClick={closeModal}
          disabled={isLoading}
          variant='outline'
        >
          <IconX className='size-4' /> Close
        </Button>
      </DialogClose>
      <Button type='submit' disabled={isLoading}>
        <IconSend className='size-4' />
        Confirm
      </Button>
    </DialogFooter>
  );
}
