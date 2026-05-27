/**
 * authController.js
 * Thin controller for authentication routes.
 *
 * EXPRESS 5 CHANGE: No try/catch blocks needed.
 * If authService throws (e.g. wrong password, duplicate email),
 * Express 5 automatically catches the rejected promise and forwards
 * the error to errorMiddleware. Controllers stay clean and flat.
 */

const authService = require('../services/authService');
const { sendSuccess } = require('../utils/responseHelper');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const { token, user } = await authService.register({ name, email, password });
  return sendSuccess(res, { token, user }, 201);
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await authService.login(email, password);
  return sendSuccess(res, { token, user });
};

/**
 * @route   GET /api/auth/me
 * @desc    Return the currently authenticated user's profile
 * @access  Protected
 */
const getMe = (req, res) => {
  // req.user is attached by authMiddleware — synchronous, no await needed
  return sendSuccess(res, { user: req.user });
};

module.exports = { register, login, getMe };
