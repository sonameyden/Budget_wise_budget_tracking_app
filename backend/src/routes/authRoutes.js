/**
 * authRoutes.js
 * Routes for user registration, login, and profile retrieval.
 * Auth routes use the stricter authLimiter to prevent brute-force attacks.
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');
const { registerSchema, loginSchema } = require('../schemas/authSchemas');

// POST /api/auth/register — create a new user account
router.post(
  '/register',
  authLimiter,          // Rate limit: 10 requests / 15 min per IP
  registerSchema,       // Validation chain (name, email, password rules)
  validateMiddleware,   // Check results — return 400 if invalid
  authController.register
);

// POST /api/auth/login — authenticate and receive JWT
router.post(
  '/login',
  authLimiter,
  loginSchema,
  validateMiddleware,
  authController.login
);

// GET /api/auth/me — return the currently authenticated user
router.get(
  '/me',
  authMiddleware,       // Verify JWT — attaches req.user
  authController.getMe
);

// GET /api/auth/export-data — export the user's data as JSON or CSV
router.get(
  '/export-data',
  authMiddleware,
  authController.exportData
);

// DELETE /api/auth/me — delete the currently authenticated user's account
router.delete(
  '/me',
  authMiddleware,
  authController.deleteMe
);

module.exports = router;
