import { Lead } from "./LeadType";

export type ChatStatus = "open" | "closed" | "pending";

export type Chat = {
  id: number;
  status: ChatStatus;
  instanceName: string;
  lastMessage: string | null;
  lastMessageAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;

  lead?: Lead;    
  user?: any | null;
  mensagens?: any[];
  
  leadId?: number;
  userId?: number | null;
};

export type SendMessage = {
  text: string;
  conversaId: number;
}