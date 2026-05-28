# BudgetWise Project Architecture & Workflow

This document explains how the BudgetWise application is structured and how the frontend and backend connect. It is designed to help you answer questions about folder responsibilities, data flow, and metric calculations.

## High-level architecture

BudgetWise is split into two main applications:

1. `backend/` — REST API built with Express and Supabase.
2. `frontend/` — React UI built with Vite and Tailwind.

The frontend calls backend API routes to authenticate users and manage financial data.

## Backend architecture

### Folder structure

- `server.js` — entry point. Configures Express, global middleware, route registration, and error handling.
- `schema.sql` — database schema used to create tables for users, accounts, transactions, budgets, goals, and income sources.
- `src/config/`
  - `database.js` — initializes the Supabase client.
  - `env.js` — loads environment variables.
- `src/routes/` — maps HTTP routes to controllers.
- `src/controllers/` — receives requests from routes, calls services, and sends JSON responses.
- `src/services/` — contains business logic and coordinates repository access.
- `src/repositories/` — performs database operations only.
- `src/middleware/` — reusable middleware like authentication, validation, logging, and error handling.
- `src/schemas/` — request validation schemas for routes.
- `src/domain/` — pure application constants and helper functions.
- `src/utils/` — shared helper utilities.

### Request flow

1. Frontend sends an HTTP request to the backend.
2. A route in `src/routes/` receives the request.
3. Optional middleware validates the request and checks auth.
4. The route forwards to a controller in `src/controllers/`.
5. The controller calls a service in `src/services/`.
6. The service executes business logic and delegates database access to a repository in `src/repositories/`.
7. The repository calls Supabase and returns raw data.
8. The service transforms data and returns it to the controller.
9. The controller sends a JSON response back to the frontend.

### Key backend files

- `src/routes/authRoutes.js` — auth endpoints for register, login, and current user.
- `src/controllers/authController.js` — handles credential validation and token creation.
- `src/services/authService.js` — contains auth logic, hashing, JWT signing, and user verification.
- `src/repositories/userRepository.js` — user CRUD operations.

- `src/routes/transactionRoutes.js` — transaction CRUD and list filters.
- `src/controllers/transactionController.js` — validates transactions and sends responses.
- `src/services/transactionService.js` — creates, updates, deletes, and queries transaction records.
- `src/repositories/transactionRepository.js` — raw Supabase queries for transactions.

- `src/routes/budgetRoutes.js` — budget management endpoints.
- `src/services/budgetService.js` — business rules for budget planning.
- `src/repositories/budgetRepository.js` — budget queries.

- `src/routes/goalRoutes.js` — savings goal endpoints.
- `src/services/goalService.js` — goal balance and progress logic.
- `src/repositories/goalRepository.js` — goal data access.

- `src/routes/analyticsRoutes.js` — analytics endpoints.
- `src/services/analyticsService.js` — computes summary metrics, chart data, category totals, and score.
- `src/services/accountService.js` — account state and balance related logic.
- `src/repositories/accountRepository.js` — account read/write operations.

### Important backend workflow details

- **Auth middleware** in `src/middleware/authMiddleware.js` verifies JWT and attaches the user ID to requests.
- **Validation middleware** in `src/middleware/validateMiddleware.js` verifies payloads using schemas from `src/schemas/`.
- **Error middleware** centralizes HTTP error responses.
- The backend follows a strict separation of concerns:
  - Controllers handle request/response.
  - Services hold business rules.
  - Repositories perform database queries.

## Frontend architecture

### Folder structure

- `src/main.jsx` — React app bootstrap and provider setup.
- `src/app/App.jsx` — top-level layout and provider nesting.
- `src/app/routes.jsx` — React Router route definitions.
- `src/contexts/` — global state providers for auth and theme.
- `src/components/` — reusable shared UI components.
- `src/features/` — feature-specific screens, API hooks, and components.
- `src/pages/` — page-level components used by routes.
- `src/services/apiClient.js` — Axios client that sets `VITE_API_URL` and authorization headers.
- `src/lib/` — helper utilities like formatting and dates.
- `src/styles/` — application CSS.

### Frontend request flow

1. User interacts with UI on a page.
2. A component or feature hook calls `apiClient`.
3. `apiClient` sends HTTP requests to the backend API.
4. Backend responds with JSON.
5. React Query caches and provides the response to the component.
6. The component renders the updated UI.

### Key frontend files

- `src/contexts/AuthContext.jsx` — stores auth state, login, logout, token refresh, and protected route behavior.
- `src/services/apiClient.js` — base Axios instance used by all API hooks.
- `src/pages/DashboardPage.jsx` — dashboard summary cards and charts.
- `src/pages/AnalyticsPage.jsx` — analytics summary and charts.
- `src/components/layout/AppLayout.jsx` — general application frame with navigation.
- `src/components/layout/Sidebar.jsx` — route navigation links.
- `src/components/layout/TopBar.jsx` — header, search, and user actions.
- `src/components/charts/LineChart.jsx` — line chart wrapper.
- `src/components/charts/DonutChart.jsx` — donut chart wrapper.
- `src/components/charts/BarChart.jsx` — bar chart wrapper.

### Feature folders

Each feature folder owns its domain-specific behavior:

- `src/features/auth/` — login/register flows and auth API hooks.
- `src/features/dashboard/` — dashboard data fetching and summary cards.
- `src/features/analytics/` — analytics queries and chart data.
- `src/features/transactions/` — transaction management screens and forms.
- `src/features/budgets/` — budget planning workflows.
- `src/features/goals/` — savings goal setup and progress.
- `src/features/settings/` — user settings and profile actions.

## How frontend and backend connect

- The frontend stores the API base URL in `frontend/.env` via `VITE_API_URL`.
- `src/services/apiClient.js` constructs requests to endpoints such as `/auth/login`, `/transactions`, `/analytics/summary`.
- The backend authenticates requests with JWT and uses the user ID from the token to scope data.
- Dashboard and analytics pages depend on backend summary endpoints.

## What each metric means

### Total Balance

`Total Balance` represents the current amount across tracked accounts. In BudgetWise, it may also account for net savings activity in the selected period.

### Savings Balance

The total amount assigned to savings goals.

### Net Savings

Income minus expenses within the selected time frame.

### Remaining Cash

Calculated as:

`total_income - total_expenses - total_spend_plans - total_savings_goals`

This is a forecast of the cash still available once the current month’s incomes, expense transactions, budget plans, and committed savings allocations are considered.

> Important: `Remaining Cash` is a cash-flow projection, not the same as raw `Total Balance`.

## Typical user flows

### New user registration

- Frontend: `RegisterPage.jsx` submits credentials.
- Backend: `authRoutes` → `authController` → `authService` → `userRepository`.
- Result: JWT is returned and stored in auth context.

### Adding a transaction

- Frontend: transaction form submits to backend via `apiClient`.
- Backend: `transactionRoutes` → `transactionController` → `transactionService` → `transactionRepository`.
- After save: frontend invalidates query cache and dashboard analytics update.

### Viewing dashboard

- Frontend: `DashboardPage.jsx` loads summary data from analytics endpoint.
- Backend: `analyticsService.js` calculates totals and returns metrics.
- Dashboard cards and charts render the returned values.

### Viewing analytics

- Frontend: `AnalyticsPage.jsx` requests category and monthly analytics data.
- Backend: `analyticsService.js` builds category totals, month-over-month trends, and the financial health score.

## How to explain the app to others

- The backend is a REST API using Express with separate controller/service/repository layers.
- The frontend is React + Vite and uses React Query for data fetching.
- Data flows from the frontend through `apiClient` into backend routes, where controllers and services transform and persist it.
- The analytics service combines income, expenses, budgets, and goals to create summaries and projections.

## Quick answers to expected questions

- **How does auth work?**
  - JWT-based auth with login and register endpoints.
  - Auth middleware checks the token and attaches `userId` to requests.

- **Where are expenses stored?**
  - In `backend/src/repositories/transactionRepository.js` and the `transactions` table defined in `schema.sql`.

- **How are charts generated?**
  - Frontend chart wrappers in `src/components/charts/` use Recharts.
  - Data is provided by analytics endpoints on the backend.

- **What is the purpose of services?**
  - Services contain business logic and coordinate data access.
  - Controllers should remain thin and only handle request/response.

- **How does the frontend know which endpoint to call?**
  - All backend routes are prefixed with `/api`, and `frontend/.env` supplies `VITE_API_URL`.
  - `apiClient.js` appends endpoint paths like `/auth/login` or `/analytics/summary`.

## Recommended files to inspect first

- `backend/server.js`
- `backend/src/routes/analyticsRoutes.js`
- `backend/src/services/analyticsService.js`
- `frontend/src/services/apiClient.js`
- `frontend/src/contexts/AuthContext.jsx`
- `frontend/src/pages/DashboardPage.jsx`
- `frontend/src/pages/AnalyticsPage.jsx`

## Deployment notes

- Backend can be deployed to services like Render or Heroku using `node server.js`.
- Frontend can be deployed to Vercel, Netlify, or any static host from the `dist/` output.
- Ensure backend and frontend URLs are configured correctly so the frontend can reach the API.
