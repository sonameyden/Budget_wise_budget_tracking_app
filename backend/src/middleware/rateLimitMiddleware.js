/**
 * rateLimitMiddleware.js
 * Rate limiting middleware using express-rate-limit.
 *
 * Two limiters are exported:
 *   - apiLimiter:  General API protection (100 req / 15 min per IP)
 *   - authLimiter: Stricter limit on login/register (10 req / 15 min per IP)
 *                  Prevents brute-force attacks on credentials.
 */

const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter — applied to all /api/* routes.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests per IP per window
  standardHeaders: true,     // Return rate-limit info in RateLimit-* headers
  legacyHeaders: false,      // Disable the X-RateLimit-* headers
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
});

/**
 * Auth-specific rate limiter — applied only to /api/auth/login and /api/auth/register.
 * Much stricter to slow down brute-force attacks.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      'Too many login attempts from this IP. Please try again in 15 minutes.',
  },
});

module.exports = { apiLimiter, authLimiter };
