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
const calculateFinancialScore = (totalIncome, totalExpenses, budgets = []) => {
  let score = 0;

  // ── 1. Savings Rate Score (max 40 pts) ──────────────────────────────────
  // Full 40 pts for saving ≥30% of income. Proportional below that.
  if (totalIncome > 0) {
    const savingsRate = (totalIncome - totalExpenses) / totalIncome;
    const clampedRate = Math.max(0, Math.min(savingsRate, 1));
    // 30% savings rate = full 40 pts; scale proportionally below
    score += Math.min(40, (clampedRate / 0.3) * 40);
  }

  // ── 2. Budget Adherence Score (max 40 pts) ───────────────────────────────
  // Each budget within its limit contributes equally to 40 pts total.
  if (budgets.length > 0) {
    const withinBudget = budgets.filter(
      (b) => (b.spent || 0) <= b.limit_amount
    ).length;
    score += (withinBudget / budgets.length) * 40;
  } else {
    // No budgets set — award half marks (neutral, not penalised)
    score += 20;
  }

  // ── 3. Spending Consistency Score (max 20 pts) ──────────────────────────
  // Both income and expenses recorded = good financial tracking habits.
  if (totalIncome > 0 && totalExpenses > 0) {
    score += 20;
  } else if (totalIncome > 0 || totalExpenses > 0) {
    score += 10; // Some activity
  }

  // Return as a rounded integer between 0 and 100
  return Math.min(100, Math.max(0, Math.round(score)));
};

module.exports = { calculateFinancialScore };
