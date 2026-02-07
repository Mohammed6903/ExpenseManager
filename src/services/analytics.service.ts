import { Expense } from "../models/expense.model";
import { AppError } from "../errors/AppError";
import { BadRequestError } from "../errors/BadRequestError";
import { Error as MongooseError } from "mongoose";

interface TimeSummary {
    totalSpent: number;
    currency: string;
    count: number;
    averagePerExpense: number;
}

interface CategoryDistribution {
    category: string;
    totalSpent: number;
    count: number;
    percentage: number;
}

interface MonthlyComparison {
    currentMonth: TimeSummary;
    previousMonth: TimeSummary;
    delta: number;
    deltaPercentage: number;
    trend: "increasing" | "decreasing" | "stable";
}

interface BehavioralInsights {
    highestExpense: { amount: number; category: string; date: Date } | null;
    mostFrequentCategory: { category: string; count: number } | null;
    zeroSpendDays: number;
    averageSpendPerDay: number;
    spendingSpikes: Array<{ date: Date; amount: number }>;
}

interface MonthlyInsights {
    totalSpent: number;
    topCategories: Array<{ category: string; amount: number }>;
    comparisonToPrevious: { delta: number; deltaPercentage: number };
    averagePerDay: number;
    highestExpense: { amount: number; category: string; date: Date } | null;
    trend: "increasing" | "decreasing" | "stable";
}

export const getDailySummary = async (
    userId: string,
    date: Date,
): Promise<TimeSummary> => {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const expenses = await Expense.find({
            userId,
            expenseDate: { $gte: startOfDay, $lte: endOfDay },
            deletedAt: null,
        });

        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const currency = expenses[0]?.currencyType || "INR";

        return {
            totalSpent,
            currency,
            count: expenses.length,
            averagePerExpense: expenses.length > 0 ? totalSpent / expenses.length : 0,
        };
    } catch (error: unknown) {
        if (error instanceof MongooseError) {
            throw new BadRequestError(error.message);
        }
        throw new AppError("Error fetching daily summary", 500);
    }
};

export const getWeeklySummary = async (
    userId: string,
    startDate: Date,
): Promise<TimeSummary> => {
    try {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);

        const expenses = await Expense.find({
            userId,
            expenseDate: { $gte: startDate, $lte: endDate },
            deletedAt: null,
        });

        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const currency = expenses[0]?.currencyType || "INR";

        return {
            totalSpent,
            currency,
            count: expenses.length,
            averagePerExpense: expenses.length > 0 ? totalSpent / expenses.length : 0,
        };
    } catch (error: unknown) {
        if (error instanceof MongooseError) {
            throw new BadRequestError(error.message);
        }
        throw new AppError("Error fetching weekly summary", 500);
    }
};

export const getMonthlySummary = async (
    userId: string,
    year: number,
    month: number,
): Promise<TimeSummary> => {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const expenses = await Expense.find({
            userId,
            expenseDate: { $gte: startDate, $lte: endDate },
            deletedAt: null,
        });

        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const currency = expenses[0]?.currencyType || "INR";

        return {
            totalSpent,
            currency,
            count: expenses.length,
            averagePerExpense: expenses.length > 0 ? totalSpent / expenses.length : 0,
        };
    } catch (error: unknown) {
        if (error instanceof MongooseError) {
            throw new BadRequestError(error.message);
        }
        throw new AppError("Error fetching monthly summary", 500);
    }
};

export const getRollingAverages = async (
    userId: string,
    days: number,
): Promise<{ rollingAverage: number; totalSpent: number; currency: string }> => {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const expenses = await Expense.find({
            userId,
            expenseDate: { $gte: startDate, $lte: endDate },
            deletedAt: null,
        });

        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const currency = expenses[0]?.currencyType || "INR";

        return {
            rollingAverage: totalSpent / days,
            totalSpent,
            currency,
        };
    } catch (error: unknown) {
        if (error instanceof MongooseError) {
            throw new BadRequestError(error.message);
        }
        throw new AppError("Error fetching rolling averages", 500);
    }
};

export const getMonthComparison = async (
    userId: string,
    currentYear: number,
    currentMonth: number,
): Promise<MonthlyComparison> => {
    try {
        const current = await getMonthlySummary(userId, currentYear, currentMonth);

        let prevYear = currentYear;
        let prevMonth = currentMonth - 1;
        if (prevMonth === 0) {
            prevMonth = 12;
            prevYear -= 1;
        }

        const previous = await getMonthlySummary(userId, prevYear, prevMonth);

        const delta = current.totalSpent - previous.totalSpent;
        const deltaPercentage =
            previous.totalSpent > 0 ? (delta / previous.totalSpent) * 100 : 0;

        let trend: "increasing" | "decreasing" | "stable" = "stable";
        if (Math.abs(deltaPercentage) > 5) {
            trend = deltaPercentage > 0 ? "increasing" : "decreasing";
        }

        return {
            currentMonth: current,
            previousMonth: previous,
            delta,
            deltaPercentage,
            trend,
        };
    } catch (error: unknown) {
        if (error instanceof MongooseError) {
            throw new BadRequestError(error.message);
        }
        throw new AppError("Error fetching month comparison", 500);
    }
};

export const getCategoryDistribution = async (
    userId: string,
    startDate: Date,
    endDate: Date,
): Promise<CategoryDistribution[]> => {
    try {
        const expenses = await Expense.find({
            userId,
            expenseDate: { $gte: startDate, $lte: endDate },
            deletedAt: null,
        });

        const categoryMap = new Map<string, { totalSpent: number; count: number }>();

        expenses.forEach((exp) => {
            const existing = categoryMap.get(exp.category) || { totalSpent: 0, count: 0 };
            categoryMap.set(exp.category, {
                totalSpent: existing.totalSpent + exp.amount,
                count: existing.count + 1,
            });
        });

        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        const distribution: CategoryDistribution[] = [];
        categoryMap.forEach((value, category) => {
            distribution.push({
                category,
                totalSpent: value.totalSpent,
                count: value.count,
                percentage: totalSpent > 0 ? (value.totalSpent / totalSpent) * 100 : 0,
            });
        });

        return distribution.sort((a, b) => b.totalSpent - a.totalSpent);
    } catch (error: unknown) {
        if (error instanceof MongooseError) {
            throw new BadRequestError(error.message);
        }
        throw new AppError("Error fetching category distribution", 500);
    }
};

export const getTopCategories = async (
    userId: string,
    startDate: Date,
    endDate: Date,
    limit: number = 5,
): Promise<Array<{ category: string; amount: number; count: number }>> => {
    try {
        const distribution = await getCategoryDistribution(userId, startDate, endDate);
        return distribution.slice(0, limit).map((d) => ({
            category: d.category,
            amount: d.totalSpent,
            count: d.count,
        }));
    } catch (error: unknown) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Error fetching top categories", 500);
    }
};

export const getCategoryTrend = async (
    userId: string,
    category: string,
    months: number,
): Promise<Array<{ month: string; amount: number; count: number }>> => {
    try {
        const trends: Array<{ month: string; amount: number; count: number }> = [];

        for (let i = 0; i < months; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);

            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);

            const expenses = await Expense.find({
                userId,
                category,
                expenseDate: { $gte: startDate, $lte: endDate },
                deletedAt: null,
            });

            const amount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

            trends.unshift({
                month: `${year}-${String(month).padStart(2, "0")}`,
                amount,
                count: expenses.length,
            });
        }

        return trends;
    } catch (error: unknown) {
        if (error instanceof MongooseError) {
            throw new BadRequestError(error.message);
        }
        throw new AppError("Error fetching category trend", 500);
    }
};

export const getBehavioralInsights = async (
    userId: string,
    startDate: Date,
    endDate: Date,
): Promise<BehavioralInsights> => {
    try {
        const expenses = await Expense.find({
            userId,
            expenseDate: { $gte: startDate, $lte: endDate },
            deletedAt: null,
        }).sort({ amount: -1 });

        const highestExpense = expenses[0]
            ? {
                amount: expenses[0].amount,
                category: expenses[0].category,
                date: expenses[0].expenseDate,
            }
            : null;

        const categoryFreq = new Map<string, number>();
        expenses.forEach((exp) => {
            categoryFreq.set(exp.category, (categoryFreq.get(exp.category) || 0) + 1);
        });

        let mostFrequentCategory: { category: string; count: number } | null = null;
        let maxCount = 0;
        categoryFreq.forEach((count, category) => {
            if (count > maxCount) {
                maxCount = count;
                mostFrequentCategory = { category, count };
            }
        });

        const expenseDates = new Set(
            expenses.map((exp) => exp.expenseDate.toISOString().split("T")[0]),
        );
        const totalDays =
            Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const zeroSpendDays = totalDays - expenseDates.size;

        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const averageSpendPerDay = expenses.length > 0 ? totalSpent / expenseDates.size : 0;

        const avgAmount = expenses.length > 0 ? totalSpent / expenses.length : 0;
        const threshold = avgAmount * 2;

        const spendingSpikes = expenses
            .filter((exp) => exp.amount > threshold)
            .map((exp) => ({
                date: exp.expenseDate,
                amount: exp.amount,
            }))
            .slice(0, 10);

        return {
            highestExpense,
            mostFrequentCategory,
            zeroSpendDays,
            averageSpendPerDay,
            spendingSpikes,
        };
    } catch (error: unknown) {
        if (error instanceof MongooseError) {
            throw new BadRequestError(error.message);
        }
        throw new AppError("Error fetching behavioral insights", 500);
    }
};

export const getMonthlyInsights = async (
    userId: string,
    year: number,
    month: number,
): Promise<MonthlyInsights> => {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const [monthlySummary, comparison, topCats, behavioral] = await Promise.all([
            getMonthlySummary(userId, year, month),
            getMonthComparison(userId, year, month),
            getTopCategories(userId, startDate, endDate, 3),
            getBehavioralInsights(userId, startDate, endDate),
        ]);

        const daysInMonth = new Date(year, month, 0).getDate();

        return {
            totalSpent: monthlySummary.totalSpent,
            topCategories: topCats,
            comparisonToPrevious: {
                delta: comparison.delta,
                deltaPercentage: comparison.deltaPercentage,
            },
            averagePerDay: monthlySummary.totalSpent / daysInMonth,
            highestExpense: behavioral.highestExpense,
            trend: comparison.trend,
        };
    } catch (error: unknown) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Error fetching monthly insights", 500);
    }
};
