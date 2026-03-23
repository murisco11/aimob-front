import { User } from "./UserType";

export interface FirstMessage {
  id: number;
  content: string;
  isActive: boolean;
  user?: User; 
}

export type CreateFirstMessageDto = Omit<FirstMessage, "id" | "user"> & {
  userId: number; 
};

export type UpdateFirstMessageDto = Partial<CreateFirstMessageDto>;