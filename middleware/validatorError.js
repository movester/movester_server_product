const { validationResult } = require('express-validator');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const err = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.VALUE_INVALID, err.array()));
  }
  next();
};

module.exports = {
  err,
};
