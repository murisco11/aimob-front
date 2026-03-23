import { User } from "./UserType"; 
import { AiAssistantFile } from "./AiAssistantFileType";

export interface AiAssistant {
  id: number;
  prompt: string;
  idAssistant: string;
  isActive: boolean;
  temperature: number;
  vectorStoreId?: string;
  files?: AiAssistantFile[];
  user?: User;
}

export type CreateAiAssistantDto = Omit<AiAssistant, "id" | "files" | "user"> & {
  userId: number; 
};

export type UpdateAiAssistantDto = Partial<CreateAiAssistantDto>;

export interface UploadFileResponse {
  message?: string;
  file?: AiAssistantFile;
}