import { create } from "zustand";
import { aiAssistantFileService } from "@/services/aiAssistantFileService";
import { AiAssistantFile } from "@/types/AiAssistantFileType";

interface AiAssistantFileStore {
  data: AiAssistantFile[];
  isLoading: boolean;
  error: string | null;

  fetchByAssistant: (idAssistant: number) => Promise<void>;
  deleteFile: (idFile: number) => Promise<void>;
}

export const useAiAssistantFileStore = create<AiAssistantFileStore>((set) => ({
  data: [],
  isLoading: false,
  error: null,

  fetchByAssistant: async (idAssistant: number) => {
    set({ isLoading: true, error: null });
    try {
      const files = await aiAssistantFileService.getAllByAssistant(idAssistant);
      set({ data: files, isLoading: false });
    } catch (err) {
      console.error("Erro ao buscar arquivos do Assistente:", err);
      set({ error: "Erro ao buscar arquivos", isLoading: false });
    }
  },

  deleteFile: async (idFile: number) => {
    set({ isLoading: true, error: null });
    try {
      await aiAssistantFileService.delete(idFile);
      set((state) => ({
        data: state.data.filter((file) => file.id !== idFile),
        isLoading: false
      }));
    } catch (err) {
      console.error("Erro ao deletar arquivo:", err);
      set({ error: "Erro ao deletar arquivo", isLoading: false });
      throw err;
    }
  }
}));