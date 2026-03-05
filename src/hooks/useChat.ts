import { useChatStore } from "@/stores/chatStore";

export const useChat = () => {
    const {
        chats,
        sendMessage,
        isLoading,
        fetchChatById,
        selectedChat,
        error,
        fetchChats,
        addIncomingMessage,
        updateLeadStatusInStore,
        setActiveChatId
    } = useChatStore();

    return {
        selectedChat,
        chats,
        sendMessage,
        isLoading,
        fetchChatById,
        error,
        addIncomingMessage,
        fetchChats,
        updateLeadStatusInStore,
        setActiveChatId
    };
}
