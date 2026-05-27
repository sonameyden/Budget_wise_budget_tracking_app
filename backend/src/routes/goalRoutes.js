/**
 * goalRoutes.js
 * All savings goal CRUD routes — all protected by authMiddleware.
 */

const express = require('express');
const router = express.Router();

const goalController = require('../controllers/goalController');
const authMiddleware = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');
const { createGoalSchema, updateGoalSchema } = require('../schemas/goalSchemas');

// All goal routes require a valid JWT
router.use(authMiddleware);

// GET    /api/goals       — list all goals for the user
router.get('/', goalController.index);

// POST   /api/goals       — create a new goal
router.post(
  '/',
  createGoalSchema,
  validateMiddleware,
  goalController.create
);

// PUT    /api/goals/:id   — update goal details or add funds
router.put(
  '/:id',
  updateGoalSchema,
  validateMiddleware,
  goalController.update
);

// DELETE /api/goals/:id   — delete a goal
router.delete('/:id', goalController.destroy);

module.exports = router;
