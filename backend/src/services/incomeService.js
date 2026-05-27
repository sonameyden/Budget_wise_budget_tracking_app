/**
 * incomeService.js
 * Business logic for income source management.
 */
const incomeRepository = require('../repositories/incomeRepository');

const getAll = async (userId, status) => {
  const sources = await incomeRepository.findAllByUser(userId, status || null);
  return sources.map(s => enrichIncome(s));
};

const create = async (userId, body) => {
  const data = await incomeRepository.create({
    user_id:       userId,
    source_name:   body.source_name.trim(),
    employer:      body.employer?.trim() || null,
    income_amount: parseFloat(body.income_amount),
    frequency:     body.frequency || 'monthly',
    category:      body.category  || 'salary',
    account_id:    body.account_id || null,
    start_date:    body.start_date || null,
    status:        body.status     || 'active',
    notes:         body.notes      || null,
  });
  return enrichIncome(data);
};

const update = async (id, userId, body) => {
  const source = await incomeRepository.findById(id);
  if (!source) { const e = new Error('Income source not found.'); e.status = 404; throw e; }
  if (source.user_id !== userId) { const e = new Error('Forbidden.'); e.status = 403; throw e; }

  const updates = {};
  ['source_name','employer','income_amount','frequency','category',
   'account_id','start_date','status','notes'].forEach(k => {
    if (body[k] !== undefined) updates[k] = body[k];
  });
  if (updates.income_amount) updates.income_amount = parseFloat(updates.income_amount);

  const updated = await incomeRepository.update(id, updates);
  return enrichIncome(updated);
};

const remove = async (id, userId) => {
  const source = await incomeRepository.findById(id);
  if (!source) { const e = new Error('Income source not found.'); e.status = 404; throw e; }
  if (source.user_id !== userId) { const e = new Error('Forbidden.'); e.status = 403; throw e; }
  return incomeRepository.remove(id);
};

/** Adds monthly_equivalent computed field — pure function, no DB */
const enrichIncome = (source) => {
  const MULTIPLIERS = {
    weekly: 4.33, bi_weekly: 2.17, monthly: 1,
    quarterly: 1/3, annually: 1/12, one_time: 0,
  };
  const monthly = parseFloat(source.income_amount) * (MULTIPLIERS[source.frequency] ?? 1);
  return { ...source, monthly_equivalent: parseFloat(monthly.toFixed(2)) };
};

module.exports = { getAll, create, update, remove };
