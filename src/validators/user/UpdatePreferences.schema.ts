import z from "zod";

export const UpdatePreferencesSchema = z.object({
    currency: z.string().length(3).optional(),
    timezone: z.string().optional(),
    weekStartDay: z.number().int().min(0).max(6).optional(),
    monthStartDay: z.number().int().min(1).max(31).optional(),
    monthStartType: z.enum(["calendar", "salary"]).optional(),
});

export type UpdatePreferencesDTO = z.infer<typeof UpdatePreferencesSchema>;
