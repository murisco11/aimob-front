import { create } from "zustand";
import { aiAssistantService } from "@/services/aiAssitantService";
import { AiAssistant, UpdateAiAssistantDto } from "@/types/AiAssistantType";

interface AiAssistantStore {
  data: AiAssistant[];
  selectedItem: AiAssistant | null;
  isLoading: boolean;
  error: string | null;

  fetchById: (id: number) => Promise<void>;
  updateItem: (id: number, data: UpdateAiAssistantDto) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  uploadFile: (id: number, file: File, imovelId: string) => Promise<void>;
}

export const useAiAssistantStore = create<AiAssistantStore>((set, get) => ({
  data: [], // Mantido por padrão AIMOB
  selectedItem: null,
  isLoading: false,
  error: null,

  fetchById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const item = await aiAssistantService.getById(id);
      set({ selectedItem: item, isLoading: false });
    } catch (err) {
      console.error("Erro ao buscar Assistente:", err);
      set({ error: "Erro ao buscar dados do assistente", isLoading: false });
    }
  },

  updateItem: async (id: number, data: UpdateAiAssistantDto) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await aiAssistantService.update(id, data);
      set((state) => ({
        selectedItem: state.selectedItem?.id === id ? updated : state.selectedItem,
        isLoading: false
      }));
    } catch (err) {
      console.error("Erro ao atualizar Assistente:", err);
      set({ error: "Erro ao atualizar assistente", isLoading: false });
      throw err;
    }
  },

  deleteItem: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await aiAssistantService.delete(id);
      set({ selectedItem: null, isLoading: false });
    } catch (err) {
      console.error("Erro ao deletar Assistente:", err);
      set({ error: "Erro ao deletar assistente", isLoading: false });
      throw err;
    }
  },

uploadFile: async (id: number, file: File, imovelId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Passando o imovelId para o service
      const response = await aiAssistantService.uploadFile(id, file, imovelId);
      
      const currentItem = get().selectedItem;
      if (currentItem && currentItem.id === id && response.file) {
        set({
          selectedItem: {
            ...currentItem,
            files: [...(currentItem.files || []), response.file]
          }
        });
      }
      set({ isLoading: false });
    } catch (err) {
      console.error("Erro ao fazer upload para a Vector Store:", err);
      set({ error: "Erro ao enviar arquivo", isLoading: false });
      throw err;
    }
  }
}));