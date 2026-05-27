/**
 * server.js
 * Express 5 application entry point.
 *
 * KEY EXPRESS 5 CHANGES applied here:
 *   1. `npm install express@5` — package.json already updated
 *   2. Wildcards must be named: `/*splat` not `/*`
 *   3. No combined res.send(404, msg) — always res.status().json()
 *   4. req.body defaults to undefined (not {}) if body-parser not applied
 *   5. Async errors in route handlers auto-forward to errorMiddleware
 *      — no need to wrap routes in try/catch
 *
 * Middleware registration order (must be exact):
 *   1. Security headers (helmet)
 *   2. CORS
 *   3. Request logger (morgan)
 *   4. JSON body parser  ← must be before routes so req.body is defined
 *   5. API routes
 *   6. 404 catch-all
 *   7. Global error handler  ← MUST be last
 */

// Load and validate all env vars before anything else
const config = require('./src/config/env');

const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');

const loggingMiddleware = require('./src/middleware/loggingMiddleware');
const errorMiddleware   = require('./src/middleware/errorMiddleware');

const authRoutes        = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const budgetRoutes      = require('./src/routes/budgetRoutes');
const goalRoutes        = require('./src/routes/goalRoutes');
const analyticsRoutes   = require('./src/routes/analyticsRoutes');

const app = express();

// ── 1. Security Headers ───────────────────────────────────────────────────────
app.use(helmet());

// ── 2. CORS ───────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: config.cors.frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);

// ── 3. Request Logger ─────────────────────────────────────────────────────────
app.use(loggingMiddleware);

// ── 4. JSON Body Parser ───────────────────────────────────────────────────────
// EXPRESS 5: req.body is undefined (not {}) if this middleware is missing.
// Must be registered before any route that reads req.body.
app.use(express.json());

// ── 5. Health Check ───────────────────────────────────────────────────────────
// Simple endpoint for Render / uptime monitors to verify the server is alive.
app.get('/health', (_req, res) => {
  // EXPRESS 5: strict res.status().json() — no combined signature
  res.status(200).json({
    success: true,
    data: { status: 'ok', timestamp: new Date().toISOString() },
  });
});

// ── 6. API Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets',      budgetRoutes);
app.use('/api/goals',        goalRoutes);
app.use('/api/analytics',    analyticsRoutes);

// ── 7. 404 Catch-All ──────────────────────────────────────────────────────────
// EXPRESS 5: wildcards MUST be named — `/*splat` not `/*` or `*`
app.use('/*splat', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found.`,
  });
});

// ── 8. Global Error Handler ───────────────────────────────────────────────────
// MUST be the very last app.use() call.
// EXPRESS 5: async errors thrown anywhere in a route/middleware are
// automatically forwarded here — no manual next(err) needed in controllers.
app.use(errorMiddleware);

// ── 9. Start Server ───────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`[Server] BudgetWise API running on port ${config.port}`);
  console.log(`[Server] Environment : ${config.nodeEnv}`);
  console.log(`[Server] Express     : 5.x (native async error handling)`);
  console.log(`[Server] Frontend    : ${config.cors.frontendUrl}`);
});

module.exports = app;
