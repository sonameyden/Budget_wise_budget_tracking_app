/**
 * analyticsService.js
 * Business logic for financial analytics.
 * Aggregates transaction data into summary stats, chart data,
 * category breakdowns, and a financial health score.
 */

const transactionRepository = require('../repositories/transactionRepository');
const budgetRepository = require('../repositories/budgetRepository');
const goalRepository = require('../repositories/goalRepository');
const incomeRepository = require('../repositories/incomeRepository');
const { calculateFinancialScore } = require('../domain/financialScore');
const accountService = require('./accountService');
const {
  getDateRangeForPeriod,
  generateDateRange,
  getCurrentMonthYear,
  getMonthDateRange,
} = require('../utils/dateUtils');

/**
 * Returns high-level financial summary stats for a given period.
 * 
 * NEW MODEL:
 * - Income comes from income_sources table (official source of truth)
 * - Expenses come only from transactions with type='expense'
 * - Planned spending comes from budgets.spend_plan
 * - Savings contributions come from goals.monthly_savings_amount
 * 
 * Calculations:
 * - total_income: from income_sources (monthly equivalent)
 * - total_expenses: from expense transactions in period
 * - total_spend_plans: from budget spend_plans (what user plans to spend)
 * - total_savings_goals: from goals monthly savings allocations
 * - remaining_available: total_income - total_expenses - total_spend_plans - total_savings_goals
 * - total_balance: sum of all account current_balance
 * - projected_end_of_month: total_balance + (total_income - total_expenses)
 *
 * @param {string} userId
 * @param {'week'|'month'|'year'} period
 * @returns {Promise<Object>}
 */
const getSummary = async (userId, period = 'month') => {
  const { startDate, endDate } = getDateRangeForPeriod(period);
  
  // Get income from the official source: income_sources table
  const totalMonthlyIncome = await incomeRepository.getTotalMonthlyIncome(userId);

  // Get transactions — only count EXPENSES (not income type)
  const transactions = await transactionRepository.findByDateRange(
    userId,
    startDate,
    endDate
  );

  let totalExpenses = 0;
  transactions.forEach((tx) => {
    // Only count expense transactions; skip income transactions
    if (tx.type === 'expense') {
      totalExpenses += parseFloat(tx.amount);
    }
  });

  // Get current month/year for budgets and goals
  const { month, year } = getCurrentMonthYear();

  // Sum spend plans from budgets for current month
  const budgets = await budgetRepository.findByUserAndMonth(userId, month, year);
  const totalSpendPlans = budgets.reduce((sum, b) => 
    sum + parseFloat(b.spend_plan || 0), 0);

  // Sum monthly savings amounts from goals
  const goals = await goalRepository.findAllByUser(userId);
  const totalSavingsGoals = goals.reduce((sum, g) => 
    sum + parseFloat(g.monthly_savings_amount || 0), 0);

  // Get account balances
  const accountData = await accountService.getNetWorth(userId);
  const totalAccountBalance = parseFloat(accountData.total_balance || 0);

  // Calculate net savings for the period (income - expenses)
  const netSavingsThisPeriod = totalMonthlyIncome - totalExpenses;

  // Calculate remaining available balance after spend plans and savings goals
  const remainingAvailable = totalMonthlyIncome - totalExpenses - totalSpendPlans - totalSavingsGoals;

  // Projected end of month balance
  const projectedEom = totalAccountBalance + netSavingsThisPeriod;

  // Calculate average daily spend
  const days = generateDateRange(startDate, endDate).length;
  const avgDailySpend = days > 0 ? totalExpenses / days : 0;

  return {
    // Income & Expenses (transaction-based for the period)
    total_income: parseFloat(totalMonthlyIncome.toFixed(2)),
    total_expenses: parseFloat(totalExpenses.toFixed(2)),
    net_savings: parseFloat(netSavingsThisPeriod.toFixed(2)),
    
    // Planned commitments
    total_spend_plans: parseFloat(totalSpendPlans.toFixed(2)),
    total_savings_goals: parseFloat(totalSavingsGoals.toFixed(2)),
    
    // Available balance after planned spending
    remaining_available: parseFloat(remainingAvailable.toFixed(2)),
    
    // Account-level balance
    total_balance: totalAccountBalance,
    
    // Projection for end of month
    projected_end_of_month: parseFloat(projectedEom.toFixed(2)),
    
    // Analytics
    avg_daily_spend: parseFloat(avgDailySpend.toFixed(2)),
    period,
    start_date: startDate,
    end_date: endDate,
  };
};

/**
 * Returns daily income and expense totals for the chart (line chart data).
 * 
 * NEW: Only count EXPENSE transactions (income is now a fixed monthly amount from income_sources).
 * Income shown here is the monthly equivalent spread evenly across the period.
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

  // Get monthly income to spread across the period
  const totalMonthlyIncome = await incomeRepository.getTotalMonthlyIncome(userId);
  const days = generateDateRange(startDate, endDate).length;
  const dailyIncome = days > 0 ? totalMonthlyIncome / days : 0;

  // Build a map of date → { expense }
  const dataMap = {};
  transactions.forEach((tx) => {
    const date = tx.transaction_date;
    if (!dataMap[date]) dataMap[date] = { income: 0, expense: 0 };
    const amount = parseFloat(tx.amount);
    // Only count expenses in this chart now; income comes from income_sources
    if (tx.type === 'expense') dataMap[date].expense += amount;
  });

  // Fill every date in the range, showing daily income and actual expenses
  const allDates = generateDateRange(startDate, endDate);
  return allDates.map((date) => ({
    date,
    income: parseFloat(dailyIncome.toFixed(2)),
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
 * Uses income_sources as the official income source (not transactions).
 *
 * @param {string} userId
 * @returns {Promise<{ score: number, breakdown: Object }>}
 */
const getHealthScore = async (userId) => {
  const { month, year } = getCurrentMonthYear();
  const { startDate, endDate } = getMonthDateRange(month, year);

  // Get income from official source
  const totalMonthlyIncome = await incomeRepository.getTotalMonthlyIncome(userId);

  // Fetch only EXPENSE transactions for the current month
  const transactions = await transactionRepository.findByDateRange(
    userId,
    startDate,
    endDate
  );

  let totalExpenses = 0;
  const spentByCategory = {};

  transactions.forEach((tx) => {
    // Only count expenses
    if (tx.type === 'expense') {
      const amount = parseFloat(tx.amount);
      totalExpenses += amount;
      spentByCategory[tx.category] = (spentByCategory[tx.category] || 0) + amount;
    }
  });

  // Fetch budgets for the current month to check adherence
  const budgets = await budgetRepository.findByUserAndMonth(userId, month, year);
  const budgetsWithSpent = budgets.map((b) => ({
    ...b,
    spent: spentByCategory[b.category] || 0,
  }));

  const score = calculateFinancialScore(
    totalMonthlyIncome,
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
