/**
 * constants.js
 * Single source of truth for all domain constants.
 * Import these anywhere you need categories, types, or payment methods
 * instead of writing string literals that could drift out of sync.
 */

/** Valid transaction types */
const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

/** All valid spending/income categories */
const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health',
  'Education',
  'Travel',
  'Salary',
  'Freelance',
  'Investment',
  'Other',
];

/** Valid payment methods */
const PAYMENT_METHODS = ['cash', 'card', 'wallet', 'bank_transfer', 'other'];

/** Analytics period options */
const ANALYTICS_PERIODS = ['week', 'month', 'year'];

/** Maximum transactions returned per page */
const TRANSACTIONS_PER_PAGE = 50;

module.exports = {
  TRANSACTION_TYPES,
  CATEGORIES,
  PAYMENT_METHODS,
  ANALYTICS_PERIODS,
  TRANSACTIONS_PER_PAGE,
};
