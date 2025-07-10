import { DrawerClose, DrawerFooter } from './ui/drawer';
import { Button } from './ui/button';
import { closeSheet } from '@/store';
import { IconSend, IconX } from '@tabler/icons-react';

export default function DrawerFooterButtons() {
  return (
    <DrawerFooter className='p-0'>
      <Button type='submit'>
        <IconSend className='size-4' />
        Submit
      </Button>
      <DrawerClose asChild>
        <Button type='button' onClick={closeSheet} variant='outline'>
          <IconX className='size-4' /> Close
        </Button>
      </DrawerClose>
    </DrawerFooter>
  );
}
