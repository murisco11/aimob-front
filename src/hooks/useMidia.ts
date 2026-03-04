import { useMidiaStore } from "@/stores/midiaStore";

export const useMidia = () => {
  const store = useMidiaStore();

  return {
    midias: store.items,
    selectedMidia: store.selectedItem,
    isLoading: store.isLoading,
    error: store.error,
    fetchAllMidia: store.fetchAll,
    fetchByIdMidia: store.fetchById,
    createMidia: store.createItem,
    updateMidia: store.updateItem,
    deleteMidia: store.deleteItem
  };
};