/**
 * incomeRepository.js
 * All DB operations for the income_sources table.
 */
const supabase = require('../config/database');

const findAllByUser = async (userId, status = null) => {
  let query = supabase
    .from('income_sources').select('*, accounts(account_name, account_type)')
    .eq('user_id', userId).order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch income sources: ${error.message}`);
  return data || [];
};

const findById = async (id) => {
  const { data, error } = await supabase
    .from('income_sources').select('*').eq('id', id).single();
  if (error) return null;
  return data;
};

const create = async (incomeData) => {
  const { data, error } = await supabase
    .from('income_sources').insert(incomeData).select('*').single();
  if (error) throw new Error(`Failed to create income source: ${error.message}`);
  return data;
};

const update = async (id, updates) => {
  const { data, error } = await supabase
    .from('income_sources').update(updates).eq('id', id).select('*').single();
  if (error) throw new Error(`Failed to update income source: ${error.message}`);
  return data;
};

const remove = async (id) => {
  const { error } = await supabase.from('income_sources').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete income source: ${error.message}`);
};

/** Sum of monthly-equivalent active income for a user */
const getTotalMonthlyIncome = async (userId) => {
  const { data, error } = await supabase
    .from('income_sources')
    .select('income_amount, frequency')
    .eq('user_id', userId)
    .eq('status', 'active');
  if (error) throw new Error(`Failed to sum income: ${error.message}`);

  // Convert all frequencies to monthly equivalent
  const FREQ_MULTIPLIER = {
    weekly: 4.33, bi_weekly: 2.17, monthly: 1,
    quarterly: 1/3, annually: 1/12, one_time: 0,
  };

  return (data || []).reduce((sum, row) => {
    const multiplier = FREQ_MULTIPLIER[row.frequency] ?? 1;
    return sum + parseFloat(row.income_amount) * multiplier;
  }, 0);
};

module.exports = {
  findAllByUser, findById, create, update, remove, getTotalMonthlyIncome,
};
