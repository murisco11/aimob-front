import { User } from "./UserType";

export interface BlockedPerson {
    id: number;
    number: string;
    createdAt: string | Date;
    user?: User;
}

export type CreateBlockedPersonDto = Omit<BlockedPerson, "id" | "createdAt" | "user"> & {
    userId: number;
};

export type UpdateBlockedPersonDto = Partial<CreateBlockedPersonDto>;