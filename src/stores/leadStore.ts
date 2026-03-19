import { create } from "zustand";
import { leadService } from "@/services/leadService";
import { Lead, CreateLeadDto, UpdateLeadDto } from "@/types/LeadType";

interface LeadStore {
  items: Lead[];
  selectedItem: Lead | null;
  isLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  createItem: (data: CreateLeadDto) => Promise<void>;
  updateItem: (id: number, data: UpdateLeadDto) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  updateLeadAiActive: (id: number, aiActive: boolean) => Promise<void>;
  gerarResumo: (id: number) => Promise<void>;
}

export const useLeadStore = create<LeadStore>((set, get) => ({
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await leadService.getAll();
      set({ items: data, isLoading: false });
    } catch (err) {
      console.error("Erro ao buscar leads:", err);
      set({ error: "Erro ao buscar dados", isLoading: false });
    }
  },

  fetchById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const item = await leadService.getById(id);
      set({ selectedItem: item, isLoading: false });
    } catch (err) {
      console.error(`Erro ao buscar lead ${id}:`, err);
      set({ error: "Erro ao buscar item", isLoading: false });
    }
  },

  createItem: async (data: CreateLeadDto) => {
    set({ isLoading: true });
    try {
      const newItem = await leadService.create(data);
      set((state) => ({ items: [...state.items, newItem], isLoading: false }));
    } catch (err) {
      console.error("Erro ao criar lead:", err);
      set({ isLoading: false });
      throw err;
    }
  },

  updateItem: async (id: number, data: UpdateLeadDto) => {
    try {
      const updated = await leadService.update(id, data);
      console.log(data)
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? updated : i)),
        selectedItem: state.selectedItem?.id === id ? updated : state.selectedItem
      }));
    } catch (err) {
      console.error(`Erro ao atualizar lead ${id}:`, err);
      throw err;
    }
  },

  deleteItem: async (id: number) => {
    try {
      await leadService.delete(id);
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
        selectedItem: state.selectedItem?.id === id ? null : state.selectedItem
      }));
    } catch (err) {
      console.error(`Erro ao deletar lead ${id}:`, err);
      throw err;
    }
  },

  updateLeadAiActive: async (id: number, aiActive: boolean) => {
    try {
      const updated = await leadService.updateAiActive(id, aiActive);
      set((state) => ({
        items: state.items.map((lead) =>
          lead.id === id ? { ...lead, aiActive: updated.aiActive } : lead
        ),
        selectedItem: state.selectedItem?.id === id ? { ...state.selectedItem, aiActive: updated.aiActive } : state.selectedItem
      }));
    } catch (err) {
      console.error(`Erro ao atualizar status de IA do lead ${id}:`, err);
      throw err;
    }
  },

  gerarResumo: async (id: number) => {
    try {
      const updated = await leadService.gerarResumo(id);
      set((state) => ({
        items: state.items.map((lead) =>
          lead.id === id ? updated : lead
        ),
        selectedItem: state.selectedItem?.id === id ? updated : state.selectedItem
      }));
    } catch (err) {
      console.error(`Erro ao gerar resumo do lead ${id}:`, err);
      throw err;
    }
  }
}));