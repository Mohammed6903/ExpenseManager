# Personal Finance Tracker - Production Backend

A production-ready Node.js + Express + TypeScript backend for personal expense tracking and financial analytics.

## Features

### 🔐 Authentication & Security
- JWT-based authentication with access & refresh tokens
- Token rotation for enhanced security
- Secure logout functionality
- Account status management (active, suspended, deleted)
- Password hashing with bcrypt

### 💰 Expense Management
- Comprehensive expense tracking with:
  - Amount, currency, category, subcategory
  - Payment method (cash, card, UPI, bank transfer)
  - Tags for flexible organization  
  - Recurring expense marking
  - Description and notes
  - Separate expense date vs entry date
- Soft delete support - never lose data
- Duplicate detection (1-minute window)
- Ownership enforcement
- Advanced search & filtering with pagination

### 📊 Analytics & Insights
- **Time-based summaries:**
  - Daily, weekly, monthly totals
  - Rolling 7/30/90 day averages
  - Month-over-month comparisons

- **Category insights:**
  - Category distribution with percentages
  - Top spending categories
  - Category trend analysis over time

- **Behavioral signals:**
  - Highest single expense
  - Most frequent category
  - Zero-spend days tracking
  - Average spend per day
  - Spending spike detection

- **Smart aggregations:**
  - Comprehensive monthly insights
  - Spending trend indicators

### 👤 User Management
- User profile management
- Customizable preferences:
  - Currency (default: INR)
  - Timezone (default: Asia/Kolkata)
  - Week start day
  - Month start day and type (calendar vs salary cycle)
- Account soft deletion

### 🛡️ Production-Ready
- TypeScript strict mode enabled
- Comprehensive error handling with error codes
- Machine-readable API responses
- Input validation with Zod
- MongoDB indexes for performance
- Environment-based configuration
- Structured logging

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript (strict mode)
- **Database:** MongoDB + Mongoose
- **Validation:** Zod
- **Authentication:** JWT + bcrypt
- **Security:** Helmet, CORS

## Installation

```bash
# Clone repository
cd learnExpress

# Install dependencies
npm install
```

## Configuration

Create `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

## API Documentation

Interactive Swagger/OpenAPI documentation available at:
```
http://localhost:3000/api-docs
```

The documentation includes:
- All 35+ API endpoints
- Request/response schemas
- Authentication requirements
- Interactive "Try it out" functionality
- Full OpenAPI 3.0 specification

## API Overview


### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "userName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  },
  "message": "User registered successfully"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "refreshToken": "..."
}
```

### Expenses

#### Create Expense
```http
POST /api/expense
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "amount": 500,
  "currencyType": "INR",
  "category": "Food",
  "subCategory": "Lunch",
  "description": "Team lunch",
  "paymentMethod": "card",
  "tags": ["work", "meal"],
  "isRecurring": false,
  "expenseDate": "2026-02-08T14:30:00Z"
}
```

#### Get All Expenses
```http
GET /api/expense
Authorization: Bearer <access-token>
```

#### Get Expense by ID
```http
GET /api/expense/:id
Authorization: Bearer <access-token>
```

#### Update Expense
```http
PUT /api/expense/:id
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "amount": 550,
  "note": "Updated amount"
}
```

#### Delete Expense (Soft Delete)
```http
DELETE /api/expense/:id
Authorization: Bearer <access-token>
```

#### Search & Filter
```http
GET /api/expense/search?startDate=2026-01-01&endDate=2026-02-28&categories=Food,Transport&minAmount=100&maxAmount=1000&page=1&limit=50
Authorization: Bearer <access-token>
```

#### Bulk Create Expenses
```http
POST /api/expense/bulk/create
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "expenses": [
    {
      "amount": 500,
      "category": "Food",
      "expenseDate": "2026-02-08T12:00:00Z"
    },
    {
      "amount": 300,
      "category": "Transport",
      "expenseDate": "2026-02-08T15:00:00Z"
    }
  ]
}

Response: {
  "created": 2,
  "failed": 0,
  "results": [...]
}
```

#### Bulk Update Expenses
```http
PUT /api/expense/bulk/update
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "updates": [
    {
      "id": "expense-id-1",
      "amount": 550,
      "note": "Updated"
    },
    {
      "id": "expense-id-2",
      "category": "Entertainment"
    }
  ]
}

Response: {
  "updated": 2,
  "failed": 0,
  "results": [...]
}
```

#### Bulk Delete Expenses
```http
POST /api/expense/bulk/delete
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "ids": ["expense-id-1", "expense-id-2", "expense-id-3"]
}

Response: {
  "deleted": 3,
  "failed": 0,
  "results": [...]
}
```

### Data Export

#### Export as JSON
```http
GET /api/export/json?startDate=2026-01-01&endDate=2026-02-28&categories=Food
Authorization: Bearer <access-token>

Response: JSON file download with complete expense data
```

#### Export as CSV
```http
GET /api/export/csv?startDate=2026-01-01&endDate=2026-02-28
Authorization: Bearer <access-token>

Response: CSV file download with expense data
```

### Analytics


#### Daily Summary
```http
GET /api/analytics/summary/daily?date=2026-02-08
Authorization: Bearer <access-token>
```

#### Weekly Summary
```http
GET /api/analytics/summary/weekly?startDate=2026-02-01
Authorization: Bearer <access-token>
```

#### Monthly Summary
```http
GET /api/analytics/summary/monthly?year=2026&month=2
Authorization: Bearer <access-token>
```

#### Rolling Averages
```http
GET /api/analytics/summary/rolling/30
Authorization: Bearer <access-token>
```

#### Month Comparison
```http
GET /api/analytics/summary/comparison?year=2026&month=2
Authorization: Bearer <access-token>
```

#### Category Distribution
```http
GET /api/analytics/category/distribution?startDate=2026-02-01&endDate=2026-02-28
Authorization: Bearer <access-token>
```

#### Top Categories
```http
GET /api/analytics/category/top?limit=5
Authorization: Bearer <access-token>
```

#### Category Trend
```http
GET /api/analytics/category/trend/Food?months=6
Authorization: Bearer <access-token>
```

#### Behavioral Insights
```http
GET /api/analytics/insights/behavioral?startDate=2026-02-01&endDate=2026-02-28
Authorization: Bearer <access-token>
```

#### Monthly Insights (Combined)
```http
GET /api/analytics/insights/monthly?year=2026&month=2
Authorization: Bearer <access-token>
```

### User Profile & Preferences

#### Get Profile
```http
GET /api/user/profile
Authorization: Bearer <access-token>
```

#### Update Profile
```http
PUT /api/user/profile
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "userName": "John Smith",
  "email": "johnsmith@example.com"
}
```

#### Get Preferences
```http
GET /api/user/preferences
Authorization: Bearer <access-token>
```

#### Update Preferences
```http
PUT /api/user/preferences
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "currency": "USD",
  "timezone": "America/New_York",
  "weekStartDay": 1,
  "monthStartDay": 1,
  "monthStartType": "salary"
}
```

#### Delete Account
```http
DELETE /api/user/account
Authorization: Bearer <access-token>
```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "code": "MACHINE_READABLE_ERROR_CODE",
  "errors": {},
  "stack": "... (development only)"
}
```

### Error Codes
- `AUTH_INVALID_CREDENTIALS` - Invalid email/password
- `AUTH_TOKEN_EXPIRED` - Access token expired
- `AUTH_TOKEN_INVALID` - Invalid token
- `USER_NOT_FOUND` - User doesn't exist
- `USER_ALREADY_EXISTS` - Email already registered
- `EXPENSE_NOT_FOUND` - Expense doesn't exist
- `EXPENSE_DUPLICATE_DETECTED` - Duplicate expense detected
- `EXPENSE_FORBIDDEN` - Not owner of expense
- `VALIDATION_FAILED` - Request validation failed
- `INTERNAL_SERVER_ERROR` - Server error

## Data Models

### User
- `email` - Unique email address
- `userName` - Display name
- `password` - Hashed password
- `accountStatus` - active | suspended | deleted
- `preferences` - User preferences object
- `deletedAt` - Soft delete timestamp
- `createdAt`, `updatedAt` - Timestamps

### Expense
- `userId` - Reference to user
- `amount` - Expense amount
- `currencyType` - Currency code (3 chars)
- `category` - Main category
- `subCategory` - Optional subcategory
- `description` - Detailed description
- `note` - Quick note
- `paymentMethod` - cash | card | upi | bank_transfer | other
- `tags` - Array of tags
- `isRecurring` - Boolean flag
- `expenseDate` - Date of actual expense
- `entryDate` - Date of database entry
- `deletedAt` - Soft delete timestamp
- `createdAt`, `updatedAt` - Timestamps

### Token (Refresh Tokens)
- `userId` - Reference to user
- `refreshToken` - Hashed token
- `accessTokenFamily` - Token rotation family ID
- `expiresAt` - Expiration timestamp
- `revokedAt` - Revocation timestamp

## Performance Optimizations

- **Database Indexes:**
  - User: `email`, `accountStatus`
  - Expense: `userId + expenseDate`, `userId + category`, `userId + deletedAt`, `category`, `paymentMethod`
  - Token: `userId + expiresAt`, `accessTokenFamily`

## Security Features

1. **Password Security:** bcrypt hashing with salt rounds
2. **Token Rotation:** Refresh tokens rotated on each use
3. **Token Revocation:** Logout revokes entire token family
4. **Account Status:** Suspended/deleted accounts cannot login
5. **Ownership Enforcement:** Users can only access their own data
6. **Input Validation:** All requests validated with Zod
7. **CORS:** Configured for specific client origins
8. **Helmet:** Security headers configured

## Development Principles

This backend follows these principles:
- ✅ **Production-ready:** Real personal use, not a demo
- ✅ **Type-safe:** TypeScript strict mode enabled
- ✅ **Maintainable:** Clear separation of concerns
- ✅ **Secure:** Industry-standard security practices
- ✅ **User-focused:** Designed for actual personal finance tracking
- ✅ **Data integrity:** Soft deletes, duplicate prevention
- ✅ **Analytics-driven:** Deep insights into spending habits

## Future Enhancements

Potential additions:
- Data export (JSON/CSV)
- Budget tracking and alerts
- Recurring expense automation
- Multi-currency support with conversion
- Receipt image uploads
- Spending predictions
- Shared expenses for families
- Mobile app integration
- Notification system

## License

ISC
