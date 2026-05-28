# BudgetWise Project Proposal

## 1. Project Title
BudgetWise — Full-Stack Personal Finance Manager

## 2. Project Overview
BudgetWise is a full-stack personal finance application that allows users to track income, expenses, budgets, savings goals, and account balances through a responsive web interface. The frontend is built with React and Tailwind CSS, while the backend provides a RESTful API using Node.js, Express, and Supabase PostgreSQL.

## 3. Problem Statement
Many simple personal finance frontends use static data and do not persist user input. This makes it difficult for users to manage actual finances, track spending over time, or view reliable analytics. BudgetWise solves this by connecting the UI to a real backend API and a database so records are stored, updated, and retrieved consistently.

## 4. Objectives
- Convert the existing BudgetWise frontend into a working full-stack application.
- Implement secure user authentication and session management.
- Build RESTful CRUD APIs for financial entities.
- Persist financial data in a database.
- Display dashboard summaries and analytics based on stored transaction and budget data.
- Ensure the user interface is responsive and usable on desktop and mobile.

## 5. Scope of Work
The project will cover:
- User registration and login.
- Transaction management (income and expenses).
- Budget management and spend planning.
- Savings goal tracking.
- Account and income source management.
- Dashboard overview with key financial metrics.
- Analytics charts for income, expenses, and category breakdowns.
- Backend validation, error handling, and environment configuration.

## 6. Proposed Solution
BudgetWise will be developed with a two-tier architecture:
- Frontend: React + Vite, using Tailwind CSS for responsive components and Recharts for visualizations.
- Backend: Express.js API with modular routes, controllers, services, and repositories.
- Database: Supabase PostgreSQL storing users, transactions, budgets, goals, accounts, and income sources.

The frontend will use Axios to query the backend API for every page, ensuring no static or hardcoded data is shown.

## 7. Key Features
- **User Authentication:** Register, login, and retrieve current user data.
- **Transactions:** Add, edit, delete, and list income and expense transactions.
- **Budgets:** Create monthly budget categories and update planned spend amounts.
- **Goals:** Create savings goals and track progress toward targets.
- **Accounts:** Manage multiple accounts and view balances.
- **Analytics:** Summary cards, line charts, bar charts, and category donut charts.
- **Responsive UI:** Works across desktop and mobile viewports.

## 8. Technical Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router, React Hook Form, Recharts, Axios, React Query
- **Backend:** Node.js, Express, express-validator, jsonwebtoken, bcryptjs, helmet, cors
- **Database:** PostgreSQL via Supabase
- **Development Tools:** nodemon, dotenv, morgan, Supabase SQL Editor

## 9. Data Model
The application data model contains the following entities:
- `users` — authenticated users with profile and preferences.
- `transactions` — income and expense records linked to users.
- `budgets` — monthly budget plans for categories.
- `goals` — savings targets with current progress.
- `accounts` — user accounts and balances.
- `income_sources` — recurring or one-time income entries.

Relationships:
- A user owns transactions, budgets, goals, accounts, and income sources.
- Transactions, budgets, goals, accounts, and income sources reference `user_id`.
- Income sources may optionally link to an account.

## 10. Implementation Plan

| Week | Deliverables |
|------|--------------|
| 7 | Submit proposal; finalize backend architecture, API resource map, and database schema. |
| 8 | Set up Express server, middleware, and environment config; create database schema and Supabase tables. |
| 9 | Build authentication endpoints and transaction CRUD operations; add validation and error handling. |
| 10 | Implement budgets, goals, income sources, and accounts APIs; finish repository layer and services. |
| 11 | Connect frontend pages to backend APIs; implement dashboard and analytics data fetching with React Query. |
| 12 | Test full user flows, improve mobile responsiveness, fix bugs, and prepare the final demo. |

## 11. Success Criteria
BudgetWise will be considered complete when:
- The frontend successfully fetches and mutates data through the backend API.
- User data persists across page refreshes.
- Core CRUD operations work for transactions, budgets, goals, and income sources.
- The dashboard and analytics pages show live values computed from stored data.
- The application is responsive and visually consistent.
- Configuration is stored in `.env` and not committed to source control.

## 12. Risks and Mitigation
- **Risk:** Backend and frontend integration may take longer than expected.
  - **Mitigation:** Prioritize API contract design early and build one feature at a time.
- **Risk:** Database schema changes may require refactoring.
  - **Mitigation:** Use a clear relational design and keep repository queries modular.
- **Risk:** Responsive layout issues on mobile.
  - **Mitigation:** Test mobile breakpoints continuously during frontend development.

## 13. Conclusion
BudgetWise will evolve from a static frontend into a functional full-stack finance application. By adding a robust Express backend, PostgreSQL storage, and live analytics, the project will demonstrate a complete modern web application workflow from user input to persisted data and visual reporting.
