import { useImovelStore } from "@/stores/imovelStore";

export const useImovel = () => {
    const {
        imoveis,
        isLoading,
        error,
        fetchImoveis
    } = useImovelStore();

    return {
        imoveis,
        isLoading,
        error,
        fetchImoveis
    };
}
