import { imovelService } from "@/services/imovelService";
import { Imovel } from "@/types/ImovelType";
import { create } from "zustand";

export interface ImovelStore {
    imoveis: Imovel[]
    isLoading: boolean;
    error: string | null

    fetchImoveis: () => Promise<void>;
}

export const useImovelStore = create<ImovelStore>()(
    (set, get) => ({
        imoveis: [],
        isLoading: false,
        error: null,

        fetchImoveis: async () => {
            try {
                set({ isLoading: true, error: null });
                const imoveis = await imovelService.getImoveis();

                set({ imoveis: imoveis, isLoading: false });
            } catch (error) {
                console.error("Failed to fetch imoveis:", error);
                set({ error: "Failed to fetch imoveis", isLoading: false });
            }
        }
    })
);
