import { apiClient } from "./api";
import { BlockedPerson, CreateBlockedPersonDto, UpdateBlockedPersonDto } from "@/types/BlockedPersonType";

export const blockedPersonService = {
    async getAll(): Promise<BlockedPerson[]> {
        const response = await apiClient.get<BlockedPerson[]>("/blockedPerson");
        return response.data;
    },

    async getById(id: number): Promise<BlockedPerson> {
        const response = await apiClient.get<BlockedPerson>(`/blockedPerson/${id}`);
        return response.data;
    },

    async create(data: CreateBlockedPersonDto): Promise<BlockedPerson> {
        const response = await apiClient.post<BlockedPerson>("/blockedPerson", data);
        return response.data;
    },

    async update(id: number, data: UpdateBlockedPersonDto): Promise<BlockedPerson> {
        const response = await apiClient.put<BlockedPerson>(`/blockedPerson/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/blockedPerson/${id}`);
    }
};