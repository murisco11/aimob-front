import { Imovel } from "./ImovelType";
import { User } from "./UserType";

export interface Midia {
  id: number;
  url: string;
  imovel?: Imovel;
  base64Data?: string;
  user?: User;
}

export interface CreateMidiaDto {
  base64Data: string;
  extension: string;
  imovelId: number;
}

export type UpdateMidiaDto = Partial<CreateMidiaDto>;