import { User } from "./UserType";

export interface Documento {
  id: number;
  url: string;
  name: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  user?: User;
}

export interface GenerateDocumentoDto {
  templateId: number;
  userId: number;
  variables: Record<string, string>; 
}

export type CreateDocumentoDto = Omit<Documento, "id" | "createdAt" | "updatedAt" | "user"> & {
  userId: number;
};

export type UpdateDocumentoDto = Partial<CreateDocumentoDto>;

export interface UploadDocumentoResponse {
  documento: Documento; 
}