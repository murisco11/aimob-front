import { apiClient } from "./api";
import { Imovel, CreateImovelDto, UpdateImovelDto } from "@/types/ImovelType";

export const imovelService = {
  async getAll(): Promise<Imovel[]> {
    const response = await apiClient.get<Imovel[]>("/imovel");
    return response.data;
  },

  async getById(id: number): Promise<Imovel> {
    const response = await apiClient.get<Imovel>(`/imovel/${id}`);
    return response.data;
  },

  async getByUser(): Promise<Imovel[]> {
    const response = await apiClient.get<Imovel[]>("/imovel/imoveisUser");
    return response.data;
  },

  async getByLead(leadId: number): Promise<Imovel[]> {
    const response = await apiClient.get<Imovel[]>(`/imovel/imoveisLead/${leadId}`);
    return response.data;
  },

  async getByAiAssistantFile(fileId: number): Promise<Imovel> {
    const response = await apiClient.get<Imovel>(`/imovel/aiAssistantFile/${fileId}`);
    return response.data;
  },

  async create(data: CreateImovelDto): Promise<Imovel> {
    const response = await apiClient.post<Imovel>("/imovel", data);
    return response.data;
  },

  async update(data: UpdateImovelDto): Promise<Imovel> {
    const response = await apiClient.put<Imovel>(`/imovel/${data.id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/imovel/${id}`);
  },

async toggleLead(imovelId: number, leadId: number): Promise<{ message: string; imovel: Imovel }> {
    const response = await apiClient.post(`imovel/${imovelId}/leads/${leadId}/toggle`);
    return response.data;
  }
};