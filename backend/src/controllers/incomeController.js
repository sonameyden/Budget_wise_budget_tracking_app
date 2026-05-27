/**
 * incomeController.js — thin controller. Express 5 async auto-catch.
 */
const incomeService  = require('../services/incomeService');
const { sendSuccess } = require('../utils/responseHelper');

const index   = async (req, res) => {
  const sources = await incomeService.getAll(req.user.id, req.query.status);
  return sendSuccess(res, { sources });
};

const create  = async (req, res) => {
  const source = await incomeService.create(req.user.id, req.body);
  return sendSuccess(res, { source }, 201);
};

const update  = async (req, res) => {
  const source = await incomeService.update(req.params.id, req.user.id, req.body);
  return sendSuccess(res, { source });
};

const destroy = async (req, res) => {
  await incomeService.remove(req.params.id, req.user.id);
  return sendSuccess(res, { message: 'Income source deleted.' });
};

module.exports = { index, create, update, destroy };
