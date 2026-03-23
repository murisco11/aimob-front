import { useAiAssistantFileStore } from "@/stores/aiAssistantFileStore";

export const useAiAssistantFile = () => {
  const store = useAiAssistantFileStore();

  return {
    files: store.data,
    isLoading: store.isLoading,
    error: store.error,
    
    fetchFilesByAssistant: store.fetchByAssistant,
    deleteFile: store.deleteFile
  };
};