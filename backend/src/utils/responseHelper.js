/**
 * responseHelper.js
 * Centralised helpers for sending consistent JSON responses.
 * All controllers must use these instead of calling res.json() directly,
 * so the response envelope shape is always the same.
 *
 * Success envelope:  { success: true,  data: <payload> }
 * Error envelope:    { success: false, message: <string>, errors: <array|null> }
 */

/**
 * Send a successful JSON response.
 * @param {import('express').Response} res - Express response object
 * @param {*} data - The payload to return to the client
 * @param {number} [status=200] - HTTP status code
 */
const sendSuccess = (res, data, status = 200) => {
  return res.status(status).json({
    success: true,
    data,
  });
};

/**
 * Send an error JSON response.
 * @param {import('express').Response} res - Express response object
 * @param {string} message - Human-readable error message (client-safe)
 * @param {number} [status=400] - HTTP status code
 * @param {Array} [errors=null] - Optional array of field-level validation errors
 */
const sendError = (res, message, status = 400, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(status).json(body);
};

module.exports = { sendSuccess, sendError };
