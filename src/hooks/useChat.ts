import { useChatStore } from "@/stores/chatStore";

export const useChat = () => {
    const {
        chats,
        isLoading,
        error,
        fetchChats
    } = useChatStore();

    return {
        chats,
        isLoading,
        error,
        fetchChats
    };
}
