import { create } from "zustand";
import { firstMessageService } from "@/services/firstMessageService";
import { FirstMessage, CreateFirstMessageDto, UpdateFirstMessageDto } from "@/types/FirstMessageType";

interface FirstMessageStore {
  items: FirstMessage[];
  selectedItem: FirstMessage | null;
  isLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  createItem: (data: CreateFirstMessageDto) => Promise<void>;
  updateItem: (id: number, data: UpdateFirstMessageDto) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

export const useFirstMessageStore = create<FirstMessageStore>((set, get) => ({
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await firstMessageService.getAll();
      set({ selectedItem: data, isLoading: false });
    } catch (err) {
      console.error("Erro ao buscar FirstMessages:", err);
      set({ error: "Erro ao buscar dados", isLoading: false });
    }
  },

  fetchById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const item = await firstMessageService.getById(id);
      set({ selectedItem: item, isLoading: false });
    } catch (err) {
      console.error(`Erro ao buscar FirstMessage com ID ${id}:`, err);
      set({ error: "Erro ao buscar item", isLoading: false });
    }
  },

  createItem: async (data: CreateFirstMessageDto) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await firstMessageService.create(data);
      set((state) => ({ items: [...state.items, newItem], isLoading: false }));
    } catch (err) {
      console.error("Erro ao criar FirstMessage:", err);
      set({ error: "Erro ao criar item", isLoading: false });
      throw err;
    }
  },

  updateItem: async (id: number, data: UpdateFirstMessageDto) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await firstMessageService.update(id, data);
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? updated : i)),
        selectedItem: state.selectedItem?.id === id ? updated : state.selectedItem,
        isLoading: false
      }));
    } catch (err) {
      console.error(`Erro ao atualizar FirstMessage com ID ${id}:`, err);
      set({ error: "Erro ao atualizar item", isLoading: false });
      throw err;
    }
  },

  deleteItem: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await firstMessageService.delete(id);
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
        selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
        isLoading: false
      }));
    } catch (err) {
      console.error(`Erro ao deletar FirstMessage com ID ${id}:`, err);
      set({ error: "Erro ao deletar item", isLoading: false });
      throw err;
    }
  }
}));