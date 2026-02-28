import { useChatStore } from "@/stores/chatStore";

export const useChat = () => {
    const {
        chats,
        isLoading,
        fetchChatById,
        selectedChat,
        error,
        fetchChats
    } = useChatStore();

    return {
        selectedChat,
        chats,
        isLoading,
        fetchChatById,
        error,
        fetchChats
    };
}
