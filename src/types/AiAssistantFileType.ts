import { AiAssistant } from "./AiAssistantType";
import { Imovel } from "./ImovelType"; 

export interface AiAssistantFile {
  id: number;
  fileId: string;
  vectorStoreId?: string;
  fileName: string;
  aiAssistant?: AiAssistant;
  imovel?: Imovel;
}
