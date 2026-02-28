export type ChatStatus = "open" | "closed" | "pending";

export type Chat = {
  id: number;
  status: ChatStatus;
  instanceName: string;
  lastMessage: string | null;
  lastMessageAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;

  lead?: any;    
  user?: any | null;
  mensagens?: any[];
  
  leadId?: number;
  userId?: number | null;
};