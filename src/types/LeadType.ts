import { Chat } from "./ChatType"; 
import { User } from "./UserType";
import { Imovel } from "./ImovelType";
import { Visita } from "./VisitaType";

export interface Lead {
  id: number;
  name: string;
  description?: string;
  phone?: string;
  aiActive: boolean;
  threadId?: string;
  lid?: string;
  temperatura?: "warm" | "cold" | "hot";
  status: "qualificacao_ia" | "visita_agendada" | "em_negociacao" | "fechado" | "perdido";
  instanceName: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  user?: User;
  imoveis?: Imovel[];
  conversas?: Chat[];
  visitas?: Visita[];
}

export type CreateLeadDto = Omit<Lead, "id" | "createdAt" | "updatedAt" | "user" | "imoveis" | "conversas" | "visitas"> & {
  userId?: number; 
};

export type UpdateLeadDto = Partial<CreateLeadDto>;