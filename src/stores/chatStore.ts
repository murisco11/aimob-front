import { chatService } from "@/services/chatService";
import { Chat } from "@/types/chatType";
import { create } from "zustand";

export interface ChatStore {
    chats: Chat[]
    isLoading: boolean;
    error: string | null

    fetchChats: () => Promise<void>;
}

export const useChatStore = create<ChatStore>()(
    (set) => ({
        chats: [],
        isLoading: false,
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
        }
    })
);