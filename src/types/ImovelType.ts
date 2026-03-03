import { User } from "./UserType"; // Ajuste o path conforme sua estrutura
import { Lead } from "./LeadType"; // Ajuste o path conforme sua estrutura
import { Visit } from "@/services/types";

// Se existirem as outras tipagens, você pode importá-las (Visita, Post, AiAssistantFile)
// import { Visita } from "./VisitaType";
// import { Post } from "./PostType";
// import { AiAssistantFile } from "./AiAssistantFileType";

export interface Imovel {
  id: number;
  name: string;
  address?: string;
  valor: number;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  area?: number;
  iptu?: number;
  condominio?: number;
  description?: string;
  isActive: boolean;
  
  user?: User;
  leads?: Lead[];
  visitas?: Visit[]; 
  posts?: any[];
  aiAssistantFiles?: any[]; 
}

export type CreateImovelDto = Omit<Imovel, "id" | "isActive" | "user" | "leads" | "visitas" | "posts" | "aiAssistantFiles">;

export type UpdateImovelDto = Partial<CreateImovelDto> & { id: number; isActive?: boolean; leads?: Lead[] };