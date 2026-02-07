import { NextFunction, Request, Response } from "express";
import {
  createExpenseService,
  getAllExpensesService,
  getExpenseByIdService,
  updateExpenseService,
  softDeleteExpenseService,
  searchExpensesService,
  bulkCreateExpensesService,
  bulkUpdateExpensesService,
  bulkDeleteExpensesService,
} from "../services/expense.service";
import { CreateExpenseDTO } from "../validators/expense/CreateExpense.schema";
import { UpdateExpenseDTO } from "../validators/expense/UpdateExpense.schema";
import { QueryExpensesDTO } from "../validators/expense/QueryExpenses.schema";
import { BulkCreateExpensesDTO, BulkUpdateExpensesDTO, BulkDeleteExpensesDTO } from "../validators/expense/BulkOperations.schema";
import { sendResponse } from "../utils/send-response";
import { AuthRequest } from "../types/AuthRequest";

export const createExpenseController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const data: CreateExpenseDTO = { ...req.body, userId };
    const expense = await createExpenseService(data);
    sendResponse(res, 201, expense, "Expense created successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllExpensesController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const expenses = await getAllExpensesService(userId);
    sendResponse(res, 200, expenses, "Expenses fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const getExpenseByIdController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const expense = await getExpenseByIdService(id, userId);
    sendResponse(res, 200, expense, "Expense fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const updateExpenseController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const data: UpdateExpenseDTO = req.body;
    const expense = await updateExpenseService(id, userId, data);
    sendResponse(res, 200, expense, "Expense updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteExpenseController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    await softDeleteExpenseService(id, userId);
    sendResponse(res, 200, null, "Expense deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const searchExpensesController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const query: QueryExpensesDTO = req.query as unknown as QueryExpensesDTO;
    const result = await searchExpensesService(userId, query);
    sendResponse(res, 200, result, "Expenses searched successfully");
  } catch (error) {
    next(error);
  }
};

export const bulkCreateExpensesController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { expenses }: BulkCreateExpensesDTO = req.body;

    const transformedExpenses = expenses.map((exp) => ({
      ...exp,
      expenseDate: new Date(exp.expenseDate),
      tags: exp.tags || [],
    }));

    const result = await bulkCreateExpensesService(userId, transformedExpenses);
    sendResponse(res, 201, result, `Bulk create completed: ${result.created} created, ${result.failed} failed`);
  } catch (error) {
    next(error);
  }
};

export const bulkUpdateExpensesController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { updates }: BulkUpdateExpensesDTO = req.body;

    const updateData = updates.map((u) => ({
      id: u.id,
      data: {
        amount: u.amount,
        currencyType: u.currencyType,
        category: u.category,
        subCategory: u.subCategory,
        description: u.description,
        note: u.note,
        paymentMethod: u.paymentMethod,
        tags: u.tags,
        isRecurring: u.isRecurring,
        expenseDate: u.expenseDate ? new Date(u.expenseDate) : undefined,
      },
    }));

    const result = await bulkUpdateExpensesService(userId, updateData);
    sendResponse(res, 200, result, `Bulk update completed: ${result.updated} updated, ${result.failed} failed`);
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteExpensesController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { ids }: BulkDeleteExpensesDTO = req.body;
    const result = await bulkDeleteExpensesService(userId, ids);
    sendResponse(res, 200, result, `Bulk delete completed: ${result.deleted} deleted, ${result.failed} failed`);
  } catch (error) {
    next(error);
  }
};

