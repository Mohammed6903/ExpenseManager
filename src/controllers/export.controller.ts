import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { exportExpensesAsJSON, exportExpensesAsCSV } from "../services/export.service";
import { ExportOptionsDTO } from "../validators/export/ExportOptions.schema";

export const exportJSONController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.userId!;
        const options: ExportOptionsDTO = req.query as unknown as ExportOptionsDTO;

        const exportOptions = {
            startDate: options.startDate ? new Date(options.startDate) : undefined,
            endDate: options.endDate ? new Date(options.endDate) : undefined,
            categories: options.categories
                ? Array.isArray(options.categories)
                    ? options.categories
                    : [options.categories]
                : undefined,
            includeDeleted: options.includeDeleted === true,
        };

        const jsonData = await exportExpensesAsJSON(userId, exportOptions);

        const filename = `expenses_export_${new Date().toISOString().split("T")[0]}.json`;

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.send(jsonData);
    } catch (error) {
        next(error);
    }
};

export const exportCSVController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.userId!;
        const options: ExportOptionsDTO = req.query as unknown as ExportOptionsDTO;

        const exportOptions = {
            startDate: options.startDate ? new Date(options.startDate) : undefined,
            endDate: options.endDate ? new Date(options.endDate) : undefined,
            categories: options.categories
                ? Array.isArray(options.categories)
                    ? options.categories
                    : [options.categories]
                : undefined,
            includeDeleted: options.includeDeleted === true,
        };

        const csvData = await exportExpensesAsCSV(userId, exportOptions);

        const filename = `expenses_export_${new Date().toISOString().split("T")[0]}.csv`;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.send(csvData);
    } catch (error) {
        next(error);
    }
};
