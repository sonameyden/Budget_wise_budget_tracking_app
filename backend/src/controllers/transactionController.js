/**
 * transactionController.js
 * Thin controller for transaction CRUD routes.
 *
 * EXPRESS 5 CHANGE: All try/catch blocks removed.
 * Any error thrown inside transactionService (404, 403, DB errors)
 * is automatically caught by Express 5 and forwarded to errorMiddleware.
 */

const transactionService = require('../services/transactionService');
const { sendSuccess } = require('../utils/responseHelper');

/**
 * @route   GET /api/transactions
 * @desc    List all transactions for the authenticated user (with optional filters)
 * @access  Protected
 */
const index = async (req, res) => {
  const filters = {
    category: req.query.category,
    type: req.query.type,
    search: req.query.search,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
  };

  const transactions = await transactionService.getAll(req.user.id, filters);
  return sendSuccess(res, { transactions, count: transactions.length });
};

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 * @access  Protected
 */
const create = async (req, res) => {
  const transaction = await transactionService.create(req.user.id, req.body);
  return sendSuccess(res, { transaction }, 201);
};

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update an existing transaction
 * @access  Protected
 */
const update = async (req, res) => {
  const transaction = await transactionService.update(
    req.params.id,
    req.user.id,
    req.body
  );
  return sendSuccess(res, { transaction });
};

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete a transaction
 * @access  Protected
 */
const destroy = async (req, res) => {
  await transactionService.remove(req.params.id, req.user.id);
  return sendSuccess(res, { message: 'Transaction deleted successfully.' });
};

module.exports = { index, create, update, destroy };
