import { chatService } from "@/services/chatService";
import { Chat, SendMessage } from "@/types/chatType";
import { Mensagem } from "@/types/MensagemType";
import { create } from "zustand";

export interface ChatStore {
    chats: Chat[]
    selectedChat: Mensagem[] | null
    isLoading: boolean;
    error: string | null

    updateLeadStatusInStore: (leadId: number, aiActive: boolean) => void;
    sendMessage: (data: SendMessage) => Promise<void>
    fetchChats: () => Promise<void>;
    fetchChatById: (id: number) => Promise<void>
    addIncomingMessage: (conversaId: number, mensagem: Mensagem) => void;
}

export const useChatStore = create<ChatStore>()(
    (set, get) => ({
        chats: [],
        isLoading: false,
        selectedChat: null,
        error: null,
        updateLeadStatusInStore: (leadId, aiActive) => {
            set((state) => ({
                chats: state.chats.map((chat) =>
                    chat.lead.id === leadId
                        ? { ...chat, lead: { ...chat.lead, aiActive } }
                        : chat
                )
            }));
        },
        addIncomingMessage: (conversaId, novaMensagem) => {
            const { selectedChat, chats } = get();

            if (selectedChat) {
                set({ selectedChat: [...selectedChat, novaMensagem] });
            }

            const updatedChats = chats.map(chat => {
                if (chat.id === conversaId) {
                    return {
                        ...chat,
                        lastMessage: novaMensagem.body ?? "Mídia Recebida",
                        lastMessageAt: novaMensagem.createdAt
                    };
                }
                return chat;
            });

            set({ chats: updatedChats });
        },
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