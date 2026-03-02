import { apiClient } from "./api";
import { Imovel } from "@/types/ImovelType";

export const imovelService = {
  async getImoveis(): Promise<Imovel[]> {
    const response = await apiClient.get<Imovel[]>("/imovel");
    return response.data;
  },
};