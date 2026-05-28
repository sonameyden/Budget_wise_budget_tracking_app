# BudgetWise

BudgetWise is a personal finance manager with a React + Vite frontend and a Node.js + Express backend. It helps users track income, expenses, budgets, savings goals, and financial analytics in one place.

## Project Structure

- `backend/` — Express API server, Supabase/Postgres persistence, auth, transaction and analytics business logic.
- `frontend/` — React app built with Vite, Tailwind CSS, React Router and TanStack Query.
- `backend/README.md` — backend-specific setup and API reference.
- `frontend/README.md` — frontend-specific setup and runtime instructions.

## What this app does

- User authentication with JWT.
- Record incomes, expenses, transfers, budgets, and savings goals.
- Generate dashboard summary cards and analytics charts.
- Compute remaining available cash, monthly expenses, and savings metrics.
- Display categorized spending and time-series trends.

## Key Concepts

- `Total Balance` is based on account balances and may include recent net transaction effects.
- `Savings Balance` shows total funds earmarked for goals.
- `Remaining Cash` is a forecast of cash left after current incomes, expenses, budget plans, and savings commitments.
- `Net Savings` is the difference between income and expenses for the selected period.

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Update `backend/.env` with your Supabase credentials and JWT settings.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Update `frontend/.env` with your API URL, for example:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start locally

Run the backend server first, then frontend:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

- Backend defaults to `http://localhost:5000`
- Frontend defaults to `http://localhost:5173`

## How to use

1. Register a new account.
2. Add income sources and savings goals.
3. Add expense transactions and budget limits.
4. Visit the Dashboard and Analytics pages for summaries and charts.

## Important routes

The backend exposes standard routes for auth, transactions, budgets, goals, and analytics. Example:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/transactions`
- `POST /api/budgets`
- `GET /api/analytics/summary`

## Notes

- The frontend uses Axios via `src/services/apiClient.js` and stores the JWT token in auth context.
- The backend separates responsibilities into routes, controllers, services, and repositories.
- The app is designed to keep UI state in React and server state via TanStack Query.

## Useful docs

- `backend/README.md` — backend setup, API reference, deployment notes.
- `frontend/README.md` — frontend setup, environment variables, folder structure.
- `PROJECT_ARCHITECTURE_AND_WORKFLOW.md` — detailed architecture, folder-level responsibilities, and request flow.
