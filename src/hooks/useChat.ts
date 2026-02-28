import { useChatStore } from "@/stores/chatStore";

export const useChat = () => {
    const {
        chats,
        sendMessage,
        isLoading,
        fetchChatById,
        selectedChat,
        error,
        fetchChats
    } = useChatStore();

    return {
        selectedChat,
        chats,
        sendMessage,
        isLoading,
        fetchChatById,
        error,
        fetchChats
    };
}
