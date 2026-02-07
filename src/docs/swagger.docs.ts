/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - email
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: SecurePass123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 *
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 *
 * /user/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *
 * /user/preferences:
 *   get:
 *     summary: Get user preferences
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Preferences retrieved successfully
 *   put:
 *     summary: Update user preferences
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currency:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 3
 *                 example: USD
 *               timezone:
 *                 type: string
 *                 example: America/New_York
 *               weekStartDay:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 example: 1
 *               monthStartDay:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 31
 *                 example: 25
 *               monthStartType:
 *                 type: string
 *                 enum: [calendar, salary]
 *                 example: salary
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *
 * /user/account:
 *   delete:
 *     summary: Delete user account (soft delete)
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *
 * /expense:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - category
 *               - expenseDate
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 500
 *               currencyType:
 *                 type: string
 *                 default: INR
 *                 example: INR
 *               category:
 *                 type: string
 *                 example: Food
 *               subCategory:
 *                 type: string
 *                 example: Lunch
 *               description:
 *                 type: string
 *                 example: Team lunch at restaurant
 *               note:
 *                 type: string
 *                 example: Paid by card
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, upi, bank_transfer, other]
 *                 default: cash
 *                 example: card
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [work, meal]
 *               isRecurring:
 *                 type: boolean
 *                 default: false
 *               expenseDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Expense created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Validation error or duplicate detected
 *   get:
 *     summary: Get all expenses for current user
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: Expenses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Expense'
 *
 * /expense/{id}:
 *   get:
 *     summary: Get expense by ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense retrieved successfully
 *       404:
 *         description: Expense not found
 *   put:
 *     summary: Update expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *   delete:
 *     summary: Delete expense (soft delete)
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *
 * /expense/search:
 *   get:
 *     summary: Search and filter expenses
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: minAmount
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxAmount
 *         schema:
 *           type: number
 *       - in: query
 *         name: categories
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: paymentMethods
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           maximum: 100
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [expenseDate, amount, category, createdAt]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     expenses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Expense'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *
 * /expense/bulk/create:
 *   post:
 *     summary: Bulk create expenses
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expenses:
 *                 type: array
 *                 maxItems: 100
 *                 items:
 *                   type: object
 *                   required:
 *                     - amount
 *                     - category
 *                     - expenseDate
 *     responses:
 *       201:
 *         description: Bulk creation completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 created:
 *                   type: integer
 *                 failed:
 *                   type: integer
 *                 results:
 *                   type: array
 *
 * /expense/bulk/update:
 *   put:
 *     summary: Bulk update expenses
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updates:
 *                 type: array
 *                 maxItems: 100
 *     responses:
 *       200:
 *         description: Bulk update completed
 *
 * /expense/bulk/delete:
 *   post:
 *     summary: Bulk delete expenses
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 maxItems: 100
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Bulk delete completed
 *
 * /analytics/summary/daily:
 *   get:
 *     summary: Get daily spending summary
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Daily summary retrieved
 *
 * /analytics/summary/monthly:
 *   get:
 *     summary: Get monthly spending summary
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *     responses:
 *       200:
 *         description: Monthly summary retrieved
 *
 * /analytics/summary/comparison:
 *   get:
 *     summary: Compare current month to previous month
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comparison data retrieved
 *
 * /analytics/category/distribution:
 *   get:
 *     summary: Get category-wise spending distribution
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Category distribution retrieved
 *
 * /analytics/insights/behavioral:
 *   get:
 *     summary: Get behavioral spending insights
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Behavioral insights retrieved
 *
 * /analytics/insights/monthly:
 *   get:
 *     summary: Get comprehensive monthly insights
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Monthly insights retrieved
 *
 * /export/json:
 *   get:
 *     summary: Export expenses as JSON
 *     tags: [Export]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: categories
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: JSON file download
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 * /export/csv:
 *   get:
 *     summary: Export expenses as CSV
 *     tags: [Export]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: categories
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */

// This file contains Swagger/OpenAPI documentation for all API endpoints
// Documentation is processed by swagger-jsdoc and served via swagger-ui-express
export { };
