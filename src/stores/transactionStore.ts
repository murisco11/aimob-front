import { create } from "zustand";
import { transactionService } from "@/services/transactionService";
import { Transaction, CreateTransactionDto, UpdateTransactionDto } from "@/types/TransactionType";

interface TransactionStore {
  items: Transaction[];
  selectedItem: Transaction | null;
  isLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  createItem: (data: CreateTransactionDto) => Promise<void>;
  updateItem: (id: number, data: UpdateTransactionDto) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await transactionService.getAll();
      set({ items: data, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ error: "Erro ao buscar transações", isLoading: false });
    }
  },

  fetchById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const item = await transactionService.getById(id);
      set({ selectedItem: item, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ error: "Erro ao buscar transação", isLoading: false });
    }
  },

  createItem: async (data: CreateTransactionDto) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await transactionService.create(data);
      set((state) => ({ items: [...state.items, newItem], isLoading: false }));
    } catch (err) {
      console.error(err);
      set({ error: "Erro ao criar transação", isLoading: false });
      throw err;
    }
  },

  updateItem: async (id: number, data: UpdateTransactionDto) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await transactionService.update(id, data);
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? updated : i)),
        selectedItem: state.selectedItem?.id === id ? updated : state.selectedItem,
        isLoading: false
      }));
    } catch (err) {
      console.error(err);
      set({ error: "Erro ao atualizar transação", isLoading: false });
      throw err;
    }
  },

  deleteItem: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await transactionService.delete(id);
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
        isLoading: false
      }));
    } catch (err) {
      console.error(err);
      set({ error: "Erro ao deletar transação", isLoading: false });
      throw err;
    }
  }
}));