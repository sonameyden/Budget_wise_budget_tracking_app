/**
 * server.js — Express 5 entry point.
 */
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
const accountRoutes     = require('./src/routes/accountRoutes');
const incomeRoutes      = require('./src/routes/incomeRoutes');

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.cors.frontendUrl,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false,
}));
app.use(loggingMiddleware);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

app.use('/api/auth',         authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets',      budgetRoutes);
app.use('/api/goals',        goalRoutes);
app.use('/api/analytics',    analyticsRoutes);
app.use('/api/accounts',     accountRoutes);
app.use('/api/income',       incomeRoutes);

// Express 5 named wildcard 404
app.use('/*splat', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

app.use(errorMiddleware);

app.listen(config.port, () => {
  console.log(`[Server] BudgetWise API on port ${config.port} | Express 5`);
  console.log(`[Server] Environment : ${config.nodeEnv}`);
});

module.exports = app;
