import { apiClient } from "./api";
import { Documento, CreateDocumentoDto, UpdateDocumentoDto, UploadDocumentoResponse, GenerateDocumentoDto } from "@/types/DocumentoType";

export const documentoService = {
  async getAll(): Promise<Documento[]> {
    const response = await apiClient.get<Documento[]>("/documento");
    return response.data;
  },

  async getById(id: number): Promise<Documento> {
    const response = await apiClient.get<Documento>(`/documento/${id}`);
    return response.data;
  },

  async getDownloadLink(id: number): Promise<string> {
    const response = await apiClient.get<{ url: string }>(`/documento/${id}/download`);
    return response.data.url;
  },

  async create(data: CreateDocumentoDto): Promise<Documento> {
    const response = await apiClient.post<Documento>("/documento", data);
    return response.data;
  },
  async generateFromTemplate(data: GenerateDocumentoDto): Promise<Documento> {
    const response = await apiClient.post<Documento>("/documento/generate", data);
    return response.data;
  },
  async update(id: number, data: UpdateDocumentoDto): Promise<Documento> {
    const response = await apiClient.put<Documento>(`/documento/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/documento/${id}`);
  },


  async uploadFile(file: File, userId: number, name: string): Promise<UploadDocumentoResponse> {
    console.log("Teste vital - É um arquivo Blob/File verdadeiro?", file instanceof File);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", String(userId));
    formData.append("name", name);


    const response = await apiClient.post<UploadDocumentoResponse>(
      "/documento/upload",
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

  async sendToLeads(docId: number, leadIds: number[]): Promise<{ sent: number; errors: string[] }> {
    const response = await apiClient.post<{ sent: number; errors: string[] }>(`/documento/${docId}/send-to-leads`, { leadIds });
    return response.data;
  }
};