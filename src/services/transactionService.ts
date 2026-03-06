import { apiClient } from "./api";
import { Transaction, CreateTransactionDto, UpdateTransactionDto } from "@/types/TransactionType";

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    const response = await apiClient.get<Transaction[]>("/transaction");
    return response.data;
  },

  async getById(id: number): Promise<Transaction> {
    const response = await apiClient.get<Transaction>(`/transaction/${id}`);
    return response.data;
  },

  async create(data: CreateTransactionDto): Promise<Transaction> {
    const response = await apiClient.post<Transaction>("/transaction", data);
    return response.data;
  },

  async update(id: number, data: UpdateTransactionDto): Promise<Transaction> {
    const response = await apiClient.put<Transaction>(`/transaction/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/transaction/${id}`);
  }
};