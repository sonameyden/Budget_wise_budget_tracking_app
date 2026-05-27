/**
 * transactionService.js
 * Business logic for transaction CRUD operations.
 * Handles ownership checks — ensuring users can only access their own data.
 * Never touches HTTP — called only by transactionController.
 */

const transactionRepository = require('../repositories/transactionRepository');

/**
 * Get all transactions for the authenticated user with optional filters.
 *
 * @param {string} userId
 * @param {Object} filters - { category, type, search, startDate, endDate }
 * @returns {Promise<Array>}
 */
const getAll = async (userId, filters = {}) => {
  return transactionRepository.findAllByUser(userId, filters);
};

/**
 * Get a single transaction by ID — verifies the user owns it.
 *
 * @param {string} transactionId
 * @param {string} userId
 * @returns {Promise<Object>}
 */
const getById = async (transactionId, userId) => {
  const transaction = await transactionRepository.findById(transactionId);

  if (!transaction) {
    const err = new Error('Transaction not found.');
    err.status = 404;
    throw err;
  }

  // Ownership check — prevent accessing another user's transactions
  if (transaction.user_id !== userId) {
    const err = new Error('You do not have permission to access this transaction.');
    err.status = 403;
    throw err;
  }

  return transaction;
};

/**
 * Create a new transaction for the authenticated user.
 *
 * @param {string} userId
 * @param {Object} body - Validated request body
 * @returns {Promise<Object>} Created transaction
 */
const create = async (userId, body) => {
  const transactionData = {
    user_id: userId,
    title: body.title.trim(),
    amount: parseFloat(body.amount),
    type: body.type,
    category: body.category,
    transaction_date: body.transaction_date,
    payment_method: body.payment_method || 'cash',
    notes: body.notes || null,
  };

  return transactionRepository.create(transactionData);
};

/**
 * Update a transaction — verifies ownership before updating.
 *
 * @param {string} transactionId
 * @param {string} userId
 * @param {Object} body - Fields to update
 * @returns {Promise<Object>} Updated transaction
 */
const update = async (transactionId, userId, body) => {
  // Verify the transaction exists and belongs to this user
  await getById(transactionId, userId);

  // Build the updates object with only provided fields
  const updates = {};
  if (body.title !== undefined) updates.title = body.title.trim();
  if (body.amount !== undefined) updates.amount = parseFloat(body.amount);
  if (body.type !== undefined) updates.type = body.type;
  if (body.category !== undefined) updates.category = body.category;
  if (body.transaction_date !== undefined) updates.transaction_date = body.transaction_date;
  if (body.payment_method !== undefined) updates.payment_method = body.payment_method;
  if (body.notes !== undefined) updates.notes = body.notes;

  return transactionRepository.update(transactionId, updates);
};

/**
 * Delete a transaction — verifies ownership before deleting.
 *
 * @param {string} transactionId
 * @param {string} userId
 * @returns {Promise<void>}
 */
const remove = async (transactionId, userId) => {
  // Ownership check
  await getById(transactionId, userId);
  return transactionRepository.remove(transactionId);
};

module.exports = { getAll, getById, create, update, remove };
