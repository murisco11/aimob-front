import { Chat } from "./ChatType"; 

export type Mensagem = {
  id: number;
  conversa: Chat;
  waMessageId: string | null; 
  fromMe: boolean;
  body: string | null;        
  type: string;
  mediaUrl: string | null;    
  status: string;
  createdAt: Date;
};