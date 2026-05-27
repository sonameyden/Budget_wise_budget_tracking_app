/**
 * budgetService.js
 * Business logic for budget management.
 * Enriches each budget with the actual amount spent in that category/month,
 * which is calculated by summing expense transactions.
 */

const budgetRepository = require('../repositories/budgetRepository');
const transactionRepository = require('../repositories/transactionRepository');
const { getMonthDateRange } = require('../utils/dateUtils');

/**
 * Get all budgets for the current (or specified) month, enriched with spent amounts.
 *
 * @param {string} userId
 * @param {number} month
 * @param {number} year
 * @returns {Promise<Array>} Budgets with a `spent` field added
 */
const getByMonth = async (userId, month, year) => {
  // Fetch raw budget records
  const budgets = await budgetRepository.findByUserAndMonth(userId, month, year);

  if (budgets.length === 0) return [];

  // Get all expense transactions in this month to calculate spent amounts
  const { startDate, endDate } = getMonthDateRange(month, year);
  const transactions = await transactionRepository.findByDateRange(
    userId,
    startDate,
    endDate
  );

  // Sum expenses by category
  const spentByCategory = {};
  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      spentByCategory[tx.category] =
        (spentByCategory[tx.category] || 0) + parseFloat(tx.amount);
    }
  });

  // Enrich each budget with how much was spent
  return budgets.map((budget) => ({
    ...budget,
    spent: spentByCategory[budget.category] || 0,
  }));
};

/**
 * Create a new budget after checking for ownership context.
 *
 * @param {string} userId
 * @param {Object} body - { category, limit_amount, month, year }
 * @returns {Promise<Object>}
 */
const create = async (userId, body) => {
  const budgetData = {
    user_id: userId,
    category: body.category,
    limit_amount: parseFloat(body.limit_amount),
    month: parseInt(body.month, 10),
    year: parseInt(body.year, 10),
  };

  return budgetRepository.create(budgetData);
};

/**
 * Update a budget limit — verifies ownership.
 *
 * @param {string} budgetId
 * @param {string} userId
 * @param {Object} body
 * @returns {Promise<Object>}
 */
const update = async (budgetId, userId, body) => {
  const budget = await budgetRepository.findById(budgetId);

  if (!budget) {
    const err = new Error('Budget not found.');
    err.status = 404;
    throw err;
  }

  if (budget.user_id !== userId) {
    const err = new Error('You do not have permission to update this budget.');
    err.status = 403;
    throw err;
  }

  const updates = {};
  if (body.limit_amount !== undefined) updates.limit_amount = parseFloat(body.limit_amount);

  return budgetRepository.update(budgetId, updates);
};

/**
 * Delete a budget — verifies ownership.
 *
 * @param {string} budgetId
 * @param {string} userId
 * @returns {Promise<void>}
 */
const remove = async (budgetId, userId) => {
  const budget = await budgetRepository.findById(budgetId);

  if (!budget) {
    const err = new Error('Budget not found.');
    err.status = 404;
    throw err;
  }

  if (budget.user_id !== userId) {
    const err = new Error('You do not have permission to delete this budget.');
    err.status = 403;
    throw err;
  }

  return budgetRepository.remove(budgetId);
};

module.exports = { getByMonth, create, update, remove };
