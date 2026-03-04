import { User } from "./UserType"; 
import { Lead } from "./LeadType"; 
import { Visit } from "@/services/types";
import { Midia } from "./MidiaType";

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
  
  aceitaPets: boolean;
  andar?: number;
  mobiliado: boolean;
  comissao?: number;
  expectativaVenda?: string;
  perfilComprador?: string;
  infoProprietario?: string;
  
  isActive: boolean;
  
  user?: User;
  leads?: Lead[];
  visitas?: Visit[]; 
  // posts?: Post[];
  midias?: Midia[];
  // aiAssistantFiles?: AiAssistantFile[]; 
}

export type CreateImovelDto = Omit<Imovel, "id" | "isActive" | "user" | "leads" | "visitas" | "posts" | "aiAssistantFiles">;

export type UpdateImovelDto = Partial<CreateImovelDto> & { id: number; isActive?: boolean; leads?: Lead[] };