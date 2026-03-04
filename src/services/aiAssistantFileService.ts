import { apiClient } from "./api";
import { AiAssistantFile } from "@/types/AiAssistantFileType";

export const aiAssistantFileService = {
  async getAllByAssistant(idAssistant: number): Promise<AiAssistantFile[]> {
    const response = await apiClient.get<AiAssistantFile[]>(`/aiAgentFile/assistants/${idAssistant}/files`);
    return response.data;
  },

  async delete(idFile: number): Promise<void> {
    await apiClient.delete(`/aiAssistantFile/files/${idFile}`);
  }
};