import { useTransactionTypeStore } from "@/stores/transactionTypeStore";

export const useTransactionType = () => {
  const store = useTransactionTypeStore();

  return {
    transactionTypes: store.items,
    selectedTransactionType: store.selectedItem,
    isLoading: store.isLoading,
    error: store.error,
    fetchAllTransactionTypeS: store.fetchAll,
    fetchByIdTransactionType: store.fetchById,
    createTransactionType: store.createItem,
    updateTransactionType: store.updateItem,
    deleteTransactionType: store.deleteItem
  };
};