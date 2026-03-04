import { apiClient } from "./api";
import { Midia, CreateMidiaDto, UpdateMidiaDto } from "@/types/MidiaType";

export const midiaService = {
  async getAll(): Promise<Midia[]> {
    const response = await apiClient.get<Midia[]>("/midias");
    return response.data;
  },

  async getById(id: number): Promise<Midia> {
    const response = await apiClient.get<Midia>(`/midias/${id}`);
    return response.data;
  },

  async create(data: CreateMidiaDto): Promise<Midia> {
    const response = await apiClient.post<Midia>("/midias", data);
    return response.data;
  },

  async update(id: number, data: UpdateMidiaDto): Promise<Midia> {
    const response = await apiClient.put<Midia>(`/midias/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/midias/${id}`);
  }
};