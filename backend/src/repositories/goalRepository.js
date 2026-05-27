/**
 * goalRepository.js
 * All database operations for the goals table.
 */

const supabase = require('../config/database');

/**
 * Find all savings goals for a user.
 *
 * @param {string} userId
 * @returns {Promise<Array>}
 */
const findAllByUser = async (userId) => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch goals: ${error.message}`);
  return data || [];
};

/**
 * Find a single goal by its UUID.
 *
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const findById = async (id) => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
};

/**
 * Create a new savings goal.
 *
 * @param {Object} goalData - { user_id, title, category, target_amount, deadline }
 * @returns {Promise<Object>}
 */
const create = async (goalData) => {
  const { data, error } = await supabase
    .from('goals')
    .insert(goalData)
    .select('*')
    .single();

  if (error) throw new Error(`Failed to create goal: ${error.message}`);
  return data;
};

/**
 * Update an existing goal (add funds, edit details, mark complete).
 *
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
const update = async (id, updates) => {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(`Failed to update goal: ${error.message}`);
  return data;
};

/**
 * Delete a goal by ID.
 *
 * @param {string} id
 * @returns {Promise<void>}
 */
const remove = async (id) => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Failed to delete goal: ${error.message}`);
};

module.exports = { findAllByUser, findById, create, update, remove };
