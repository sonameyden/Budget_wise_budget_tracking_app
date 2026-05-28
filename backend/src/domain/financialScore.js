/**
 * financialScore.js
 * Pure function that computes a 0–100 Financial Health Score.
 * Completely framework-independent — no DB calls, no HTTP, no side effects.
 * This makes it trivially testable.
 *
 * Scoring breakdown:
 *   - Savings Rate (40 pts): what percentage of income is saved
 *   - Budget Adherence (40 pts): how many budgets are within their limit
 *   - Spending Consistency (20 pts): penalises zero-income or zero-expense months
 */

/**
 * Calculates the financial health score.
 *
 * @param {number} totalIncome    - Total income for the period
 * @param {number} totalExpenses  - Total expenses for the period
 * @param {Array}  budgets        - Array of { limit_amount, spent } budget objects
 * @returns {number} Score between 0 and 100 (integer)
 */
const calculateFinancialScore = (
  totalIncome,
  totalExpenses,
  budgets = [],
  goals = [],
  accountData = {},
  totalSavingsGoals = 0
) => {
  const roundScore = (value) => Math.min(100, Math.max(0, Math.round(value)));
  const budgetLimit = (budget) => parseFloat(budget.limit_amount || 0);
  const budgetSpent = (budget) => parseFloat(budget.spent || 0);

  let score = 0;
  const components = {
    savingsRateScore: 0,
    budgetAdherenceScore: 0,
    goalProgressScore: 0,
    accountRatioScore: 0,
    savingsContributionScore: 0,
    consistencyScore: 0,
  };

  // ── 1. Savings Rate Score (max 20 pts) ──────────────────────────────────
  if (totalIncome > 0) {
    const savingsRate = (totalIncome - totalExpenses) / totalIncome;
    const clampedRate = Math.max(0, Math.min(savingsRate, 1));
    components.savingsRateScore = Math.min(20, (clampedRate / 0.3) * 20);
    score += components.savingsRateScore;
  }

  // ── 2. Budget Adherence Score (max 30 pts) ──────────────────────────────
  if (budgets.length > 0) {
    const totalWeight = budgets.reduce((sum, budget) => sum + Math.max(1, budgetLimit(budget)), 0);
    const weightedScore = budgets.reduce((sum, budget) => {
      const limit = budgetLimit(budget);
      const spent = budgetSpent(budget);
      const adherence = limit > 0 ? Math.max(0, 1 - Math.max(0, spent - limit) / limit) : 1;
      return sum + adherence * Math.max(1, limit);
    }, 0);

    components.budgetAdherenceScore = totalWeight > 0
      ? (weightedScore / totalWeight) * 30
      : 15;
  } else {
    components.budgetAdherenceScore = 15;
  }
  score += components.budgetAdherenceScore;

  // ── 3. Goal Progress Score (max 20 pts) ────────────────────────────────
  if (goals.length > 0) {
    const totalTarget = goals.reduce((sum, goal) => sum + Math.max(0, parseFloat(goal.target_amount || 0)), 0);
    const achieved = goals.reduce((sum, goal) => {
      const target = Math.max(0, parseFloat(goal.target_amount || 0));
      const current = Math.max(0, parseFloat(goal.current_amount || 0));
      return sum + Math.min(current, target);
    }, 0);

    components.goalProgressScore = totalTarget > 0 ? (achieved / totalTarget) * 20 : 10;
  } else {
    components.goalProgressScore = 10;
  }
  score += components.goalProgressScore;

  // ── 4. Account Ratio Score (max 15 pts) ────────────────────────────────
  const totalBalance = parseFloat(accountData.totalBalance || 0);
  const savingsBalance = parseFloat(accountData.savingsBalance || 0);
  if (totalBalance > 0) {
    const savingsRatio = Math.max(0, Math.min(savingsBalance / totalBalance, 1));
    components.accountRatioScore = Math.min(15, (savingsRatio / 0.2) * 15);
  } else {
    components.accountRatioScore = 7;
  }
  score += components.accountRatioScore;

  // ── 5. Savings Contribution Score (max 15 pts) ──────────────────────────
  if (totalSavingsGoals > 0) {
    const contributionRatio = Math.max(0, Math.min((totalIncome - totalExpenses) / totalSavingsGoals, 1));
    components.savingsContributionScore = contributionRatio * 15;
  } else {
    components.savingsContributionScore = 10;
  }
  score += components.savingsContributionScore;

  // ── 6. Spending Consistency Score (max 10 pts) ──────────────────────────
  if (totalIncome > 0 && totalExpenses > 0) {
    components.consistencyScore = 10;
  } else if (totalIncome > 0 || totalExpenses > 0) {
    components.consistencyScore = 5;
  }
  score += components.consistencyScore;

  return {
    score: roundScore(score),
    breakdown: {
      savingsRateScore: roundScore(components.savingsRateScore),
      budgetAdherenceScore: roundScore(components.budgetAdherenceScore),
      goalProgressScore: roundScore(components.goalProgressScore),
      accountRatioScore: roundScore(components.accountRatioScore),
      savingsContributionScore: roundScore(components.savingsContributionScore),
      consistencyScore: roundScore(components.consistencyScore),
    },
  };
};

module.exports = { calculateFinancialScore };
