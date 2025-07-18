import { DrawerClose, DrawerFooter } from "./ui/drawer";
import { Button } from "./ui/button";
import { IconSend, IconX } from "@tabler/icons-react";
import { useDialogStore } from "@/store/dialog-store";

export default function DrawerFooterButtons({
  isLoading,
}: {
  isLoading: boolean;
}) {
  const closeSheet = useDialogStore((s) => s.closeSheet);

  return (
    <DrawerFooter className="p-0">
      <Button type="submit" disabled={isLoading}>
        <IconSend className="size-4" />
        Submit
      </Button>
      <DrawerClose asChild>
        <Button
          type="button"
          onClick={closeSheet}
          disabled={isLoading}
          variant="outline"
        >
          <IconX className="size-4" /> Close
        </Button>
      </DrawerClose>
    </DrawerFooter>
  );
}
