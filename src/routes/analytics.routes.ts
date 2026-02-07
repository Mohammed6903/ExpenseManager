import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
    getDailySummaryController,
    getWeeklySummaryController,
    getMonthlySummaryController,
    getRollingAveragesController,
    getMonthComparisonController,
    getCategoryDistributionController,
    getTopCategoriesController,
    getCategoryTrendController,
    getBehavioralInsightsController,
    getMonthlyInsightsController,
} from "../controllers/analytics.controller";

const router = Router();

router.use(authMiddleware);

router.get("/summary/daily", getDailySummaryController);
router.get("/summary/weekly", getWeeklySummaryController);
router.get("/summary/monthly", getMonthlySummaryController);
router.get("/summary/rolling/:days", getRollingAveragesController);
router.get("/summary/comparison", getMonthComparisonController);

router.get("/category/distribution", getCategoryDistributionController);
router.get("/category/top", getTopCategoriesController);
router.get("/category/trend/:category", getCategoryTrendController);

router.get("/insights/behavioral", getBehavioralInsightsController);
router.get("/insights/monthly", getMonthlyInsightsController);

export default router;
