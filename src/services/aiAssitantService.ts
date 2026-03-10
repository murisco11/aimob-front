import { apiClient } from "./api";
import { AiAssistant, UpdateAiAssistantDto, UploadFileResponse } from "@/types/AiAssistantType";

export const aiAssistantService = {
    async uploadFile(id: number, file: File, imovelId: string): Promise<UploadFileResponse> {
        console.log("Teste vital - É um arquivo Blob/File verdadeiro?", file instanceof File);

        const formData = new FormData();
        formData.append("file", file);

        formData.append("imovelId", String(imovelId));

        const response = await apiClient.post<UploadFileResponse>(
            `/aiAssistant/${id}/upload`,
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

    async getById(id: number): Promise<AiAssistant> {
        const response = await apiClient.get<AiAssistant>(`/aiAssistant/${id}`);
        return response.data;
    },

    async getByUser(id: number): Promise<AiAssistant> {
        const response = await apiClient.get<AiAssistant>(`/aiAssistant/user/${id}`);
        return response.data;
    },


    async update(id: number, data: UpdateAiAssistantDto): Promise<AiAssistant> {
        const response = await apiClient.put<AiAssistant>(`/aiAssistant/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/aiAssistant/${id}`);
    }
};