import { Lead } from "./LeadType";
import { Mensagem } from "./MensagemType";
import { User } from "./UserType";

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
  mensagens?: Mensagem[];
  
  leadId?: Lead
  userId?: User | null;
};

export type SendMessage = {
  text: string;
  conversaId: number;
  quotedMessageId?: string | null; 
  media?: {                      
    type: string;
    base64: string;
    fileName?: string;
  };
}