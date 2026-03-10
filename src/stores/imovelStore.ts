import { create } from "zustand";
import { imovelService } from "@/services/imovelService";
import { Imovel, CreateImovelDto, UpdateImovelDto } from "@/types/ImovelType";

interface ImovelStore {
  imoveis: Imovel[];
  selectedImovel: Imovel | null;
  isLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  fetchByUser: () => Promise<void>;
  fetchByLead: (leadId: number) => Promise<void>;
  fetchByAiAssistantFile: (fileId: number) => Promise<void>;
  createImovel: (data: CreateImovelDto) => Promise<void>;
  updateImovel: (data: UpdateImovelDto) => Promise<void>;
  deleteImovel: (id: number) => Promise<void>;
  toggleLead: (imovelId: number, leadId: number) => Promise<void>;
}

export const useImovelStore = create<ImovelStore>((set, get) => ({
  imoveis: [],
  selectedImovel: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await imovelService.getAll();
      set({ imoveis: data, isLoading: false });
    } catch (err: any) {
      console.error("Failed to fetch imoveis:", err);
      set({ error: "Erro ao buscar imóveis", isLoading: false });
    }
  },

  fetchById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const imovel = await imovelService.getById(id);
      set({ selectedImovel: imovel, isLoading: false });
    } catch (err: any) {
      console.error(`Failed to fetch imovel ID ${id}:`, err);
      set({ error: "Erro ao buscar imóvel", isLoading: false });
    }
  },

  fetchByUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await imovelService.getByUser();
      set({ imoveis: data, isLoading: false });
    } catch (err: any) {
      console.error("Failed to fetch user's imoveis:", err);
      set({ error: "Erro ao buscar imóveis do usuário", isLoading: false });
    }
  },

  fetchByLead: async (leadId: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await imovelService.getByLead(leadId);
      set({ imoveis: data, isLoading: false });
    } catch (err: any) {
      console.error(`Failed to fetch imoveis for lead ${leadId}:`, err);
      set({ error: "Erro ao buscar imóveis do lead", isLoading: false });
    }
  },

  fetchByAiAssistantFile: async (fileId: number) => {
    set({ isLoading: true, error: null });
    try {
      const imovel = await imovelService.getByAiAssistantFile(fileId);
      set({ selectedImovel: imovel, isLoading: false });
    } catch (err: any) {
      console.error(`Failed to fetch imovel for file ${fileId}:`, err);
      set({ error: "Erro ao buscar imóvel do assistente IA", isLoading: false });
    }
  },

  createImovel: async (data: CreateImovelDto) => {
    set({ isLoading: true });
    try {
      const newImovel = await imovelService.create(data);
      set((state) => ({ imoveis: [...state.imoveis, newImovel], isLoading: false }));
    } catch (err: any) {
      set({ isLoading: false, error: "Erro ao criar imóvel" });
      throw err;
    }
  },

  updateImovel: async (data: UpdateImovelDto) => {
    try {
      const updated = await imovelService.update(data);
      set((state) => ({
        imoveis: state.imoveis.map((i) => (i.id === data.id ? updated : i)),
        selectedImovel: state.selectedImovel?.id === data.id ? updated : state.selectedImovel
      }));
    } catch (err: any) {
      set({ error: "Erro ao atualizar imóvel" });
      throw err;
    }
  },

  deleteImovel: async (id: number) => {
    try {
      await imovelService.delete(id);
      set((state) => ({
        imoveis: state.imoveis.filter((i) => i.id !== id)
      }));
    } catch (err: any) {
      set({ error: "Erro ao deletar imóvel" });
      throw err;
    }
  },
toggleLead: async (imovelId: number, leadId: number) => {
    try {
      const data = await imovelService.toggleLead(imovelId, leadId);
      
      set((state) => ({
        selectedImovel: state.selectedImovel?.id === imovelId ? data.imovel : state.selectedImovel,
         imoveis: state.imoveis.map(i => i.id === imovelId ? data.imovel : i)
      }));

    } catch (err: any) {
      set({ error: "Erro ao alternar vínculo do lead" });
      throw err;
    }
  }
}));