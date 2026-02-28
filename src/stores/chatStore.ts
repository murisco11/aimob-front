import { chatService } from "@/services/chatService";
import { Chat, SendMessage } from "@/types/chatType";
import { Mensagem } from "@/types/MensagemType";
import { create } from "zustand";

export interface ChatStore {
    chats: Chat[]
    selectedChat: Mensagem[] | null
    isLoading: boolean;
    error: string | null

    sendMessage: (data: SendMessage) => Promise<void>
    fetchChats: () => Promise<void>;
    fetchChatById: (id: number) => Promise<void>
}

export const useChatStore = create<ChatStore>()(
    (set, get) => ({
        chats: [],
        isLoading: false,
        selectedChat: null,
        error: null,

        fetchChats: async () => {
            try {
                set({ isLoading: true, error: null });
                const chats = await chatService.getChats();

                set({ chats: chats, isLoading: false });
            } catch (error) {
                console.error("Failed to fetch chats:", error);
                set({ error: "Failed to fetch chats", isLoading: false });
            }
        },
        fetchChatById: async (id: number) => {
            try {
                set({ isLoading: true, error: null });
                const chat = await chatService.getChatById(id);

                set({ selectedChat: chat, isLoading: false });
            } catch (error) {
                console.error("Failed to fetch chats:", error);
                set({ error: "Failed to fetch chats", isLoading: false });
            }
        },
        sendMessage: async (data: SendMessage) => {
            try {
                set({ error: null });

                const novaMensagem = await chatService.sendMessage(data);

                const mensagensAtuais = get().selectedChat || [];

                set({ selectedChat: [...mensagensAtuais, novaMensagem] });

            } catch (error) {
                console.error("Failed to send message:", error);
                set({ error: "Erro ao enviar mensagem" });
            }
        }
    })
);