import type { ModalProps } from "@/utils/types";
import { Store } from "@tanstack/react-store";

// TODO: MOVE THIS TO ZUSTAND STORE

// Modal Store
export const modalStore = new Store<ModalProps>({
  isModalOpen: false,
  // size: 'md',
  data: { type: "", data: {} },
  title: "",
});

export function openModal(newState: ModalProps) {
  modalStore.setState((state) => {
    return {
      ...state,
      isModalOpen: newState.isModalOpen,
      // size: newState.size,
      data: newState.data,
      title: newState.title,
    };
  });
}

export function closeModal() {
  modalStore.setState((state) => {
    return {
      ...state,
      isModalOpen: false,
      size: "md",
      data: { type: "", data: {} },
    };
  });
}

// Sheet Store
export const sheetStore = new Store<ModalProps>({
  isSheetOpen: false,
  title: "",
  // size: 'md',
  data: { type: "", data: {} },
});

export function openSheet(newState: ModalProps) {
  sheetStore.setState((state) => {
    return {
      ...state,
      isSheetOpen: newState.isSheetOpen,
      title: newState.title,
      // size: newState.size,
      data: newState.data,
    };
  });
}

export function closeSheet() {
  sheetStore.setState((state) => {
    return {
      ...state,
      isSheetOpen: false,
      title: "",
      size: "md",
      data: { type: "", data: {} },
    };
  });
}
