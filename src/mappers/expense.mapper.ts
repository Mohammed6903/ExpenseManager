import { ExpenseDocument } from "../models/expense.model";
import { ExpenseResponseDTO } from "../validators/expense/ExpenseResponse.dto";

export const toExpenseResponseDTO = (
  data: ExpenseDocument,
): ExpenseResponseDTO => {
  return {
    id: data._id.toString(),
    userId: data.userId.toString(),
    amount: data.amount,
    currencyType: data.currencyType,
    category: data.category,
    subCategory: data.subCategory,
    description: data.description,
    note: data.note,
    paymentMethod: data.paymentMethod,
    tags: data.tags,
    isRecurring: data.isRecurring,
    expenseDate: data.expenseDate,
    entryDate: data.entryDate,
    deletedAt: data.deletedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

