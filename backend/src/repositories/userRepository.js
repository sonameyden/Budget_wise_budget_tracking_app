/**
 * userRepository.js
 * All database operations for the users table.
 * This is the ONLY place in the app that queries users directly.
 * Services call this — they never touch supabase directly.
 */

const supabase = require('../config/database');

/**
 * Find a user by their email address.
 * Used during login to look up the account.
 *
 * @param {string} email
 * @returns {Promise<Object|null>} User row including password hash, or null
 */
const findByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error) return null; // No user found or query error
  return data;
};

/**
 * Find a user by their UUID (used by authMiddleware after token decode).
 *
 * @param {string} id - UUID
 * @returns {Promise<Object|null>} User row without exposing password, or null
 */
const findById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, avatar_url, currency, theme, created_at')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
};

/**
 * Create a new user record.
 * The password must already be hashed before calling this function.
 *
 * @param {{ name: string, email: string, password: string }} userData
 * @returns {Promise<Object>} The newly created user row (without password)
 */
const create = async ({ name, email, password }) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // bcrypt hash — passed in from authService
    })
    .select('id, name, email, avatar_url, currency, theme, created_at')
    .single();

  if (error) {
    // Surface duplicate email as a user-friendly error
    if (error.code === '23505') {
      const err = new Error('An account with this email already exists.');
      err.status = 409;
      throw err;
    }
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data;
};

/**
 * Update a user's profile fields.
 * Only the provided fields are updated (partial update / PATCH semantics).
 *
 * @param {string} id - UUID of the user to update
 * @param {Object} updates - Fields to update (name, avatar_url, currency, theme)
 * @returns {Promise<Object>} Updated user row
 */
const update = async (id, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select('id, name, email, avatar_url, currency, theme, created_at')
    .single();

  if (error) throw new Error(`Failed to update user: ${error.message}`);
  return data;
};

const remove = async (id) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Failed to delete user: ${error.message}`);
};

module.exports = { findByEmail, findById, create, update, remove };
