/**
 * analyticsService.js
 * Business logic for financial analytics.
 * Aggregates transaction data into summary stats, chart data,
 * category breakdowns, and a financial health score.
 */

const transactionRepository = require('../repositories/transactionRepository');
const budgetRepository = require('../repositories/budgetRepository');
const { calculateFinancialScore } = require('../domain/financialScore');
const {
  getDateRangeForPeriod,
  generateDateRange,
  getCurrentMonthYear,
  getMonthDateRange,
} = require('../utils/dateUtils');

/**
 * Returns high-level financial summary stats for a given period.
 * Includes: total income, total expenses, net savings, avg daily spend.
 *
 * @param {string} userId
 * @param {'week'|'month'|'year'} period
 * @returns {Promise<Object>}
 */
const getSummary = async (userId, period = 'month') => {
  const { startDate, endDate } = getDateRangeForPeriod(period);
  const transactions = await transactionRepository.findByDateRange(
    userId,
    startDate,
    endDate
  );

  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((tx) => {
    const amount = parseFloat(tx.amount);
    if (tx.type === 'income') totalIncome += amount;
    else totalExpenses += amount;
  });

  const netSavings = totalIncome - totalExpenses;

  // Calculate average daily spend over the period
  const days = generateDateRange(startDate, endDate).length;
  const avgDailySpend = days > 0 ? totalExpenses / days : 0;

  return {
    total_income: parseFloat(totalIncome.toFixed(2)),
    total_expenses: parseFloat(totalExpenses.toFixed(2)),
    net_savings: parseFloat(netSavings.toFixed(2)),
    avg_daily_spend: parseFloat(avgDailySpend.toFixed(2)),
    period,
    start_date: startDate,
    end_date: endDate,
  };
};

/**
 * Returns daily income and expense totals for the chart (line chart data).
 * Fills in zero values for days with no transactions.
 *
 * @param {string} userId
 * @param {'week'|'month'|'year'} period
 * @returns {Promise<Array>} Array of { date, income, expense }
 */
const getMonthlyChart = async (userId, period = 'month') => {
  const { startDate, endDate } = getDateRangeForPeriod(period);
  const transactions = await transactionRepository.findByDateRange(
    userId,
    startDate,
    endDate
  );

  // Build a map of date → { income, expense }
  const dataMap = {};
  transactions.forEach((tx) => {
    const date = tx.transaction_date;
    if (!dataMap[date]) dataMap[date] = { income: 0, expense: 0 };
    const amount = parseFloat(tx.amount);
    if (tx.type === 'income') dataMap[date].income += amount;
    else dataMap[date].expense += amount;
  });

  // Fill every date in the range (zeroes for missing days)
  const allDates = generateDateRange(startDate, endDate);
  return allDates.map((date) => ({
    date,
    income: parseFloat((dataMap[date]?.income || 0).toFixed(2)),
    expense: parseFloat((dataMap[date]?.expense || 0).toFixed(2)),
  }));
};

/**
 * Returns spending totals grouped by category (for donut/bar charts).
 *
 * @param {string} userId
 * @param {'week'|'month'|'year'} period
 * @returns {Promise<Array>} Array of { category, total, percentage }
 */
const getCategoryBreakdown = async (userId, period = 'month') => {
  const { startDate, endDate } = getDateRangeForPeriod(period);
  const transactions = await transactionRepository.findByDateRange(
    userId,
    startDate,
    endDate
  );

  // Sum expenses by category
  const categoryTotals = {};
  let grandTotal = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      const amount = parseFloat(tx.amount);
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amount;
      grandTotal += amount;
    }
  });

  // Convert to sorted array with percentage
  return Object.entries(categoryTotals)
    .map(([category, total]) => ({
      category,
      total: parseFloat(total.toFixed(2)),
      percentage:
        grandTotal > 0
          ? parseFloat(((total / grandTotal) * 100).toFixed(1))
          : 0,
    }))
    .sort((a, b) => b.total - a.total); // Highest spend first
};

/**
 * Returns the financial health score (0–100) for the current month.
 * Combines savings rate, budget adherence, and spending consistency.
 *
 * @param {string} userId
 * @returns {Promise<{ score: number, breakdown: Object }>}
 */
const getHealthScore = async (userId) => {
  const { month, year } = getCurrentMonthYear();
  const { startDate, endDate } = getMonthDateRange(month, year);

  // Fetch transactions for the current month
  const transactions = await transactionRepository.findByDateRange(
    userId,
    startDate,
    endDate
  );

  let totalIncome = 0;
  let totalExpenses = 0;
  const spentByCategory = {};

  transactions.forEach((tx) => {
    const amount = parseFloat(tx.amount);
    if (tx.type === 'income') {
      totalIncome += amount;
    } else {
      totalExpenses += amount;
      spentByCategory[tx.category] =
        (spentByCategory[tx.category] || 0) + amount;
    }
  });

  // Fetch budgets for the current month to check adherence
  const budgets = await budgetRepository.findByUserAndMonth(userId, month, year);
  const budgetsWithSpent = budgets.map((b) => ({
    ...b,
    spent: spentByCategory[b.category] || 0,
  }));

  const score = calculateFinancialScore(
    totalIncome,
    totalExpenses,
    budgetsWithSpent
  );

  return { score };
};

module.exports = {
  getSummary,
  getMonthlyChart,
  getCategoryBreakdown,
  getHealthScore,
};
