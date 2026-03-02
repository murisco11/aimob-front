import { User } from "./UserType";

export type Imovel = {
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

  userId?: User;
  user?: any; // Ou o tipo 'User'
  
  leadId?: number | null;
  leads?: any | null; // Note que na sua entidade o nome está no plural 'leads', mas é @ManyToOne (um único lead)

  posts?: any[]; // Ou 'Post[]'
  aiAssistantFiles?: any[]; // Ou 'AiAssistantFile[]'
};