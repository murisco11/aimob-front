import { apiClient } from "./api";
import { CreateVisitaDto, UpdateVisitaDto, Visita } from "@/types/VisitaType";

export const visitaService = {
  async getAll(): Promise<Visita[]> {
    const response = await apiClient.get<Visita[]>("/visita");
    return response.data;
  },

  async getById(id: number): Promise<Visita> {
    const response = await apiClient.get<Visita>(`/visita/${id}`);
    return response.data;
  },

  async create(data: CreateVisitaDto): Promise<Visita> {
    const response = await apiClient.post<Visita>("/visita", data);
    return response.data;
  },

  async update(id: number, data: UpdateVisitaDto): Promise<Visita> {
    const response = await apiClient.put<Visita>(`/visita/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/visita/${id}`);
  }
};