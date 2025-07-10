import { closeSheet, sheetStore } from '@/store';
import { useStore } from '@tanstack/react-store';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import AddProductDrawer from './drawers/add-product/add-product';
import type { InventoryItemFormValues } from '@/zod/inventory.validation';

export default function DrawerContainer() {
  const { isSheetOpen, data, title } = useStore(sheetStore);
  const isMobile = useIsMobile();

  let body = <div>Default Body</div>;

  switch (data.type) {
    case 'add-product':
      body = (
        <AddProductDrawer
          data={data.data as InventoryItemFormValues}
          onClose={closeSheet}
        />
      );
      break;

    //   case 'manager':
    //     body = (
    //       <AddEventManagerSheetBody
    //         userInfo={data.data as UserWithEventAndCompetitions}
    //         onClose={closeSheet}
    //       />
    //     )
    //     break

    //   case 'user':
    //     body = (
    //       <AddJudgesTabulatorsSheetBody
    //         userInfo={data.data as UserWithEventAndCompetitions}
    //         onClose={closeSheet}
    //       />
    //     )
    //     break

    //   case 'competition':
    //     body = (
    //       <AddCompetitionSheetBody
    //         compInfo={data.data as UserCompetition}
    //         onClose={closeSheet}
    //       />
    //     )
    //     break

    //   case 'candidate':
    //     body = (
    //       <AddCandidateSheetBody
    //         candidateInfo={data.data as CandidateNoCreatedAt}
    //         onClose={closeSheet}
    //       />
    //     )
    //     break

    default:
      body;
  }

  return (
    <Drawer
      open={isSheetOpen}
      dismissible={isMobile}
      direction={isMobile ? 'bottom' : 'right'}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>
        <div className='flex flex-col gap-4 overflow-y-auto px-4 text-sm h-full'>
          {body}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
