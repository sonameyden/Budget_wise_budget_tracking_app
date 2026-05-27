/**
 * loggingMiddleware.js
 * Structured HTTP request/response logger using morgan.
 * In development: colourised, human-readable 'dev' format.
 * In production:  'combined' Apache format (compatible with log aggregators).
 *
 * Import and register this early in server.js — before routes.
 */

const morgan = require('morgan');
const config = require('../config/env');

// Use compact coloured output in dev, full combined format in production
const loggingMiddleware = morgan(config.isDev ? 'dev' : 'combined');

module.exports = loggingMiddleware;
