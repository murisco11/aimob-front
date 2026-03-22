import { apiClient } from "./api";
import { TransactionType, CreateTransactionTypeDto, UpdateTransactionTypeDto } from "@/types/TransactionTypeType";

export const transactionTypeService = {
  async getAll(): Promise<TransactionType[]> {
    const response = await apiClient.get<TransactionType[]>("/transactionType");
    return response.data;
  },

  async getById(id: number): Promise<TransactionType> {
    const response = await apiClient.get<TransactionType>(`/transactionType/${id}`);
    return response.data;
  },

  async create(data: CreateTransactionTypeDto): Promise<TransactionType> {
    const response = await apiClient.post<TransactionType>("/transactionType", data);
    return response.data;
  },

  async update(id: number, data: UpdateTransactionTypeDto): Promise<TransactionType> {
    const response = await apiClient.put<TransactionType>(`/transactionType/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/transactionType/${id}`);
  }
};