/**
 * transactionRoutes.js
 * All transaction CRUD routes — all protected by authMiddleware.
 */

const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');
const {
  createTransactionSchema,
  updateTransactionSchema,
} = require('../schemas/transactionSchemas');

// All transaction routes require a valid JWT
router.use(authMiddleware);

// GET  /api/transactions       — list with optional filters
router.get('/', transactionController.index);

// POST /api/transactions       — create a new transaction
router.post(
  '/',
  createTransactionSchema,
  validateMiddleware,
  transactionController.create
);

// PUT  /api/transactions/:id   — update an existing transaction
router.put(
  '/:id',
  updateTransactionSchema,
  validateMiddleware,
  transactionController.update
);

// DELETE /api/transactions/:id — delete a transaction
router.delete('/:id', transactionController.destroy);

module.exports = router;
