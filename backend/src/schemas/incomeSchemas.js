const { body } = require('express-validator');
const { INCOME_FREQUENCIES, INCOME_CATEGORIES, INCOME_STATUSES } = require('../domain/constants');

const createIncomeSchema = [
  body('source_name').trim().notEmpty().withMessage('Source name is required.')
    .isLength({ max: 100 }),
  body('income_amount').notEmpty().withMessage('Amount is required.')
    .isFloat({ min: 0 }).withMessage('Amount must be >= 0.'),
  body('frequency').optional().isIn(INCOME_FREQUENCIES).withMessage('Invalid frequency.'),
  body('category').optional().isIn(INCOME_CATEGORIES).withMessage('Invalid category.'),
  body('employer').optional().isLength({ max: 100 }),
  body('start_date').optional().isISO8601().withMessage('Invalid date.'),
  body('status').optional().isIn(INCOME_STATUSES),
  body('notes').optional().isLength({ max: 500 }),
  body('account_id').optional().isUUID().withMessage('Invalid account ID.'),
];

const updateIncomeSchema = [
  body('source_name').optional().trim().isLength({ max: 100 }),
  body('income_amount').optional().isFloat({ min: 0 }),
  body('frequency').optional().isIn(INCOME_FREQUENCIES),
  body('category').optional().isIn(INCOME_CATEGORIES),
  body('status').optional().isIn(INCOME_STATUSES),
  body('employer').optional().isLength({ max: 100 }),
  body('notes').optional().isLength({ max: 500 }),
];

module.exports = { createIncomeSchema, updateIncomeSchema };
