/**
 * validateMiddleware.js
 * Reads express-validator results and blocks the request if any field is invalid.
 * Returns a structured 400 with an array of { field, message } error objects.
 *
 * EXPRESS 5 NOTE: This middleware is synchronous — Express 5's async
 * auto-catching only applies to async functions. Sync middleware works
 * identically to Express 4. No changes needed here beyond removing
 * the unnecessary else branch.
 *
 * Usage in routes (place AFTER the schema array):
 *   router.post('/', createSchema, validateMiddleware, controller)
 */

const { validationResult } = require('express-validator');
const { sendError } = require('../utils/responseHelper');

/**
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const validateMiddleware = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    // Map to clean shape: [{ field: 'email', message: 'Invalid email' }]
    const errors = result.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    // Return early — controller is never called
    return sendError(
      res,
      'Validation failed. Please check your input.',
      400,
      errors
    );
  }

  return next();
};

module.exports = validateMiddleware;
