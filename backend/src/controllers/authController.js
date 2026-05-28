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

const csvEscape = (value) => {
  if (value === undefined || value === null) return '';
  const escaped = String(value).replace(/"/g, '""');
  return `"${escaped}"`;
};

const formatCsv = (items) => {
  if (!Array.isArray(items) || items.length === 0) return '';
  const keys = Object.keys(items[0]);
  const rows = items.map((item) => keys.map((key) => csvEscape(item[key])).join(','));
  return [keys.join(','), ...rows].join('\n');
};

const exportDataResponse = (userData, format) => {
  if (format === 'csv') {
    const sections = [];

    if (userData.user) {
      sections.push('## user');
      sections.push(formatCsv([userData.user]));
    }

    Object.entries(userData).forEach(([key, value]) => {
      if (key === 'user') return;
      sections.push(`## ${key}`);
      sections.push(Array.isArray(value) ? formatCsv(value) : JSON.stringify(value, null, 2));
    });

    return sections.join('\n\n');
  }

  return JSON.stringify(userData, null, 2);
};

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

const exportData = async (req, res) => {
  const { format } = req.query;
  const userData = await authService.exportUserData(req.user.id);
  const fileFormat = format === 'csv' ? 'csv' : 'json';
  const exported = exportDataResponse(userData, fileFormat);

  res.setHeader('Content-Disposition', `attachment; filename="budgetwise-export.${fileFormat}"`);
  res.type(fileFormat === 'csv' ? 'text/csv' : 'application/json');
  return res.send(exported);
};

const deleteMe = async (req, res) => {
  await authService.deleteAccount(req.user.id);
  return sendSuccess(res, { message: 'Account deleted successfully.' });
};

module.exports = { register, login, getMe, exportData, deleteMe };
