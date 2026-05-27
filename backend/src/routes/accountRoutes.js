/**
 * accountRoutes.js — all account endpoints, all protected.
 */
const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/accountController');
const auth       = require('../middleware/authMiddleware');
const validate   = require('../middleware/validateMiddleware');
const { body }   = require('express-validator');
const {
  createAccountSchema,
  updateAccountSchema,
} = require('../schemas/accountSchemas');

router.use(auth);

// GET  /api/accounts          — list all accounts (enriched with monthly income)
router.get('/',           ctrl.index);

// GET  /api/accounts/net-worth — total balance + monthly income summary
router.get('/net-worth',  ctrl.netWorth);

// POST /api/accounts          — create account
router.post('/',          createAccountSchema, validate, ctrl.create);

// PUT  /api/accounts/:id      — update account
router.put('/:id',        updateAccountSchema, validate, ctrl.update);

// POST /api/accounts/transfer — transfer between two accounts
router.post('/transfer', [
  body('from_account_id').isUUID().withMessage('Invalid from account.'),
  body('to_account_id').isUUID().withMessage('Invalid to account.'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be > 0.'),
], validate, ctrl.transfer);

// DELETE /api/accounts/:id    — delete account
router.delete('/:id',     ctrl.destroy);

module.exports = router;
