import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import AddProductDrawer from "./drawers/add-product/add-product";
import type { InventoryItemFormValues } from "@/zod/inventory.validation";
import { useDialogStore } from "@/store/dialog-store";

export default function DrawerContainer() {
  const { sheet, closeSheet } = useDialogStore();
  const isMobile = useIsMobile();

  let body = <div>Default Body</div>;

  const { isSheetOpen, title, data } = sheet;

  switch (data.type) {
    case "add-product":
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
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>
        <div className="flex h-full flex-col gap-4 overflow-y-auto px-4 text-sm">
          {body}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
