import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { sendResponse } from "../utils/send-response";
import * as analyticsService from "../services/analytics.service";

export const getDailySummaryController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.userId!;
        const { date } = req.query;

        const targetDate = date ? new Date(date as string) : new Date();
        const summary = await analyticsService.getDailySummary(userId, targetDate);

        sendResponse(res, 200, summary, "Daily summary fetched successfully");
    } catch (error) {
        next(error);
    }
};

export const getWeeklySummaryController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.userId!;
        const { startDate } = req.query;

        const start = startDate ? new Date(startDate as string) : new Date();
        const summary = await analyticsService.getWeeklySummary(userId, start);

        sendResponse(res, 200, summary, "Weekly summary fetched successfully");
    } catch (error) {
        next(error);
    }
};

export const getMonthlySummaryController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.userId!;
        const { year, month } = req.query;

        const targetYear = year ? parseInt(year as string) : new Date().getFullYear();
        const targetMonth = month ? parseInt(month as string) : new Date().getMonth() + 1;

        const summary = await analyticsService.getMonthlySummary(userId, targetYear, targetMonth);

        sendResponse(res, 200, summary, "Monthly summary fetched successfully");
    } catch (error) {
        next(error);
    }
};

export const getRollingAveragesController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.userId!;
        const { days } = req.params;

        const numDays = parseInt(days);
        const avg = await analyticsService.getRollingAverages(userId, numDays);

        sendResponse(res, 200, avg, `${numDays}-day rolling average fetched successfully`);
    } catch (error) {
        next(error);
    }
};

export const getMonthComparisonController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.userId!;
        const { year, month } = req.query;

        const targetYear = year ? parseInt(year as string) : new Date().getFullYear();
        const targetMonth = month ? parseInt(month as string) : new Date().getMonth() + 1;

        const comparison = await analyticsService.getMonthComparison(userId, targetYear, targetMonth);

        sendResponse(res, 200, comparison, "Month comparison fetched successfully");
    } catch (error) {
        next(error);
    }
};

export const getCategoryDistributionController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.userId!;
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const end = endDate ? new Date(endDate as string) : new Date();

        const distribution = await analyticsService.getCategoryDistribution(userId, start, end);

        sendResponse(res, 200, distribution, "Category distribution fetched successfully");
    } catch (error) {
        next(error);
    }
};

export const getTopCategoriesController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.userId!;
        const { startDate, endDate, limit } = req.query;

        const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const end = endDate ? new Date(endDate as string) : new Date();
        const topLimit = limit ? parseInt(limit as string) : 5;

        const topCats = await analyticsService.getTopCategories(userId, start, end, topLimit);

        sendResponse(res, 200, topCats, "Top categories fetched successfully");
    } catch (error) {
        next(error);
    }
};

export const getCategoryTrendController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.userId!;
        const { category } = req.params;
        const { months } = req.query;

        const numMonths = months ? parseInt(months as string) : 6;
        const trend = await analyticsService.getCategoryTrend(userId, category, numMonths);

        sendResponse(res, 200, trend, "Category trend fetched successfully");
    } catch (error) {
        next(error);
    }
};

export const getBehavioralInsightsController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.userId!;
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const end = endDate ? new Date(endDate as string) : new Date();

        const insights = await analyticsService.getBehavioralInsights(userId, start, end);

        sendResponse(res, 200, insights, "Behavioral insights fetched successfully");
    } catch (error) {
        next(error);
    }
};

export const getMonthlyInsightsController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.userId!;
        const { year, month } = req.query;

        const targetYear = year ? parseInt(year as string) : new Date().getFullYear();
        const targetMonth = month ? parseInt(month as string) : new Date().getMonth() + 1;

        const insights = await analyticsService.getMonthlyInsights(userId, targetYear, targetMonth);

        sendResponse(res, 200, insights, "Monthly insights fetched successfully");
    } catch (error) {
        next(error);
    }
};
