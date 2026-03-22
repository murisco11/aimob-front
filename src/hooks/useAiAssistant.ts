import { useAiAssistantStore } from "@/stores/aiAssistantStore";

export const useAiAssistant = () => {
  const store = useAiAssistantStore();

  return {
    selectedAiAssistant: store.selectedItem,
    isLoading: store.isLoading,
    error: store.error,
    
    fetchByIdAiAssistant: store.fetchById,
    fetchAiAssistantByUser: store.fetchAiAssistantByUser,
    updateAiAssistant: store.updateItem,
    deleteAiAssistant: store.deleteItem,
    uploadFile: store.uploadFile
  };
};