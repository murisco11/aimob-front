import { useDocumentoStore } from "@/stores/documentoStore";

export const useDocumento = () => {
  const store = useDocumentoStore();

  return {
    documentos: store.items,
    selectedDocumento: store.selectedItem,
    isLoading: store.isLoading,
    error: store.error,
    fetchAllDocumento: store.fetchAll,
    getDownloadLink: store.getDownloadLink,
    fetchById: store.fetchById,
    createDocumento: store.createItem,
    updateDocumento: store.updateItem,
    deleteDocumento: store.deleteItem,
    uploadDocumento: store.uploadDocumento,
    generateDocumento: store.generateDocumento
  };
};