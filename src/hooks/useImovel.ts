import { useImovelStore } from "@/stores/imovelStore";

export const useLead = () => {
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
