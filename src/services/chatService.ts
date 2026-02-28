import { apiClient } from "./api";
import { Chat } from "@/types/chatType";

export const chatService = {
  async getChats(): Promise<Chat[]> {
    const response = await apiClient.get<Chat[]>("/chat");
    return response.data;
  },
};