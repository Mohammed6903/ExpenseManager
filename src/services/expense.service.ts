import { Error as MongooseError } from "mongoose";
import { AppError } from "../errors/AppError";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { Expense } from "../models/expense.model";
import { CreateExpenseDTO } from "../validators/expense/CreateExpense.schema";
import { UpdateExpenseDTO } from "../validators/expense/UpdateExpense.schema";
import { ExpenseResponseDTO } from "../validators/expense/ExpenseResponse.dto";
import { QueryExpensesDTO } from "../validators/expense/QueryExpenses.schema";
import { toExpenseResponseDTO } from "../mappers/expense.mapper";
import { ErrorCode } from "../types/ErrorCode";

const DUPLICATE_THRESHOLD_MS = 60000;

const detectDuplicateExpense = async (
  userId: string,
  amount: number,
  expenseDate: Date,
): Promise<boolean> => {
  const timeThreshold = new Date(expenseDate.getTime() - DUPLICATE_THRESHOLD_MS);
  const timeThresholdEnd = new Date(expenseDate.getTime() + DUPLICATE_THRESHOLD_MS);

  const duplicate = await Expense.findOne({
    userId,
    amount,
    expenseDate: {
      $gte: timeThreshold,
      $lte: timeThresholdEnd,
    },
    deletedAt: null,
  });

  return !!duplicate;
};

export const createExpenseService = async (
  data: CreateExpenseDTO,
): Promise<ExpenseResponseDTO> => {
  try {
    const isDuplicate = await detectDuplicateExpense(
      data.userId!,
      data.amount,
      data.expenseDate,
    );

    if (isDuplicate) {
      throw new BadRequestError(
        "Potential duplicate expense detected within 1 minute window",
        ErrorCode.EXPENSE_DUPLICATE_DETECTED,
      );
    }

    const expense = await Expense.create(data);
    return toExpenseResponseDTO(expense);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof MongooseError) {
      throw new BadRequestError(`${error.name}: ${error.message}`);
    }

    throw new AppError("Error creating expense", 500);
  }
};

export const getAllExpensesService = async (
  userId: string,
): Promise<ExpenseResponseDTO[]> => {
  try {
    const expenses = await Expense.find({
      userId,
      deletedAt: null,
    }).sort({ expenseDate: -1 });

    return expenses.map(toExpenseResponseDTO);
  } catch (error: unknown) {
    if (error instanceof MongooseError) {
      throw new BadRequestError(error.message);
    }

    throw new AppError("Error fetching expenses", 500);
  }
};

export const getExpenseByIdService = async (
  id: string,
  userId: string,
): Promise<ExpenseResponseDTO> => {
  try {
    const expense = await Expense.findById(id);

    if (!expense) {
      throw new NotFoundError("Expense not found", ErrorCode.EXPENSE_NOT_FOUND);
    }

    if (expense.deletedAt) {
      throw new NotFoundError("Expense not found", ErrorCode.EXPENSE_NOT_FOUND);
    }

    if (expense.userId.toString() !== userId) {
      throw new ForbiddenError("Access forbidden", ErrorCode.EXPENSE_FORBIDDEN);
    }

    return toExpenseResponseDTO(expense);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof MongooseError) {
      throw new BadRequestError(error.message);
    }

    throw new AppError("Error fetching expense", 500);
  }
};

export const updateExpenseService = async (
  id: string,
  userId: string,
  data: UpdateExpenseDTO,
): Promise<ExpenseResponseDTO> => {
  try {
    const expense = await Expense.findById(id);

    if (!expense) {
      throw new NotFoundError("Expense not found", ErrorCode.EXPENSE_NOT_FOUND);
    }

    if (expense.deletedAt) {
      throw new NotFoundError("Expense not found", ErrorCode.EXPENSE_NOT_FOUND);
    }

    if (expense.userId.toString() !== userId) {
      throw new ForbiddenError("Access forbidden", ErrorCode.EXPENSE_FORBIDDEN);
    }

    Object.assign(expense, data);
    await expense.save();

    return toExpenseResponseDTO(expense);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof MongooseError) {
      throw new BadRequestError(error.message);
    }

    throw new AppError("Error updating expense", 500);
  }
};

export const softDeleteExpenseService = async (
  id: string,
  userId: string,
): Promise<void> => {
  try {
    const expense = await Expense.findById(id);

    if (!expense) {
      throw new NotFoundError("Expense not found", ErrorCode.EXPENSE_NOT_FOUND);
    }

    if (expense.deletedAt) {
      throw new NotFoundError("Expense not found", ErrorCode.EXPENSE_NOT_FOUND);
    }

    if (expense.userId.toString() !== userId) {
      throw new ForbiddenError("Access forbidden", ErrorCode.EXPENSE_FORBIDDEN);
    }

    expense.deletedAt = new Date();
    await expense.save();
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof MongooseError) {
      throw new BadRequestError(error.message);
    }

    throw new AppError("Error deleting expense", 500);
  }
};

export const searchExpensesService = async (
  userId: string,
  query: QueryExpensesDTO,
): Promise<{
  expenses: ExpenseResponseDTO[];
  pagination: { total: number; page: number; limit: number; pages: number };
}> => {
  try {
    const filter: Record<string, unknown> = { userId, deletedAt: null };

    if (query.startDate) {
      filter.expenseDate = { ...filter.expenseDate as object, $gte: query.startDate };
    }

    if (query.endDate) {
      filter.expenseDate = { ...filter.expenseDate as object, $lte: query.endDate };
    }

    if (query.minAmount !== undefined) {
      filter.amount = { ...filter.amount as object, $gte: query.minAmount };
    }

    if (query.maxAmount !== undefined) {
      filter.amount = { ...filter.amount as object, $lte: query.maxAmount };
    }

    if (query.categories) {
      const cats = Array.isArray(query.categories) ? query.categories : [query.categories];
      filter.category = { $in: cats };
    }

    if (query.tags) {
      const tagArr = Array.isArray(query.tags) ? query.tags : [query.tags];
      filter.tags = { $in: tagArr };
    }

    if (query.paymentMethods) {
      const pmArr = Array.isArray(query.paymentMethods)
        ? query.paymentMethods
        : [query.paymentMethods];
      filter.paymentMethod = { $in: pmArr };
    }

    if (query.searchText) {
      filter.$or = [
        { description: { $regex: query.searchText, $options: "i" } },
        { note: { $regex: query.searchText, $options: "i" } },
      ];
    }

    const sortOption: Record<string, 1 | -1> = {
      [query.sortBy]: query.sortOrder === "asc" ? 1 : -1,
    };

    const skip = (query.page - 1) * query.limit;

    const [expenses, total] = await Promise.all([
      Expense.find(filter).sort(sortOption).skip(skip).limit(query.limit),
      Expense.countDocuments(filter),
    ]);

    return {
      expenses: expenses.map(toExpenseResponseDTO),
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        pages: Math.ceil(total / query.limit),
      },
    };
  } catch (error: unknown) {
    if (error instanceof MongooseError) {
      throw new BadRequestError(error.message);
    }

    throw new AppError("Error searching expenses", 500);
  }
};

export const bulkCreateExpensesService = async (
  userId: string,
  expensesData: Array<Omit<CreateExpenseDTO, "userId">>,
): Promise<{
  created: number;
  failed: number;
  results: Array<{ success: boolean; data?: ExpenseResponseDTO; error?: string; index: number }>;
}> => {
  const results: Array<{
    success: boolean;
    data?: ExpenseResponseDTO;
    error?: string;
    index: number;
  }> = [];

  for (let i = 0; i < expensesData.length; i++) {
    try {
      const expense = await createExpenseService({ ...expensesData[i], userId });
      results.push({ success: true, data: expense, index: i });
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      results.push({ success: false, error: errorMsg, index: i });
    }
  }

  const created = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return { created, failed, results };
};

export const bulkUpdateExpensesService = async (
  userId: string,
  updates: Array<{ id: string; data: UpdateExpenseDTO }>,
): Promise<{
  updated: number;
  failed: number;
  results: Array<{ success: boolean; data?: ExpenseResponseDTO; error?: string; id: string }>;
}> => {
  const results: Array<{
    success: boolean;
    data?: ExpenseResponseDTO;
    error?: string;
    id: string;
  }> = [];

  for (const update of updates) {
    try {
      const expense = await updateExpenseService(update.id, userId, update.data);
      results.push({ success: true, data: expense, id: update.id });
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      results.push({ success: false, error: errorMsg, id: update.id });
    }
  }

  const updated = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return { updated, failed, results };
};

export const bulkDeleteExpensesService = async (
  userId: string,
  ids: string[],
): Promise<{
  deleted: number;
  failed: number;
  results: Array<{ success: boolean; error?: string; id: string }>;
}> => {
  const results: Array<{ success: boolean; error?: string; id: string }> = [];

  for (const id of ids) {
    try {
      await softDeleteExpenseService(id, userId);
      results.push({ success: true, id });
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      results.push({ success: false, error: errorMsg, id });
    }
  }

  const deleted = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return { deleted, failed, results };
};
