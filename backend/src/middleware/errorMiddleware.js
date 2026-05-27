/**
 * errorMiddleware.js
 * Global error-handling middleware — MUST be the last app.use() in server.js.
 *
 * EXPRESS 5 UPGRADE BENEFIT:
 * In Express 4, every async controller needed:
 *   try { ... } catch(err) { next(err) }
 *
 * In Express 5, any unhandled promise rejection inside a route handler or
 * middleware is automatically forwarded to this error handler — so controllers
 * are now clean async functions with zero boilerplate error routing.
 *
 * The four-parameter signature (err, req, res, next) is REQUIRED — Express
 * identifies this as an error handler by the arity. This is unchanged in v5.
 */

const config = require('../config/env');

/**
 * Centralised error handler — catches everything:
 *   - Errors thrown in services/repositories
 *   - Express 5 auto-forwarded async rejections from controllers
 *   - Validation errors escalated manually (e.g. from authMiddleware)
 *
 * @param {Error}  err
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next - Required for Express to
 *   recognise this as an error handler (even though it's not called here)
 */
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  // Always log full stack server-side — never send it to the client
  console.error(`[Error] ${req.method} ${req.path} — ${err.message}`);
  if (config.isDev) console.error(err.stack);

  // Use the error's explicit HTTP status if set (from services), else 500
  const status = err.status || err.statusCode || 500;

  // Development: expose real message for easier debugging
  // Production: generic message so internals are never leaked to clients
  const message =
    config.isDev && err.message
      ? err.message
      : 'An unexpected error occurred. Please try again.';

  // EXPRESS 5: always use res.status().json() — combined signatures removed
  return res.status(status).json({
    success: false,
    message,
  });
};

module.exports = errorMiddleware;
