/**
 * goalSchemas.js
 * Validation chains for savings goal create and update routes.
 */

const { body } = require('express-validator');

/** Rules for POST /api/goals */
const createGoalSchema = [
  body('title')
    .trim()
    .notEmpty().withMessage('Goal title is required.')
    .isLength({ max: 200 }).withMessage('Title must be under 200 characters.'),

  body('target_amount')
    .notEmpty().withMessage('Target amount is required.')
    .isFloat({ gt: 0 }).withMessage('Target amount must be a positive number.'),

  body('category')
    .optional()
    .isLength({ max: 50 }).withMessage('Category must be under 50 characters.'),

  body('deadline')
    .optional()
    .isISO8601().withMessage('Deadline must be a valid date (YYYY-MM-DD).'),

  body('current_amount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Current amount cannot be negative.'),
];

/** Rules for PUT /api/goals/:id */
const updateGoalSchema = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Title must be under 200 characters.'),

  body('target_amount')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Target amount must be a positive number.'),

  body('current_amount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Current amount cannot be negative.'),

  body('deadline')
    .optional()
    .isISO8601().withMessage('Deadline must be a valid date (YYYY-MM-DD).'),

  body('completed')
    .optional()
    .isBoolean().withMessage('Completed must be a boolean.'),
];

module.exports = { createGoalSchema, updateGoalSchema };
