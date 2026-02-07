import z from "zod";

export const ExportOptionsSchema = z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    categories: z.union([z.string(), z.array(z.string())]).optional(),
    includeDeleted: z.boolean().optional(),
});

export type ExportOptionsDTO = z.infer<typeof ExportOptionsSchema>;
