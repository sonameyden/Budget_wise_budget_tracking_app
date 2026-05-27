const { body } = require('express-validator');
const { ACCOUNT_TYPES } = require('../domain/constants');

const createAccountSchema = [
  body('account_name').trim().notEmpty().withMessage('Account name is required.')
    .isLength({ max: 100 }).withMessage('Max 100 characters.'),
  body('account_type').notEmpty().withMessage('Account type is required.')
    .isIn(ACCOUNT_TYPES).withMessage('Invalid account type.'),
  body('current_balance').optional()
    .isFloat({ min: 0 }).withMessage('Balance must be >= 0.'),
  body('color_theme').optional().isLength({ max: 20 }),
  body('icon').optional().isLength({ max: 10 }),
  body('description').optional().isLength({ max: 300 }),
];

const updateAccountSchema = [
  body('account_name').optional().trim().isLength({ max: 100 }),
  body('current_balance').optional().isFloat().withMessage('Invalid balance.'),
  body('color_theme').optional().isLength({ max: 20 }),
  body('icon').optional().isLength({ max: 10 }),
  body('description').optional().isLength({ max: 300 }),
];

module.exports = { createAccountSchema, updateAccountSchema };
