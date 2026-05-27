/**
 * budgetController.js
 * Thin controller for budget CRUD routes.
 *
 * EXPRESS 5 CHANGE: No try/catch. Any async error from budgetService
 * propagates automatically to the global errorMiddleware.
 */

const budgetService = require('../services/budgetService');
const { sendSuccess } = require('../utils/responseHelper');
const { getCurrentMonthYear } = require('../utils/dateUtils');

/**
 * @route   GET /api/budgets
 * @desc    Get budgets for a given month/year (defaults to current month)
 * @access  Protected
 */
const index = async (req, res) => {
  const { month, year } = getCurrentMonthYear();
  const targetMonth = parseInt(req.query.month, 10) || month;
  const targetYear = parseInt(req.query.year, 10) || year;

  const budgets = await budgetService.getByMonth(req.user.id, targetMonth, targetYear);
  return sendSuccess(res, { budgets });
};

/**
 * @route   POST /api/budgets
 * @desc    Create a new budget
 * @access  Protected
 */
const create = async (req, res) => {
  const budget = await budgetService.create(req.user.id, req.body);
  return sendSuccess(res, { budget }, 201);
};

/**
 * @route   PUT /api/budgets/:id
 * @desc    Update a budget limit
 * @access  Protected
 */
const update = async (req, res) => {
  const budget = await budgetService.update(req.params.id, req.user.id, req.body);
  return sendSuccess(res, { budget });
};

/**
 * @route   DELETE /api/budgets/:id
 * @desc    Delete a budget
 * @access  Protected
 */
const destroy = async (req, res) => {
  await budgetService.remove(req.params.id, req.user.id);
  return sendSuccess(res, { message: 'Budget deleted successfully.' });
};

module.exports = { index, create, update, destroy };
