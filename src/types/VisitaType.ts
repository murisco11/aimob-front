import { Imovel } from "./ImovelType";
import { Lead } from "./LeadType";
import { User } from "./UserType";

export type VisitaStatus = "agendada" | "realizada" | "cancelada";

export interface Visita {
  id: number;
  name: string;
  data: string | Date;
  descricao?: string;
  status: VisitaStatus;
  createdAt: string;
  updatedAt: string;

  user?: User
  imovel?: Imovel
  lead?: Lead
}

export type CreateVisitaDto = Omit<Visita, "id" | "createdAt" | "updatedAt" | "user" | "imovel" | "lead"> & {
  userId: number;
  imovelId: number;
  leadId: number;
};

export type UpdateVisitaDto = Partial<CreateVisitaDto>;