import { apiClient } from "./api";
import { FirstMessage, CreateFirstMessageDto, UpdateFirstMessageDto } from "@/types/FirstMessageType";

export const firstMessageService = {
  async getAll(): Promise<FirstMessage> {
    const response = await apiClient.get<FirstMessage>("/firstMessage");
    return response.data;
  },

  async getById(id: number): Promise<FirstMessage> {
    const response = await apiClient.get<FirstMessage>(`/firstMessage/${id}`);
    return response.data;
  },

  async create(data: CreateFirstMessageDto): Promise<FirstMessage> {
    const response = await apiClient.post<FirstMessage>("/firstMessage", data);
    return response.data;
  },

  async update(id: number, data: UpdateFirstMessageDto): Promise<FirstMessage> {
    const response = await apiClient.put<FirstMessage>(`/firstMessage/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/firstMessage/${id}`);
  }
};