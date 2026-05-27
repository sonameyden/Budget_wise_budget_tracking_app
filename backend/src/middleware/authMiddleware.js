/**
 * authMiddleware.js
 * Verifies the JWT Bearer token on every protected route.
 * On success, attaches the decoded user to req.user.
 * On failure, returns 401 immediately.
 *
 * EXPRESS 5 NOTE: This middleware calls next() and next(err) explicitly
 * because it contains synchronous guard clauses (sendError returns early).
 * The async DB lookup (userRepository.findById) is still auto-caught by
 * Express 5 if it throws — no manual try/catch needed around it.
 */

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userRepository = require('../repositories/userRepository');
const { sendError } = require('../utils/responseHelper');

/**
 * Protects routes — must be used before any controller that needs req.user.
 * Usage: router.get('/protected', authMiddleware, controller)
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const authMiddleware = async (req, res, next) => {
  // Extract Bearer token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Access denied. No token provided.', 401);
  }

  const token = authHeader.split(' ')[1];

  // Verify token signature and expiry — wrap in try/catch because
  // jwt.verify throws synchronously on invalid tokens
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (jwtError) {
    const message =
      jwtError.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid token. Please log in again.';
    return sendError(res, message, 401);
  }

  // Fetch user from DB — Express 5 auto-catches if this rejects
  const user = await userRepository.findById(decoded.userId);

  if (!user) {
    return sendError(res, 'User not found. Please log in again.', 401);
  }

  // Attach sanitised user (no password hash) for use in controllers
  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    currency: user.currency,
    theme: user.theme,
  };

  return next();
};

module.exports = authMiddleware;
