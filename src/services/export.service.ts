import { Expense } from "../models/expense.model";
import { NotFoundError } from "../errors/NotFoundError";
import { ErrorCode } from "../types/ErrorCode";

export interface ExportOptions {
    startDate?: Date;
    endDate?: Date;
    categories?: string[];
    includeDeleted?: boolean;
}

export const exportExpensesAsJSON = async (
    userId: string,
    options: ExportOptions = {},
): Promise<string> => {
    const filter: Record<string, unknown> = { userId };

    if (options.startDate || options.endDate) {
        filter.expenseDate = {};
        if (options.startDate) {
            (filter.expenseDate as Record<string, unknown>).$gte = options.startDate;
        }
        if (options.endDate) {
            (filter.expenseDate as Record<string, unknown>).$lte = options.endDate;
        }
    }

    if (options.categories && options.categories.length > 0) {
        filter.category = { $in: options.categories };
    }

    if (!options.includeDeleted) {
        filter.deletedAt = null;
    }

    const expenses = await Expense.find(filter).sort({ expenseDate: -1 }).lean();

    if (expenses.length === 0) {
        throw new NotFoundError("No expenses found to export", ErrorCode.EXPENSE_NOT_FOUND);
    }

    const exportData = {
        exportDate: new Date().toISOString(),
        totalExpenses: expenses.length,
        expenses: expenses.map((exp) => ({
            id: exp._id.toString(),
            amount: exp.amount,
            currency: exp.currencyType,
            category: exp.category,
            subCategory: exp.subCategory,
            description: exp.description,
            note: exp.note,
            paymentMethod: exp.paymentMethod,
            tags: exp.tags,
            isRecurring: exp.isRecurring,
            expenseDate: exp.expenseDate,
            entryDate: exp.entryDate,
            createdAt: exp.createdAt,
            updatedAt: exp.updatedAt,
            deletedAt: exp.deletedAt,
        })),
    };

    return JSON.stringify(exportData, null, 2);
};

export const exportExpensesAsCSV = async (
    userId: string,
    options: ExportOptions = {},
): Promise<string> => {
    const filter: Record<string, unknown> = { userId };

    if (options.startDate || options.endDate) {
        filter.expenseDate = {};
        if (options.startDate) {
            (filter.expenseDate as Record<string, unknown>).$gte = options.startDate;
        }
        if (options.endDate) {
            (filter.expenseDate as Record<string, unknown>).$lte = options.endDate;
        }
    }

    if (options.categories && options.categories.length > 0) {
        filter.category = { $in: options.categories };
    }

    if (!options.includeDeleted) {
        filter.deletedAt = null;
    }

    const expenses = await Expense.find(filter).sort({ expenseDate: -1 }).lean();

    if (expenses.length === 0) {
        throw new NotFoundError("No expenses found to export", ErrorCode.EXPENSE_NOT_FOUND);
    }

    const headers = [
        "ID",
        "Amount",
        "Currency",
        "Category",
        "SubCategory",
        "Description",
        "Note",
        "PaymentMethod",
        "Tags",
        "IsRecurring",
        "ExpenseDate",
        "EntryDate",
        "CreatedAt",
        "UpdatedAt",
        "DeletedAt",
    ];

    const escapeCSVField = (field: unknown): string => {
        if (field === null || field === undefined) return "";
        const str = String(field);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const rows = expenses.map((exp) => [
        escapeCSVField(exp._id.toString()),
        escapeCSVField(exp.amount),
        escapeCSVField(exp.currencyType),
        escapeCSVField(exp.category),
        escapeCSVField(exp.subCategory),
        escapeCSVField(exp.description),
        escapeCSVField(exp.note),
        escapeCSVField(exp.paymentMethod),
        escapeCSVField(exp.tags?.join("; ")),
        escapeCSVField(exp.isRecurring),
        escapeCSVField(exp.expenseDate?.toISOString()),
        escapeCSVField(exp.entryDate?.toISOString()),
        escapeCSVField(exp.createdAt?.toISOString()),
        escapeCSVField(exp.updatedAt?.toISOString()),
        escapeCSVField(exp.deletedAt?.toISOString()),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    return csvContent;
};
