import { User } from "./UserType";
import { Transaction } from "./TransactionType";
export interface TransactionType {
    id: number;
    name: string;
    user?: User;
    transactions?: Transaction[];
}

export interface CreateTransactionTypeDto {
    name: string
}

export interface UpdateTransactionTypeDto {
    name: string;
    id: number
}