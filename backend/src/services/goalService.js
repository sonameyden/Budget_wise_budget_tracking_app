/**
 * goalService.js
 * Business logic for savings goal CRUD operations.
 * Handles automatic goal completion detection when funds are added.
 */

const goalRepository = require('../repositories/goalRepository');

/**
 * Get all savings goals for the authenticated user.
 * Enriches each goal with computed fields: percentage, days_left, monthly_needed.
 *
 * @param {string} userId
 * @returns {Promise<Array>}
 */
const getAll = async (userId) => {
  const goals = await goalRepository.findAllByUser(userId);

  return goals.map((goal) => enrichGoal(goal));
};

/**
 * Create a new savings goal.
 *
 * @param {string} userId
 * @param {Object} body - { title, category, target_amount, current_amount, deadline, linked_savings_account_id?, monthly_savings_amount? }
 * @returns {Promise<Object>}
 */
const create = async (userId, body) => {
  const goalData = {
    user_id: userId,
    title: body.title.trim(),
    category: body.category || 'Custom Goal',
    target_amount: parseFloat(body.target_amount),
    current_amount: parseFloat(body.current_amount || 0),
    deadline: body.deadline || null,
    completed: false,
  };
  
  // Link goal to a specific savings account
  if (body.linked_savings_account_id) {
    goalData.linked_savings_account_id = body.linked_savings_account_id;
  }
  
  // Define how much to save per month toward this goal
  if (body.monthly_savings_amount !== undefined) {
    goalData.monthly_savings_amount = parseFloat(body.monthly_savings_amount);
  }

  const goal = await goalRepository.create(goalData);
  return enrichGoal(goal);
};

/**
 * Update a goal (edit details or add funds).
 * Automatically marks the goal as completed if current_amount >= target_amount.
 *
 * @param {string} goalId
 * @param {string} userId
 * @param {Object} body
 * @returns {Promise<Object>}
 */
const update = async (goalId, userId, body) => {
  const goal = await goalRepository.findById(goalId);

  if (!goal) {
    const err = new Error('Goal not found.');
    err.status = 404;
    throw err;
  }

  if (goal.user_id !== userId) {
    const err = new Error('You do not have permission to update this goal.');
    err.status = 403;
    throw err;
  }

  const updates = {};
  if (body.title !== undefined) updates.title = body.title.trim();
  if (body.target_amount !== undefined) updates.target_amount = parseFloat(body.target_amount);
  if (body.deadline !== undefined) updates.deadline = body.deadline;
  if (body.linked_savings_account_id !== undefined) updates.linked_savings_account_id = body.linked_savings_account_id;
  if (body.monthly_savings_amount !== undefined) updates.monthly_savings_amount = parseFloat(body.monthly_savings_amount);

  // When adding funds, update current_amount and auto-detect completion
  if (body.current_amount !== undefined) {
    updates.current_amount = parseFloat(body.current_amount);
    const targetAmount = body.target_amount
      ? parseFloat(body.target_amount)
      : goal.target_amount;

    // Auto-complete when the goal is fully funded
    updates.completed = updates.current_amount >= targetAmount;
  }

  const updatedGoal = await goalRepository.update(goalId, updates);
  return enrichGoal(updatedGoal);
};

/**
 * Delete a goal — verifies ownership.
 *
 * @param {string} goalId
 * @param {string} userId
 * @returns {Promise<void>}
 */
const remove = async (goalId, userId) => {
  const goal = await goalRepository.findById(goalId);

  if (!goal) {
    const err = new Error('Goal not found.');
    err.status = 404;
    throw err;
  }

  if (goal.user_id !== userId) {
    const err = new Error('You do not have permission to delete this goal.');
    err.status = 403;
    throw err;
  }

  return goalRepository.remove(goalId);
};

/**
 * Enriches a raw goal record with computed display fields.
 * These are pure calculations — no DB calls.
 *
 * @param {Object} goal - Raw goal row from the database
 * @returns {Object} Goal with percentage, days_left, monthly_needed added
 */
const enrichGoal = (goal) => {
  const current = parseFloat(goal.current_amount) || 0;
  const target = parseFloat(goal.target_amount) || 1;

  // Percentage progress — capped at 100%
  const percentage = Math.min(100, Math.round((current / target) * 100));

  // Days remaining until deadline
  let daysLeft = null;
  let monthlyNeeded = null;

  if (goal.deadline) {
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const msPerDay = 1000 * 60 * 60 * 24;
    daysLeft = Math.max(0, Math.ceil((deadline - today) / msPerDay));

    // How much needs to be saved per month to reach the goal in time
    if (daysLeft > 0) {
      const remaining = Math.max(0, target - current);
      const monthsLeft = daysLeft / 30;
      monthlyNeeded = monthsLeft > 0 ? Math.ceil(remaining / monthsLeft) : remaining;
    }
  }

  return {
    ...goal,
    percentage,
    days_left: daysLeft,
    monthly_needed: monthlyNeeded,
  };
};

module.exports = { getAll, create, update, remove };
