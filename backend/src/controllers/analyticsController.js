/**
 * analyticsController.js
 * Thin controller for analytics routes.
 *
 * EXPRESS 5 CHANGE: No try/catch. Any failure in analyticsService
 * automatically propagates to the global errorMiddleware.
 */

const analyticsService = require('../services/analyticsService');
const { sendSuccess } = require('../utils/responseHelper');
const { ANALYTICS_PERIODS } = require('../domain/constants');

/**
 * Resolve and validate the period query param.
 * Defaults to 'month' if missing or invalid.
 * @param {string} raw
 * @returns {'week'|'month'|'year'}
 */
const resolvePeriod = (raw) =>
  ANALYTICS_PERIODS.includes(raw) ? raw : 'month';

/**
 * @route   GET /api/analytics/summary
 * @desc    Financial summary: total income, expenses, savings, avg daily spend
 * @access  Protected
 */
const summary = async (req, res) => {
  const period = resolvePeriod(req.query.period);
  const data = await analyticsService.getSummary(req.user.id, period);
  return sendSuccess(res, data);
};

/**
 * @route   GET /api/analytics/monthly
 * @desc    Day-by-day income and expense data for the line chart
 * @access  Protected
 */
const monthly = async (req, res) => {
  const period = resolvePeriod(req.query.period);
  const chartData = await analyticsService.getMonthlyChart(req.user.id, period);
  return sendSuccess(res, { chart: chartData });
};

/**
 * @route   GET /api/analytics/categories
 * @desc    Spending totals per category (for donut and bar charts)
 * @access  Protected
 */
const categories = async (req, res) => {
  const period = resolvePeriod(req.query.period);
  const breakdown = await analyticsService.getCategoryBreakdown(req.user.id, period);
  return sendSuccess(res, { categories: breakdown });
};

/**
 * @route   GET /api/analytics/score
 * @desc    Financial health score (0–100) for the current month
 * @access  Protected
 */
const score = async (req, res) => {
  const data = await analyticsService.getHealthScore(req.user.id);
  return sendSuccess(res, data);
};

module.exports = { summary, monthly, categories, score };
