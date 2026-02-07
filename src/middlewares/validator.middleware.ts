import { Schema } from "zod";
import { NextFunction, Request, Response } from "express";

export const validate =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: result.error.issues,
      });
      return;
    }
    req.body = result.data;
    next();
  };

