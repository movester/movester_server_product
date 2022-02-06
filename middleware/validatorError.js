const { validationResult } = require('express-validator');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const join = (req, res, next) => {
  const err = validationResult(req);
  const missDataToSubmit = {
    requestParameteError: err.array(),
  };
  if (!err.isEmpty()) {
    return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.VALUE_INVALID, missDataToSubmit));
  }
  next();
};

const login = (req, res, next) => {
  const err = validationResult(req);
  const missDataToSubmit = {
    requestParameteError: err.array(),
  };
  if (!err.isEmpty()) {
    return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.VALUE_INVALID, missDataToSubmit));
  }
  next();
};

const emailVerify = (req, res, next) => {
  const err = validationResult(req);
  const missDataToSubmit = {
    requestParameteError: err.array(),
  };
  if (!err.isEmpty()) {
    return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.VALUE_INVALID, missDataToSubmit));
  }
  next();
};

module.exports = {
  join,
  login,
  emailVerify,
};
