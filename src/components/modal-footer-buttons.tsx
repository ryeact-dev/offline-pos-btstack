import { Button } from "./ui/button";
import { IconSend, IconX } from "@tabler/icons-react";
import { DialogClose, DialogFooter } from "./ui/dialog";
import { useDialogStore } from "@/store/dialog-store";

export default function ModalFooterButtons({
  isLoading,
}: {
  isLoading: boolean;
}) {
  const closeModal = useDialogStore((s) => s.closeModal);

  return (
    <DialogFooter className="mt-6 flex flex-row justify-end gap-4 p-0">
      <DialogClose asChild>
        <Button
          type="button"
          onClick={closeModal}
          disabled={isLoading}
          variant="outline"
        >
          <IconX className="size-4" /> Close
        </Button>
      </DialogClose>
      <Button type="submit" disabled={isLoading}>
        <IconSend className="size-4" />
        Confirm
      </Button>
    </DialogFooter>
  );
}
