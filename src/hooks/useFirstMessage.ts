import { useFirstMessageStore } from "@/stores/firstMessageStore";

export const useFirstMessage = () => {
  const store = useFirstMessageStore();

  return {
    firstMessages: store.items,
    selectedFirstMessage: store.selectedItem,
    isLoading: store.isLoading,
    error: store.error,
    fetchAlFirstMessagel: store.fetchAll,
    fetchByIdFirstMessage: store.fetchById,
    createFirstMessage: store.createItem,
    updateFirstMessage: store.updateItem,
    deleteFirstMessage: store.deleteItem
  };
};