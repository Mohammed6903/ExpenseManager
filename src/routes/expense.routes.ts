import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validator.middleware";
import {
    createExpenseController,
    getAllExpensesController,
    getExpenseByIdController,
    updateExpenseController,
    deleteExpenseController,
    searchExpensesController,
    bulkCreateExpensesController,
    bulkUpdateExpensesController,
    bulkDeleteExpensesController,
} from "../controllers/expense.controller";
import { CreateExpenseSchema } from "../validators/expense/CreateExpense.schema";
import { UpdateExpenseSchema } from "../validators/expense/UpdateExpense.schema";
import { QueryExpensesSchema } from "../validators/expense/QueryExpenses.schema";
import { BulkCreateExpensesSchema, BulkUpdateExpensesSchema, BulkDeleteExpensesSchema } from "../validators/expense/BulkOperations.schema";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(CreateExpenseSchema), createExpenseController);
router.get("/", getAllExpensesController);
router.get("/search", validate(QueryExpensesSchema), searchExpensesController);
router.get("/:id", getExpenseByIdController);
router.put("/:id", validate(UpdateExpenseSchema), updateExpenseController);
router.delete("/:id", deleteExpenseController);

router.post("/bulk/create", validate(BulkCreateExpensesSchema), bulkCreateExpensesController);
router.put("/bulk/update", validate(BulkUpdateExpensesSchema), bulkUpdateExpensesController);
router.post("/bulk/delete", validate(BulkDeleteExpensesSchema), bulkDeleteExpensesController);

export default router;

