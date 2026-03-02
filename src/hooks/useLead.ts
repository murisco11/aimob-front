import { useLeadStore } from "@/stores/leadStore";

export const useLead = () => {
  const store = useLeadStore();

  return {
    leads: store.items,
    selectedLead: store.selectedItem,
    isLoading: store.isLoading,
    error: store.error,
    
    fetchAllLead: store.fetchAll,
    fetchByIdLead: store.fetchById,
    createLead: store.createItem,
    updateLead: store.updateItem,
    deleteLead: store.deleteItem,
    
    updateLeadAiActive: store.updateLeadAiActive
  };
};