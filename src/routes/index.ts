import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import expenseRoutes from "./expense.routes";
import analyticsRoutes from "./analytics.routes";
import exportRoutes from "./export.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/expense", expenseRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/export", exportRoutes);

export default router;


