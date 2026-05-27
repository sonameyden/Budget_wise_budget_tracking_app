/**
 * constants.js — single source of truth for all domain enums.
 */

const TRANSACTION_TYPES = { INCOME: 'income', EXPENSE: 'expense' };

const CATEGORIES = [
  'Food & Dining','Transportation','Shopping','Entertainment',
  'Bills & Utilities','Health','Education','Travel',
  'Salary','Freelance','Investment','Other',
];

const PAYMENT_METHODS = ['cash','card','wallet','bank_transfer','other'];

const ANALYTICS_PERIODS = ['week','month','year'];

const TRANSACTIONS_PER_PAGE = 50;

const ACCOUNT_TYPES = [
  'bank_account','cash_wallet','savings_account',
  'digital_wallet','credit_account','investment_account',
];

const INCOME_FREQUENCIES = [
  'weekly','bi_weekly','monthly','quarterly','annually','one_time',
];

const INCOME_CATEGORIES = [
  'salary','freelance','scholarship','passive','business','side_income','other',
];

const INCOME_STATUSES = ['active','paused','ended'];

module.exports = {
  TRANSACTION_TYPES, CATEGORIES, PAYMENT_METHODS,
  ANALYTICS_PERIODS, TRANSACTIONS_PER_PAGE,
  ACCOUNT_TYPES, INCOME_FREQUENCIES, INCOME_CATEGORIES, INCOME_STATUSES,
};
