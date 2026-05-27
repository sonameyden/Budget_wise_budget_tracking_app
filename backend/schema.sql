-- ============================================================
-- BudgetWise — Supabase PostgreSQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Enable UUID generation (already enabled on Supabase by default)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── USERS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,     -- bcrypt hash (never plain text)
  avatar_url  TEXT,
  currency    VARCHAR(10) DEFAULT 'USD',
  theme       VARCHAR(10) DEFAULT 'light',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── TRANSACTIONS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title            VARCHAR(200) NOT NULL,
  amount           DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  type             VARCHAR(10) NOT NULL CHECK (type IN ('income','expense')),
  category         VARCHAR(50) NOT NULL,
  payment_method   VARCHAR(20) DEFAULT 'cash',
  notes            TEXT,
  transaction_date DATE NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── BUDGETS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS budgets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category     VARCHAR(50) NOT NULL,
  limit_amount DECIMAL(12,2) NOT NULL CHECK (limit_amount > 0),
  month        INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year         INTEGER NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  -- One budget per category per month per user
  UNIQUE(user_id, category, month, year)
);

-- ── GOALS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS goals (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title          VARCHAR(200) NOT NULL,
  category       VARCHAR(50) DEFAULT 'Custom Goal',
  target_amount  DECIMAL(12,2) NOT NULL CHECK (target_amount > 0),
  current_amount DECIMAL(12,2) DEFAULT 0 CHECK (current_amount >= 0),
  deadline       DATE,
  completed      BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── INDEXES ──────────────────────────────────────────────────
-- Speed up the most common queries

-- Transactions: look up by user (used on every fetch)
CREATE INDEX IF NOT EXISTS idx_transactions_user_id
  ON transactions(user_id);

-- Transactions: filter/sort by date (used heavily in analytics)
CREATE INDEX IF NOT EXISTS idx_transactions_date
  ON transactions(transaction_date);

-- Transactions: combined index for analytics date-range queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
  ON transactions(user_id, transaction_date);

-- Budgets: look up by user + month + year
CREATE INDEX IF NOT EXISTS idx_budgets_user_month_year
  ON budgets(user_id, month, year);

-- Goals: look up by user
CREATE INDEX IF NOT EXISTS idx_goals_user_id
  ON goals(user_id);

-- ── ROW LEVEL SECURITY (optional but recommended) ─────────────
-- Since we use the service role key in the backend (which bypasses RLS),
-- these policies are optional. Enable them if you ever use the anon key.

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
