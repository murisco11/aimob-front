import { create } from "zustand";
import { visitaService } from "@/services/visitaService";
import { CreateVisitaDto, UpdateVisitaDto, Visita } from "@/types/VisitaType";

export interface VisitaStore {
  visitas: Visita[];
  selectedVisita: Visita | null;
  isLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  createVisita: (data: CreateVisitaDto) => Promise<Visita>;
  updateVisita: (id: number, data: UpdateVisitaDto) => Promise<Visita>;
  deleteVisita: (id: number) => Promise<void>;
}

export const useVisitaStore = create<VisitaStore>((set, get) => ({
  visitas: [],
  selectedVisita: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await visitaService.getAll();
      set({ visitas: data, isLoading: false });
    } catch (error) {
      console.error("Falha ao buscar visitas:", error);
      set({ error: "Falha ao buscar visitas", isLoading: false });
    }
  },

  fetchById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const visita = await visitaService.getById(id);
      set({ selectedVisita: visita, isLoading: false });
    } catch (error) {
      console.error(`Falha ao buscar visita ${id}:`, error);
      set({ error: "Falha ao buscar a visita", isLoading: false });
    }
  },

  createVisita: async (data: CreateVisitaDto) => {
    set({ isLoading: true, error: null });
    try {
      const createdVisita = await visitaService.create(data);
      set((state) => ({ visitas: [...state.visitas, createdVisita], isLoading: false }));
      return createdVisita;
    } catch (error) {
      console.error("Falha ao criar visita:", error);
      set({ error: "Falha ao criar visita", isLoading: false });
      throw error;
    }
  },

  updateVisita: async (id: number, data: UpdateVisitaDto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedVisita = await visitaService.update(id, data);
      set((state) => ({
        visitas: state.visitas.map((v) => (v.id === id ? updatedVisita : v)),
        selectedVisita: state.selectedVisita?.id === id ? updatedVisita : state.selectedVisita,
        isLoading: false
      }));
      return updatedVisita;
    } catch (error) {
      console.error("Falha ao atualizar visita:", error);
      set({ error: "Falha ao atualizar visita", isLoading: false });
      throw error;
    }
  },

  deleteVisita: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await visitaService.delete(id);
      set((state) => ({
        visitas: state.visitas.filter((v) => v.id !== id),
        selectedVisita: state.selectedVisita?.id === id ? null : state.selectedVisita,
        isLoading: false
      }));
    } catch (error) {
      console.error("Falha ao deletar visita:", error);
      set({ error: "Falha ao deletar visita", isLoading: false });
      throw error;
    }
  },
}));