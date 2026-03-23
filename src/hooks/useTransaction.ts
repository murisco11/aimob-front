import { useTransactionStore } from "@/stores/transactionStore";

export const useTransaction = () => {
  const store = useTransactionStore();

  return {
    transactions: store.items,
    selectedTransactions: store.selectedItem,
    isLoading: store.isLoading,
    error: store.error,
    fetchAllTransactions: store.fetchAll,
    fetchTransactionById: store.fetchById,
    createTransaction: store.createItem,
    updateTransaction: store.updateItem,
    deleteTransaction: store.deleteItem
  };
};