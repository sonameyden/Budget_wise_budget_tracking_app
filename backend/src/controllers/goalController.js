/**
 * goalController.js
 * Thin controller for savings goal CRUD routes.
 *
 * EXPRESS 5 CHANGE: No try/catch. Rejected promises from goalService
 * are caught natively by Express 5 and routed to errorMiddleware.
 */

const goalService = require('../services/goalService');
const { sendSuccess } = require('../utils/responseHelper');

/**
 * @route   GET /api/goals
 * @desc    Get all savings goals for the authenticated user
 * @access  Protected
 */
const index = async (req, res) => {
  const goals = await goalService.getAll(req.user.id);
  return sendSuccess(res, { goals });
};

/**
 * @route   POST /api/goals
 * @desc    Create a new savings goal
 * @access  Protected
 */
const create = async (req, res) => {
  const goal = await goalService.create(req.user.id, req.body);
  return sendSuccess(res, { goal }, 201);
};

/**
 * @route   PUT /api/goals/:id
 * @desc    Update a goal (edit details or add funds)
 * @access  Protected
 */
const update = async (req, res) => {
  const goal = await goalService.update(req.params.id, req.user.id, req.body);
  return sendSuccess(res, { goal });
};

/**
 * @route   DELETE /api/goals/:id
 * @desc    Delete a savings goal
 * @access  Protected
 */
const destroy = async (req, res) => {
  await goalService.remove(req.params.id, req.user.id);
  return sendSuccess(res, { message: 'Goal deleted successfully.' });
};

module.exports = { index, create, update, destroy };
