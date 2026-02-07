import z from "zod";

export const QueryExpensesSchema = z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    minAmount: z.coerce.number().positive().optional(),
    maxAmount: z.coerce.number().positive().optional(),
    categories: z.array(z.string()).or(z.string()).optional(),
    tags: z.array(z.string()).or(z.string()).optional(),
    paymentMethods: z.array(z.string()).or(z.string()).optional(),
    searchText: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(50),
    sortBy: z.enum(["expenseDate", "amount", "category", "createdAt"]).default("expenseDate"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type QueryExpensesDTO = z.infer<typeof QueryExpensesSchema>;
