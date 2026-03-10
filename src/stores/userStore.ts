import { create } from "zustand";
import { userService } from "@/services/userService";
import { User, UpdateUserDto } from "@/types/UserType";

interface UserStore {
  selectedItem: User | null;
  isLoading: boolean;
  error: string | null;

  fetchById: (id: number) => Promise<void>;
  updateItem: (id: number, data: UpdateUserDto) => Promise<void>;
  clearSelected: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  selectedItem: null,
  isLoading: false,
  error: null,

  fetchById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userService.getById(id);
      set({ selectedItem: user, isLoading: false });
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      set({ error: "Erro ao carregar perfil do usuário", isLoading: false });
    }
  },

  updateItem: async (id: number, data: UpdateUserDto) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await userService.update(id, data);
      set({ selectedItem: updated, isLoading: false });
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      set({ isLoading: false });
      throw err;
    }
  },

  clearSelected: () => set({ selectedItem: null, error: null })
}));