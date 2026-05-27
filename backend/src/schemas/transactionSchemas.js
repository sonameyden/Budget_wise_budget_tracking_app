/**
 * transactionSchemas.js
 * Validation chains for transaction create and update routes.
 */

const { body } = require('express-validator');
const { CATEGORIES, TRANSACTION_TYPES, PAYMENT_METHODS } = require('../domain/constants');

/**
 * Shared validation rules used by both create and update.
 */
const transactionRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .isLength({ max: 200 }).withMessage('Title must be under 200 characters.'),

  body('amount')
    .notEmpty().withMessage('Amount is required.')
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),

  body('type')
    .notEmpty().withMessage('Type is required.')
    .isIn(Object.values(TRANSACTION_TYPES))
    .withMessage(`Type must be one of: ${Object.values(TRANSACTION_TYPES).join(', ')}.`),

  body('category')
    .notEmpty().withMessage('Category is required.')
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of the valid categories.`),

  body('transaction_date')
    .notEmpty().withMessage('Date is required.')
    .isISO8601().withMessage('Date must be a valid date (YYYY-MM-DD).'),

  body('payment_method')
    .optional()
    .isIn(PAYMENT_METHODS)
    .withMessage(`Payment method must be one of: ${PAYMENT_METHODS.join(', ')}.`),

  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes must be under 500 characters.'),
];

/** Rules for POST /api/transactions */
const createTransactionSchema = transactionRules;

/** Rules for PUT /api/transactions/:id — same rules, all optional */
const updateTransactionSchema = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Title must be under 200 characters.'),

  body('amount')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),

  body('type')
    .optional()
    .isIn(Object.values(TRANSACTION_TYPES))
    .withMessage(`Type must be one of: ${Object.values(TRANSACTION_TYPES).join(', ')}.`),

  body('category')
    .optional()
    .isIn(CATEGORIES)
    .withMessage('Category must be one of the valid categories.'),

  body('transaction_date')
    .optional()
    .isISO8601().withMessage('Date must be a valid date (YYYY-MM-DD).'),

  body('payment_method')
    .optional()
    .isIn(PAYMENT_METHODS)
    .withMessage(`Payment method must be one of: ${PAYMENT_METHODS.join(', ')}.`),

  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes must be under 500 characters.'),
];

module.exports = { createTransactionSchema, updateTransactionSchema };
