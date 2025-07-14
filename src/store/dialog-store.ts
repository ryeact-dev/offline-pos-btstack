import { create } from "zustand";
import type { ModalProps } from "@/utils/types";

type DialogStore = {
  modal: ModalProps;
  sheet: ModalProps;
  openModal: (newState: ModalProps) => void;
  closeModal: () => void;
  openSheet: (newState: ModalProps) => void;
  closeSheet: () => void;
};

export const useDialogStore = create<DialogStore>((set) => ({
  modal: {
    isModalOpen: false,
    title: "",
    data: { type: "", data: {} },
  },
  sheet: {
    isSheetOpen: false,
    title: "",
    data: { type: "", data: {} },
  },

  openModal: (newState) =>
    set((state) => ({
      modal: {
        ...state.modal,
        ...newState,
        isModalOpen: newState.isModalOpen,
      },
    })),

  closeModal: () =>
    set(() => ({
      modal: {
        isModalOpen: false,
        title: "",
        size: "md",
        data: { type: "", data: {} },
      },
    })),

  openSheet: (newState) =>
    set((state) => ({
      sheet: {
        ...state.sheet,
        ...newState,
        isSheetOpen: newState.isSheetOpen,
      },
    })),

  closeSheet: () =>
    set(() => ({
      sheet: {
        isSheetOpen: false,
        title: "",
        size: "md",
        data: { type: "", data: {} },
      },
    })),
}));
