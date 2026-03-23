import { create } from "zustand";

interface ConfirmStore {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  
  openConfirm: (params: Omit<ConfirmStore, "isOpen" | "openConfirm" | "closeConfirm">) => void;
  closeConfirm: () => void;
}

export const useConfirmStore = create<ConfirmStore>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  confirmText: "Excluir",
  cancelText: "Cancelar",
  onConfirm: () => {},

  openConfirm: (params) => set({ isOpen: true, ...params }),
  closeConfirm: () => set({ isOpen: false }),
}));