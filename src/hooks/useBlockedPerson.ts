import { useBlockedPersonStore } from "@/stores/blockedPersonStore.ts";

export const useBlockedPerson = () => {
    const store = useBlockedPersonStore();

    return {
        blockedPersons: store.items,
        selectedBlockedPerson: store.selectedItem,
        isLoading: store.isLoading,
        error: store.error,
        fetchAllBlockedPerson: store.fetchAll,
        fetchByIdBlockedPerson: store.fetchById,
        createBlockedPerson: store.createItem,
        updateBlockedPerson: store.updateItem,
        deleteBlockedPerson: store.deleteItem
    };
};