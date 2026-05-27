/**
 * analyticsRoutes.js
 * Analytics endpoints — all protected, all read-only (GET).
 * All accept an optional `?period=week|month|year` query param.
 */

const express = require('express');
const router = express.Router();

const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// All analytics routes require a valid JWT
router.use(authMiddleware);

// GET /api/analytics/summary    — total income, expenses, savings, avg daily
router.get('/summary', analyticsController.summary);

// GET /api/analytics/monthly    — day-by-day data for line chart
router.get('/monthly', analyticsController.monthly);

// GET /api/analytics/categories — per-category expense totals for donut/bar chart
router.get('/categories', analyticsController.categories);

// GET /api/analytics/score      — financial health score (0–100)
router.get('/score', analyticsController.score);

module.exports = router;
