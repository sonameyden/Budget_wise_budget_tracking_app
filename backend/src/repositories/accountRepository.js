/**
 * accountRepository.js
 * All DB operations for the accounts table. No business logic here.
 */
const supabase = require('../config/database');

const findAllByUser = async (userId) => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch accounts: ${error.message}`);
  return data || [];
};

const findById = async (id) => {
  const { data, error } = await supabase
    .from('accounts').select('*').eq('id', id).single();
  if (error) return null;
  return data;
};

const create = async (accountData) => {
  const { data, error } = await supabase
    .from('accounts').insert(accountData).select('*').single();
  if (error) throw new Error(`Failed to create account: ${error.message}`);
  return data;
};

const update = async (id, updates) => {
  const { data, error } = await supabase
    .from('accounts').update(updates).eq('id', id).select('*').single();
  if (error) throw new Error(`Failed to update account: ${error.message}`);
  return data;
};

const remove = async (id) => {
  const { error } = await supabase.from('accounts').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete account: ${error.message}`);
};

module.exports = { findAllByUser, findById, create, update, remove };
