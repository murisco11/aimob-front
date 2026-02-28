import { apiClient } from "./api";
import { Lead, CreateLeadInput } from "./types";

export const leadService = {
  async getLeads(): Promise<Lead[]> {
    const response = await apiClient.get<Lead[]>("/leads");
    return response.data;
  },
};