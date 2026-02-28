export type Lead = {
  id: number;
  name: string;
  description?: string; 
  phone?: string;
  aiActive: boolean;
  threadId?: string;
  lid?: string;
  temperatura?: string;
  instanceName: string;
  createdAt: Date | string; 
  updatedAt: Date | string;
  
  user?: any; 
  imoveis?: any[];
  chats?: any[];
};