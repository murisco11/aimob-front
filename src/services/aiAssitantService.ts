import { apiClient } from "./api";
import { AiAssistant, UpdateAiAssistantDto, UploadFileResponse } from "@/types/AiAssistantType";

export const aiAssistantService = {
    async getById(id: number): Promise<AiAssistant> {
        const response = await apiClient.get<AiAssistant>(`/aiAssistant/${id}`);
        return response.data;
    },

    async update(id: number, data: UpdateAiAssistantDto): Promise<AiAssistant> {
        const response = await apiClient.put<AiAssistant>(`/aiAssistant/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/aiAssistant/${id}`);
    },

    async uploadFile(id: number, file: File): Promise<UploadFileResponse> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post<UploadFileResponse>(
            `/aiAssistant/${id}/upload`,
            formData
        );

        return response.data;
    }
};