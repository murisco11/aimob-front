import { User } from "./UserType";
import { TransactionType as TransactionCategory } from "./TransactionTypeType";
import {Imovel} from "@/types/ImovelType.ts";

export interface Transaction {
  id: number;
  name: string;
  isProfit: boolean;
  valor: number;
  createdAt: string | Date;
  transactionType?: TransactionCategory;
  user?: User;
  imovel?: Imovel;
}

export type CreateTransactionDto = Omit<Transaction, "id" | "createdAt" | "transactionType" | "user"> & {
  transactionTypeId?: number;
};

export type UpdateTransactionDto = Partial<CreateTransactionDto>;