import { useVisitaStore } from "@/stores/visitaStore";

export const useVisita = () => {
  const store = useVisitaStore();
  
  return {
    visitas: store.visitas,
    selectedVisita: store.selectedVisita,
    isLoading: store.isLoading,
    error: store.error,
    
    fetchAllVisita: store.fetchAll,
    fetchByIdVisita: store.fetchById,
    createVisita: store.createVisita,
    updateVisita: store.updateVisita,
    deleteVisita: store.deleteVisita
  };
};