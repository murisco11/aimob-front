export interface User {
  id: number;
  hashId: string;
  name: string;
  email: string;
  phone: string;
  aiActive: boolean;
  role: "user" | "coach" | "admin";
  instanceName?: string;
  instagramAccountId?: string;

}

export type UpdateUserDto = Partial<Omit<User, "id" | "hashId" | "role">>;