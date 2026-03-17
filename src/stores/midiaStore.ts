import { create } from "zustand";
import { midiaService } from "@/services/midiaService";
import { Midia, CreateMidiaDto, UpdateMidiaDto } from "@/types/MidiaType";

interface MidiaStore {
  items: Midia[];
  selectedItem: Midia | null;
  isLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  createItem: (data: CreateMidiaDto) => Promise<void>;
  updateItem: (id: number, data: UpdateMidiaDto) => Promise<void>;
  uploadMidia: (file: File, imovelId: number) => Promise<Midia>;
  deleteItem: (id: number) => Promise<void>;
}

export const useMidiaStore = create<MidiaStore>((set, get) => ({
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  uploadMidia: async (file: File, imovelId: number) => {
    set({ isLoading: true, error: null });
    try {
      const newMidia = await midiaService.uploadFile(file, imovelId);

      set((state) => ({
        items: [...state.items, newMidia],
        isLoading: false
      }));

      return newMidia;
    } catch (err) {
      console.error("Erro ao fazer upload da mídia:", err);
      set({ error: "Erro ao enviar arquivo", isLoading: false });
      throw err;
    }
  },
  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await midiaService.getAll();
      set({ items: data, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ error: "Erro ao buscar mídias", isLoading: false });
    }
  },

  fetchById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const item = await midiaService.getById(id);
      set({ selectedItem: item, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ error: "Erro ao buscar mídia", isLoading: false });
    }
  },

  createItem: async (data: CreateMidiaDto) => {
    set({ isLoading: true });
    try {
      const newItem = await midiaService.create(data);
      set((state) => ({ items: [...state.items, newItem], isLoading: false }));
    } catch (err) {
      set({ isLoading: false });
      console.error(err);
      throw err;
    }
  },

  updateItem: async (id: number, data: UpdateMidiaDto) => {
    try {
      const updated = await midiaService.update(id, data);
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? updated : i)),
        selectedItem: state.selectedItem?.id === id ? updated : state.selectedItem
      }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  deleteItem: async (id: number) => {
    try {
      await midiaService.delete(id);
      set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}));