import { apiClient } from "./api";
import { Lead, CreateLeadDto, UpdateLeadDto } from "@/types/LeadType";

export const leadService = {
  async getAll(): Promise<Lead[]> {
    const response = await apiClient.get<Lead[]>("/lead");
    return response.data;
  },

  async getById(id: number): Promise<Lead> {
    const response = await apiClient.get<Lead>(`/lead/${id}`);
    return response.data;
  },

  async create(data: CreateLeadDto): Promise<Lead> {
    const response = await apiClient.post<Lead>("/lead", data);
    return response.data;
  },

  async update(id: number, data: UpdateLeadDto): Promise<Lead> {
    const response = await apiClient.put<Lead>(`/lead/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/lead/${id}`);
  },

  async updateAiActive(id: number, aiActive: boolean): Promise<Lead> {
    const response = await apiClient.put<Lead>(`/lead/${id}`, { aiActive });
    return response.data;
  },

  async gerarResumo(id: number): Promise<Lead> {
    const response = await apiClient.post<Lead>(`/lead/${id}/resumo`);
    return response.data;
  }
};