import { create } from "zustand";
import { transactionTypeService } from "@/services/transactionTypeService";
import { TransactionType, CreateTransactionTypeDto, UpdateTransactionTypeDto } from "@/types/TransactionTypeType";

interface TransactionTypeStore {
  items: TransactionType[];
  selectedItem: TransactionType | null;
  isLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  createItem: (data: CreateTransactionTypeDto) => Promise<void>;
  updateItem: (id: number, data: UpdateTransactionTypeDto) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

export const useTransactionTypeStore = create<TransactionTypeStore>((set, get) => ({
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await transactionTypeService.getAll();
      set({ items: data, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ error: "Erro ao buscar categorias de transação", isLoading: false });
    }
  },

  fetchById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const item = await transactionTypeService.getById(id);
      set({ selectedItem: item, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ error: "Erro ao buscar categoria de transação", isLoading: false });
    }
  },

  createItem: async (data: CreateTransactionTypeDto) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await transactionTypeService.create(data);
      set((state) => ({ items: [...state.items, newItem], isLoading: false }));
    } catch (err) {
      console.error(err);
      set({ error: "Erro ao criar categoria de transação", isLoading: false });
      throw err;
    }
  },

  updateItem: async (id: number, data: UpdateTransactionTypeDto) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await transactionTypeService.update(id, data);
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? updated : i)),
        selectedItem: state.selectedItem?.id === id ? updated : state.selectedItem,
        isLoading: false
      }));
    } catch (err) {
      console.error(err);
      set({ error: "Erro ao atualizar categoria de transação", isLoading: false });
      throw err;
    }
  },

  deleteItem: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await transactionTypeService.delete(id);
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
        isLoading: false
      }));
    } catch (err) {
      console.error(err);
      set({ error: "Erro ao deletar categoria de transação", isLoading: false });
      throw err;
    }
  }
}));