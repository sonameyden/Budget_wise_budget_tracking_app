/**
 * transactionRepository.js
 * All database operations for the transactions table.
 * Supports filtering by category, type, search term, and date range.
 */

const supabase = require('../config/database');

/**
 * Fetch all transactions for a user, with optional filters.
 *
 * @param {string} userId
 * @param {Object} filters
 * @param {string} [filters.category]  - Filter by category name
 * @param {string} [filters.type]      - 'income' or 'expense'
 * @param {string} [filters.search]    - Search term matched against title
 * @param {string} [filters.startDate] - ISO date string (YYYY-MM-DD)
 * @param {string} [filters.endDate]   - ISO date string (YYYY-MM-DD)
 * @returns {Promise<Array>} Array of transaction rows
 */
const findAllByUser = async (userId, filters = {}) => {
  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false });

  // Apply optional filters
  if (filters.category && filters.category !== 'All Categories') {
    query = query.eq('category', filters.category);
  }

  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  if (filters.search) {
    // Case-insensitive partial match on title
    query = query.ilike('title', `%${filters.search}%`);
  }

  if (filters.startDate) {
    query = query.gte('transaction_date', filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte('transaction_date', filters.endDate);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch transactions: ${error.message}`);
  return data || [];
};

/**
 * Find a single transaction by ID.
 * Returns null if not found (ownership check happens in the service).
 *
 * @param {string} id - Transaction UUID
 * @returns {Promise<Object|null>}
 */
const findById = async (id) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
};

/**
 * Create a new transaction record.
 *
 * @param {Object} transactionData
 * @returns {Promise<Object>} The newly created transaction row
 */
const create = async (transactionData) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transactionData)
    .select('*')
    .single();

  if (error) throw new Error(`Failed to create transaction: ${error.message}`);
  return data;
};

/**
 * Update an existing transaction.
 *
 * @param {string} id     - Transaction UUID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated transaction row
 */
const update = async (id, updates) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(`Failed to update transaction: ${error.message}`);
  return data;
};

/**
 * Delete a transaction by ID.
 *
 * @param {string} id - Transaction UUID
 * @returns {Promise<void>}
 */
const remove = async (id) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Failed to delete transaction: ${error.message}`);
};

/**
 * Fetch transactions within a date range for analytics.
 *
 * @param {string} userId
 * @param {string} startDate - ISO date string
 * @param {string} endDate   - ISO date string
 * @returns {Promise<Array>}
 */
const findByDateRange = async (userId, startDate, endDate) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate)
    .order('transaction_date', { ascending: true });

  if (error) throw new Error(`Failed to fetch transactions: ${error.message}`);
  return data || [];
};

module.exports = { findAllByUser, findById, create, update, remove, findByDateRange };
