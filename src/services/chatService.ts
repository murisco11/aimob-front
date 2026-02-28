import { Mensagem } from "@/types/MensagemType";
import { apiClient } from "./api";
import { Chat } from "@/types/ChatType";

export const chatService = {
  async getChats(): Promise<Chat[]> {
    const response = await apiClient.get<Chat[]>("/chat");
    return response.data;
  },
    async getChatById(id: number): Promise<Mensagem[]> {
    const response = await apiClient.get<Mensagem[]>(`/chat/${id}/messages`);
    return response.data;
  },
};