import { Chat } from "./chatType";
import { Imovel } from "./ImovelType";
import { Lead } from "./LeadType";

export type UserRole = "user" | "coach" | "admin";

export type User = {
    id: number;
    name: string;
    email: string;
    password?: string;
    phone: string;
    role: UserRole;
    instanceName?: string;
    instagramAccountId?: string;

    conversas?: Chat[];
    leads?: Lead[];
    imoveis?: Imovel[];
    posts?: any[];
    firstMessage?: any;
    aiAssistant?: any;
};