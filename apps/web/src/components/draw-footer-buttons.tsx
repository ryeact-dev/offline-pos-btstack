import { DrawerClose, DrawerFooter } from './ui/drawer';
import { Button } from './ui/button';
import { closeSheet } from '@/store';

export default function DrawerFooterButtons() {
  return (
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose asChild>
        <Button onClick={closeSheet} variant='outline'>
          Done
        </Button>
      </DrawerClose>
    </DrawerFooter>
  );
}
