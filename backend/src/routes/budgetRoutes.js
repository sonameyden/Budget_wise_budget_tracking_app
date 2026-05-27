/**
 * budgetRoutes.js
 * All budget CRUD routes — all protected by authMiddleware.
 */

const express = require('express');
const router = express.Router();

const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');
const {
  createBudgetSchema,
  updateBudgetSchema,
} = require('../schemas/budgetSchemas');

// All budget routes require a valid JWT
router.use(authMiddleware);

// GET    /api/budgets       — list budgets for current (or specified) month
router.get('/', budgetController.index);

// POST   /api/budgets       — create a new budget
router.post(
  '/',
  createBudgetSchema,
  validateMiddleware,
  budgetController.create
);

// PUT    /api/budgets/:id   — update a budget limit
router.put(
  '/:id',
  updateBudgetSchema,
  validateMiddleware,
  budgetController.update
);

// DELETE /api/budgets/:id   — delete a budget
router.delete('/:id', budgetController.destroy);

module.exports = router;
