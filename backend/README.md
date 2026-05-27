# BudgetWise — Backend API

RESTful API for the BudgetWise personal finance application.
Built with **Node.js + Express**, connected to **Supabase PostgreSQL**.

## Tech Stack

- **Node.js** + **Express.js** — API server
- **Supabase** — PostgreSQL hosted database
- **bcryptjs** — password hashing
- **jsonwebtoken** — JWT authentication
- **express-validator** — input validation
- **helmet + cors** — security headers
- **morgan** — request logging
- **express-rate-limit** — brute-force protection

## Architecture

```
Request → Route → Controller → Service → Repository → Supabase
```

- **Routes** — parse, validate, authenticate
- **Controllers** — call service, return response (no logic)
- **Services** — business logic, orchestration, ownership checks
- **Repositories** — database access only (no business logic)
- **Domain** — pure constants and functions

## Getting Started

### 1. Prerequisites

- Node.js ≥ 18
- A [Supabase](https://supabase.com) project (free tier is fine)

### 2. Install dependencies

```bash
cd backend
npm install
```

### 3. Set up the database

1. Open your Supabase project → **SQL Editor**
2. Paste and run the contents of `schema.sql`

### 4. Configure environment variables

```bash
cp .env.example .env
```

Fill in your `.env`:

```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_very_long_random_secret
JWT_EXPIRES_IN=7d
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FRONTEND_URL=http://localhost:5173
```

Find your Supabase credentials at:
**Supabase Dashboard → Project Settings → API**

### 5. Start the server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:5000`

---

## API Reference

### Authentication

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, receive JWT |
| GET | `/api/auth/me` | Yes | Get current user |

### Transactions

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/transactions` | List (supports `?category=`, `?type=`, `?search=`, `?startDate=`, `?endDate=`) |
| POST | `/api/transactions` | Create |
| PUT | `/api/transactions/:id` | Update |
| DELETE | `/api/transactions/:id` | Delete |

### Budgets

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/budgets` | List for month (`?month=`, `?year=`) |
| POST | `/api/budgets` | Create |
| PUT | `/api/budgets/:id` | Update limit |
| DELETE | `/api/budgets/:id` | Delete |

### Goals

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/goals` | List all goals |
| POST | `/api/goals` | Create |
| PUT | `/api/goals/:id` | Update / add funds |
| DELETE | `/api/goals/:id` | Delete |

### Analytics

All accept `?period=week|month|year`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/analytics/summary` | Income, expenses, savings, avg daily spend |
| GET | `/api/analytics/monthly` | Day-by-day data for line chart |
| GET | `/api/analytics/categories` | Per-category totals for donut/bar chart |
| GET | `/api/analytics/score` | Financial health score (0–100) |

---

## Deployment (Render)

1. Push `backend/` to a GitHub repository
2. Create a **New Web Service** on [Render](https://render.com)
3. Connect the repo
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add all environment variables from `.env.example` in the Render dashboard
6. Deploy — Render auto-deploys on every push to `main`
