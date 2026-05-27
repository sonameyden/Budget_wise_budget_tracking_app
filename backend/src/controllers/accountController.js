/**
 * accountController.js — thin controller, no business logic.
 * Express 5: no try/catch needed.
 */
const accountService = require('../services/accountService');
const { sendSuccess }  = require('../utils/responseHelper');

const index    = async (req, res) => {
  const accounts = await accountService.getAll(req.user.id);
  return sendSuccess(res, { accounts });
};

const netWorth = async (req, res) => {
  const data = await accountService.getNetWorth(req.user.id);
  return sendSuccess(res, data);
};

const create   = async (req, res) => {
  const account = await accountService.create(req.user.id, req.body);
  return sendSuccess(res, { account }, 201);
};

const update   = async (req, res) => {
  const account = await accountService.update(req.params.id, req.user.id, req.body);
  return sendSuccess(res, { account });
};

const transfer = async (req, res) => {
  const { from_account_id, to_account_id, amount } = req.body;
  const result = await accountService.transfer(
    from_account_id, to_account_id, parseFloat(amount), req.user.id
  );
  return sendSuccess(res, result);
};

const destroy  = async (req, res) => {
  await accountService.remove(req.params.id, req.user.id);
  return sendSuccess(res, { message: 'Account deleted.' });
};

module.exports = { index, netWorth, create, update, transfer, destroy };
