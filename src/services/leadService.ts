import { apiClient } from "./api";
import { Lead, CreateLeadInput } from "./types";

export const leadService = {
  async getLeads(): Promise<Lead[]> {
    const response = await apiClient.get<Lead[]>("/lead");
    return response.data;
  },
  async updateAiActive(id: number, aiActive: boolean): Promise<Lead> {
    const response = await apiClient.put<Lead>(`/lead/${id}`, { aiActive });
    return response.data;
  },
};