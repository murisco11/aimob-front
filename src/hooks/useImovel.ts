import { useImovelStore } from "@/stores/imovelStore";

export const useImovel = () => {
    const store = useImovelStore();

    return {
        imoveis: store.imoveis,
        selectedImovel: store.selectedImovel,
        isLoading: store.isLoading,
        error: store.error,

        fetchAllImovel: store.fetchAll,
        fetchByIdImovel: store.fetchById,
        fetchByUser: store.fetchByUser,
        fetchByLead: store.fetchByLead,
        fetchByAiAssistantFile: store.fetchByAiAssistantFile,
        createImovel: store.createImovel,
        updateImovel: store.updateImovel,
        deleteImovel: store.deleteImovel,
        toggleLead: store.toggleLead
    };
};