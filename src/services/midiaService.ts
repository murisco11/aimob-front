import { apiClient } from "./api";
import { Midia, CreateMidiaDto, UpdateMidiaDto } from "@/types/MidiaType";

export const midiaService = {
  async getAll(): Promise<Midia[]> {
    const response = await apiClient.get<Midia[]>("/midia");
    return response.data;
  },

  async getById(id: number): Promise<Midia> {
    const response = await apiClient.get<Midia>(`/midia/${id}`);
    return response.data;
  },

  async uploadFile(file: File, imovelId: number): Promise<Midia> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("imovelId", String(imovelId));

    const response = await apiClient.post<Midia>(
        "/midia/upload",
        formData,
        {
          transformRequest: (data, headers) => {
            delete headers['Content-Type'];
            delete headers['content-type'];
            return data;
          }
        }
    );

    return response.data;
  },

  async create(data: CreateMidiaDto): Promise<Midia> {
    const response = await apiClient.post<Midia>("/midia", data);
    return response.data;
  },

  async update(id: number, data: UpdateMidiaDto): Promise<Midia> {
    const response = await apiClient.put<Midia>(`/midia/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/midia/${id}`);
  }
};