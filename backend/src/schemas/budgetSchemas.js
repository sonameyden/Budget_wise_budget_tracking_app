/**
 * budgetSchemas.js
 * Validation chains for budget create and update routes.
 */

const { body } = require('express-validator');
const { CATEGORIES } = require('../domain/constants');

/** Rules for POST /api/budgets */
const createBudgetSchema = [
  body('category')
    .notEmpty().withMessage('Category is required.')
    .isIn(CATEGORIES).withMessage('Category must be one of the valid categories.'),

  body('limit_amount')
    .notEmpty().withMessage('Limit amount is required.')
    .isFloat({ gt: 0 }).withMessage('Limit amount must be a positive number.'),

  body('month')
    .notEmpty().withMessage('Month is required.')
    .isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12.'),

  body('year')
    .notEmpty().withMessage('Year is required.')
    .isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid 4-digit year.'),
];

/** Rules for PUT /api/budgets/:id */
const updateBudgetSchema = [
  body('limit_amount')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Limit amount must be a positive number.'),

  body('month')
    .optional()
    .isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12.'),

  body('year')
    .optional()
    .isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid 4-digit year.'),
];

module.exports = { createBudgetSchema, updateBudgetSchema };
