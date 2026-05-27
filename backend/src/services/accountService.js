/**
 * accountService.js
 * Business logic for account management.
 * Ownership checks live here — never in controllers or repositories.
 */
const accountRepository = require('../repositories/accountRepository');
const incomeRepository  = require('../repositories/incomeRepository');
const transactionRepository = require('../repositories/transactionRepository');

const getAll = async (userId) => {
  const accounts = await accountRepository.findAllByUser(userId);
  // Enrich each account with total monthly income linked to it
  const income = await incomeRepository.findAllByUser(userId, 'active');
  return accounts.map(acc => {
    const linked = income
      .filter(i => i.account_id === acc.id)
      .reduce((sum, i) => sum + parseFloat(i.income_amount), 0);
    return { ...acc, monthly_income: linked };
  });
};

const getNetWorth = async (userId) => {
  const accounts    = await accountRepository.findAllByUser(userId);
  const totalBalance = accounts.reduce((s, a) => s + parseFloat(a.current_balance), 0);
  const monthlyIncome = await incomeRepository.getTotalMonthlyIncome(userId);

  return {
    total_balance: parseFloat(totalBalance.toFixed(2)),
    total_monthly_income: parseFloat(monthlyIncome.toFixed(2)),
    account_count: accounts.length,
  };
};

const create = async (userId, body) => {
  return accountRepository.create({
    user_id:         userId,
    account_name:    body.account_name.trim(),
    account_type:    body.account_type,
    current_balance: parseFloat(body.current_balance || 0),
    color_theme:     body.color_theme || 'emerald',
    icon:            body.icon || '🏦',
    description:     body.description || null,
  });
};

const update = async (id, userId, body) => {
  const account = await accountRepository.findById(id);
  if (!account) { const e = new Error('Account not found.'); e.status = 404; throw e; }
  if (account.user_id !== userId) { const e = new Error('Forbidden.'); e.status = 403; throw e; }

  const updates = {};
  if (body.account_name    !== undefined) updates.account_name    = body.account_name.trim();
  if (body.current_balance !== undefined) updates.current_balance = parseFloat(body.current_balance);
  if (body.color_theme     !== undefined) updates.color_theme     = body.color_theme;
  if (body.icon            !== undefined) updates.icon            = body.icon;
  if (body.description     !== undefined) updates.description     = body.description;

  return accountRepository.update(id, updates);
};

const transfer = async (fromId, toId, amount, userId) => {
  const [from, to] = await Promise.all([
    accountRepository.findById(fromId),
    accountRepository.findById(toId),
  ]);
  if (!from || !to) { const e = new Error('Account not found.'); e.status = 404; throw e; }
  if (from.user_id !== userId || to.user_id !== userId) {
    const e = new Error('Forbidden.'); e.status = 403; throw e;
  }
  if (parseFloat(from.current_balance) < amount) {
    const e = new Error('Insufficient balance for transfer.'); e.status = 400; throw e;
  }
  const [updatedFrom, updatedTo] = await Promise.all([
    accountRepository.update(fromId, { current_balance: parseFloat(from.current_balance) - amount }),
    accountRepository.update(toId,   { current_balance: parseFloat(to.current_balance)   + amount }),
  ]);
  return { from: updatedFrom, to: updatedTo };
};

const remove = async (id, userId) => {
  const account = await accountRepository.findById(id);
  if (!account) { const e = new Error('Account not found.'); e.status = 404; throw e; }
  if (account.user_id !== userId) { const e = new Error('Forbidden.'); e.status = 403; throw e; }
  return accountRepository.remove(id);
};

module.exports = { getAll, getNetWorth, create, update, transfer, remove };
