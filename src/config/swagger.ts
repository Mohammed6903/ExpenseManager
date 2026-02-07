import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Personal Finance Tracker API",
            version: "1.0.0",
            description: "Production-ready API for personal expense tracking and financial analytics",
            contact: {
                name: "API Support",
            },
        },
        servers: [
            {
                url: "http://localhost:3000/api",
                description: "Development server",
            },
            {
                url: "https://api.example.com/api",
                description: "Production server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT access token",
                },
            },
            schemas: {
                Error: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false,
                        },
                        message: {
                            type: "string",
                            example: "Error message",
                        },
                        code: {
                            type: "string",
                            example: "ERROR_CODE",
                        },
                        errors: {
                            type: "object",
                        },
                    },
                },
                User: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "507f1f77bcf86cd799439011",
                        },
                        userName: {
                            type: "string",
                            example: "John Doe",
                        },
                        email: {
                            type: "string",
                            example: "john@example.com",
                        },
                        accountStatus: {
                            type: "string",
                            enum: ["active", "suspended", "deleted"],
                            example: "active",
                        },
                        preferences: {
                            type: "object",
                            properties: {
                                currency: {
                                    type: "string",
                                    example: "INR",
                                },
                                timezone: {
                                    type: "string",
                                    example: "Asia/Kolkata",
                                },
                                weekStartDay: {
                                    type: "number",
                                    example: 0,
                                },
                                monthStartDay: {
                                    type: "number",
                                    example: 1,
                                },
                                monthStartType: {
                                    type: "string",
                                    enum: ["calendar", "salary"],
                                    example: "calendar",
                                },
                            },
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                Expense: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "507f1f77bcf86cd799439011",
                        },
                        userId: {
                            type: "string",
                            example: "507f191e810c19729de860ea",
                        },
                        amount: {
                            type: "number",
                            example: 500,
                        },
                        currencyType: {
                            type: "string",
                            example: "INR",
                        },
                        category: {
                            type: "string",
                            example: "Food",
                        },
                        subCategory: {
                            type: "string",
                            example: "Lunch",
                        },
                        description: {
                            type: "string",
                            example: "Team lunch at restaurant",
                        },
                        note: {
                            type: "string",
                            example: "Paid by card",
                        },
                        paymentMethod: {
                            type: "string",
                            enum: ["cash", "card", "upi", "bank_transfer", "other"],
                            example: "card",
                        },
                        tags: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            example: ["work", "meal"],
                        },
                        isRecurring: {
                            type: "boolean",
                            example: false,
                        },
                        expenseDate: {
                            type: "string",
                            format: "date-time",
                        },
                        entryDate: {
                            type: "string",
                            format: "date-time",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                        deletedAt: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        tags: [
            {
                name: "Authentication",
                description: "User authentication and authorization endpoints",
            },
            {
                name: "User",
                description: "User profile and preferences management",
            },
            {
                name: "Expenses",
                description: "Expense CRUD operations and search",
            },
            {
                name: "Analytics",
                description: "Financial analytics and insights",
            },
            {
                name: "Export",
                description: "Data export in JSON and CSV formats",
            },
        ],
    },
    apis: ["./src/docs/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
