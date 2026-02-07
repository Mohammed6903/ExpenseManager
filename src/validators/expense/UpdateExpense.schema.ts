import z from "zod";

export const UpdateExpenseSchema = z.object({
    amount: z.number().positive({ message: "Amount must be positive" }).optional(),
    currencyType: z.string().length(3, { message: "Invalid currency type" }).optional(),
    category: z.string().min(1, { message: "Category cannot be empty" }).optional(),
    subCategory: z.string().optional(),
    description: z.string().optional(),
    note: z.string().optional(),
    paymentMethod: z.enum(["cash", "card", "upi", "bank_transfer", "other"]).optional(),
    tags: z.array(z.string()).optional(),
    isRecurring: z.boolean().optional(),
    expenseDate: z.coerce.date().optional(),
});

export type UpdateExpenseDTO = z.infer<typeof UpdateExpenseSchema>;
