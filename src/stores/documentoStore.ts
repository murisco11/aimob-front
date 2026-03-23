import {create} from "zustand";
import {documentoService} from "@/services/documentoService";
import {Documento, CreateDocumentoDto, UpdateDocumentoDto, GenerateDocumentoDto} from "@/types/DocumentoType";

interface DocumentoStore {
    items: Documento[];
    selectedItem: Documento | null;
    isLoading: boolean;
    error: string | null;

    fetchAll: () => Promise<void>;
    fetchById: (id: number) => Promise<void>;
    createItem: (data: CreateDocumentoDto) => Promise<void>;
    updateItem: (id: number, data: UpdateDocumentoDto) => Promise<void>;
    deleteItem: (id: number) => Promise<void>;
    getDownloadLink: (id: number) => Promise<string>;
    uploadDocumento: (file: File, userId: number, name: string) => Promise<void>;
    generateDocumento: (data: GenerateDocumentoDto) => Promise<void>;
}

export const useDocumentoStore = create<DocumentoStore>((set, get) => ({
    items: [],
    selectedItem: null,
    isLoading: false,
    error: null,

    fetchAll: async () => {
        set({isLoading: true, error: null});
        try {
            const data = await documentoService.getAll();
            set({items: data, isLoading: false});
        } catch (err) {
            console.error("Erro ao buscar documentos:", err);
            set({error: "Erro ao buscar dados", isLoading: false});
        }
    },

    getDownloadLink: async (id: number) => {
        set({isLoading: true, error: null});
        try {
            const url = await documentoService.getDownloadLink(id);
            set({isLoading: false});
            return url; // Retorna a url para o frontend usar no window.open()
        } catch (err) {
            console.error("Erro ao gerar link do documento:", err);
            set({error: "Erro ao gerar link", isLoading: false});
            throw err;
        }
    },

    fetchById: async (id: number) => {
        set({isLoading: true, error: null});
        try {
            const item = await documentoService.getById(id);
            set({selectedItem: item, isLoading: false});
        } catch (err) {
            console.error("Erro ao buscar documento:", err);
            set({error: "Erro ao buscar item", isLoading: false});
        }
    },

    createItem: async (data: CreateDocumentoDto) => {
        set({isLoading: true, error: null});
        try {
            const newItem = await documentoService.create(data);
            set((state) => ({items: [...state.items, newItem], isLoading: false}));
        } catch (err) {
            console.error("Erro ao criar documento:", err);
            set({error: "Erro ao criar documento", isLoading: false});
            throw err;
        }
    },

    updateItem: async (id: number, data: UpdateDocumentoDto) => {
        set({isLoading: true, error: null});
        try {
            const updated = await documentoService.update(id, data);
            set((state) => ({
                items: state.items.map((i) => (i.id === id ? updated : i)),
                selectedItem: state.selectedItem?.id === id ? updated : state.selectedItem,
                isLoading: false
            }));
        } catch (err) {
            console.error("Erro ao atualizar documento:", err);
            set({error: "Erro ao atualizar documento", isLoading: false});
            throw err;
        }
    },

    deleteItem: async (id: number) => {
        set({isLoading: true, error: null});
        try {
            await documentoService.delete(id);
            set((state) => ({
                items: state.items.filter((i) => i.id !== id),
                selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
                isLoading: false
            }));
        } catch (err) {
            console.error("Erro ao deletar documento:", err);
            set({error: "Erro ao deletar documento", isLoading: false});
            throw err;
        }
    },

    uploadDocumento: async (file: File, userId: number, name: string) => {
        set({isLoading: true, error: null});
        try {
            const response = await documentoService.uploadFile(file, userId, name);

            if (response.documento) {
                set((state) => ({
                    items: [...state.items, response.documento],
                    isLoading: false
                }));
            } else {
                set({isLoading: false});
            }
        } catch (err) {
            console.error("Erro ao fazer upload do documento:", err);
            set({error: "Erro ao enviar arquivo", isLoading: false});
            throw err;
        }
    },
    generateDocumento: async (data: GenerateDocumentoDto) => {
        set({isLoading: true, error: null});
        try {
            const newDocumento = await documentoService.generateFromTemplate(data);

            if (newDocumento) {
                set((state) => ({
                    items: [newDocumento, ...state.items],
                    isLoading: false
                }));
            } else {
                set({isLoading: false});
            }
        } catch (err) {
            console.error("Erro ao gerar documento do template:", err);
            set({error: "Erro ao gerar documento", isLoading: false});
            throw err;
        }
    }
}));