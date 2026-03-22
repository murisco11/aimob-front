import { create } from "zustand";
import { blockedPersonService } from "@/services/blockedPersonService";
import { BlockedPerson, CreateBlockedPersonDto, UpdateBlockedPersonDto } from "@/types/BlockedPersonType";

interface BlockedPersonStore {
    items: BlockedPerson[];
    selectedItem: BlockedPerson | null;
    isLoading: boolean;
    error: string | null;

    fetchAll: () => Promise<void>;
    fetchById: (id: number) => Promise<void>;
    createItem: (data: CreateBlockedPersonDto) => Promise<void>;
    updateItem: (id: number, data: UpdateBlockedPersonDto) => Promise<void>;
    deleteItem: (id: number) => Promise<void>;
}

export const useBlockedPersonStore = create<BlockedPersonStore>((set, get) => ({
    items: [],
    selectedItem: null,
    isLoading: false,
    error: null,

    fetchAll: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await blockedPersonService.getAll();
            set({ items: data, isLoading: false });
        } catch (err) {
            console.error(err);
            set({ error: "Erro ao buscar pessoas bloqueadas", isLoading: false });
        }
    },

    fetchById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const item = await blockedPersonService.getById(id);
            set({ selectedItem: item, isLoading: false });
        } catch (err) {
            console.error(err);
            set({ error: "Erro ao buscar pessoa bloqueada", isLoading: false });
        }
    },

    createItem: async (data: CreateBlockedPersonDto) => {
        set({ isLoading: true });
        try {
            const newItem = await blockedPersonService.create(data);
            set((state) => ({ items: [...state.items, newItem], isLoading: false }));
        } catch (err) {
            console.error(err);
            set({ isLoading: false });
            throw err;
        }
    },

    updateItem: async (id: number, data: UpdateBlockedPersonDto) => {
        try {
            const updated = await blockedPersonService.update(id, data);
            set((state) => ({
                items: state.items.map((i) => (i.id === id ? updated : i)),
                selectedItem: state.selectedItem?.id === id ? updated : state.selectedItem
            }));
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    deleteItem: async (id: number) => {
        try {
            await blockedPersonService.delete(id);
            set((state) => ({
                items: state.items.filter((i) => i.id !== id),
                selectedItem: state.selectedItem?.id === id ? null : state.selectedItem
            }));
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}));