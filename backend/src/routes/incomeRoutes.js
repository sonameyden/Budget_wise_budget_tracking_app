/**
 * incomeRoutes.js — all income source endpoints, all protected.
 */
const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/incomeController');
const auth     = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createIncomeSchema,
  updateIncomeSchema,
} = require('../schemas/incomeSchemas');

router.use(auth);

// GET    /api/income          — list (optional ?status=active|paused|ended)
router.get('/',    ctrl.index);

// POST   /api/income          — create income source
router.post('/',   createIncomeSchema, validate, ctrl.create);

// PUT    /api/income/:id      — update income source
router.put('/:id', updateIncomeSchema, validate, ctrl.update);

// DELETE /api/income/:id      — delete income source
router.delete('/:id', ctrl.destroy);

module.exports = router;
