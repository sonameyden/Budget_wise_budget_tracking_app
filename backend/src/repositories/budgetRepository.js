/**
 * budgetRepository.js
 * All database operations for the budgets table.
 * Budgets are scoped to a specific user, category, month, and year.
 */

const supabase = require('../config/database');

/**
 * Find all budgets for a user in a given month/year.
 *
 * @param {string} userId
 * @param {number} month - 1–12
 * @param {number} year
 * @returns {Promise<Array>}
 */
const findByUserAndMonth = async (userId, month, year) => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .eq('year', year)
    .order('category', { ascending: true });

  if (error) throw new Error(`Failed to fetch budgets: ${error.message}`);
  return data || [];
};

/**
 * Find all budgets for a user (across all months).
 * Used by the analytics service for budget adherence scoring.
 *
 * @param {string} userId
 * @returns {Promise<Array>}
 */
const findAllByUser = async (userId) => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to fetch budgets: ${error.message}`);
  return data || [];
};

/**
 * Find a single budget by its UUID.
 *
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const findById = async (id) => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
};

/**
 * Create a new budget record.
 *
 * @param {Object} budgetData - { user_id, category, limit_amount, month, year }
 * @returns {Promise<Object>}
 */
const create = async (budgetData) => {
  const { data, error } = await supabase
    .from('budgets')
    .insert(budgetData)
    .select('*')
    .single();

  if (error) {
    // Unique constraint: one budget per category per month per user
    if (error.code === '23505') {
      const err = new Error(
        'A budget for this category already exists for the selected month.'
      );
      err.status = 409;
      throw err;
    }
    throw new Error(`Failed to create budget: ${error.message}`);
  }

  return data;
};

/**
 * Update an existing budget's limit amount.
 *
 * @param {string} id
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>}
 */
const update = async (id, updates) => {
  const { data, error } = await supabase
    .from('budgets')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(`Failed to update budget: ${error.message}`);
  return data;
};

/**
 * Delete a budget by ID.
 *
 * @param {string} id
 * @returns {Promise<void>}
 */
const remove = async (id) => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Failed to delete budget: ${error.message}`);
};

module.exports = {
  findByUserAndMonth,
  findAllByUser,
  findById,
  create,
  update,
  remove,
};
