import z from "zod";

const BulkExpenseItemSchema = z.object({
    amount: z.number().positive(),
    currencyType: z.string().length(3).default("INR"),
    category: z.string().min(1),
    subCategory: z.string().optional(),
    description: z.string().optional(),
    note: z.string().optional(),
    paymentMethod: z.enum(["cash", "card", "upi", "bank_transfer", "other"]).default("cash"),
    tags: z.array(z.string()).optional(),
    isRecurring: z.boolean().default(false),
    expenseDate: z.string().datetime(),
});

export const BulkCreateExpensesSchema = z.object({
    expenses: z.array(BulkExpenseItemSchema).min(1).max(100),
});

export type BulkCreateExpensesDTO = z.infer<typeof BulkCreateExpensesSchema>;

const BulkUpdateItemSchema = z.object({
    id: z.string().min(1),
    amount: z.number().positive().optional(),
    currencyType: z.string().length(3).optional(),
    category: z.string().min(1).optional(),
    subCategory: z.string().optional(),
    description: z.string().optional(),
    note: z.string().optional(),
    paymentMethod: z.enum(["cash", "card", "upi", "bank_transfer", "other"]).optional(),
    tags: z.array(z.string()).optional(),
    isRecurring: z.boolean().optional(),
    expenseDate: z.string().datetime().optional(),
});

export const BulkUpdateExpensesSchema = z.object({
    updates: z.array(BulkUpdateItemSchema).min(1).max(100),
});

export type BulkUpdateExpensesDTO = z.infer<typeof BulkUpdateExpensesSchema>;

export const BulkDeleteExpensesSchema = z.object({
    ids: z.array(z.string()).min(1).max(100),
});

export type BulkDeleteExpensesDTO = z.infer<typeof BulkDeleteExpensesSchema>;
