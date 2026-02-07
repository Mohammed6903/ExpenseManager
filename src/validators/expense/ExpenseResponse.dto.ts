import { PaymentMethod } from "../../models/expense.model";

export interface ExpenseResponseDTO {
  id: string;
  userId: string;
  amount: number;
  currencyType: string;
  category: string;
  subCategory?: string;
  description?: string;
  note?: string;
  paymentMethod: PaymentMethod;
  tags: string[];
  isRecurring: boolean;
  expenseDate: Date;
  entryDate: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

