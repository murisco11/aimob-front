import { Imovel } from "./ImovelType";
import { User } from "./UserType";

export interface Midia {
  id: number;
  url: string;
  imovel?: Imovel;
  base64Data?: string;
  user?: User;
}

export type CreateMidiaDto = Omit<Midia, "id" | "imovel" | "user"> & {
  imovelId: number;
  userId: number;
};

export type UpdateMidiaDto = Partial<CreateMidiaDto>;