const { validationResult } = require("express-validator");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");

const join = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(statusCode.BAD_REQUEST).json(
            utils.successFalse(responseMessage.VALUE_INVALID, {
                requestParameteError: err.array()
            })
        );
    }
    next();
};

const login = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(statusCode.BAD_REQUEST).json(
            utils.successFalse(responseMessage.VALUE_INVALID, {
                requestParameteError: err.array()
            })
        );
    }
    next();
};

const emailVerify = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(statusCode.BAD_REQUEST).json(
            utils.successFalse(responseMessage.VALUE_INVALID, {
                requestParameteError: err.array()
            })
        );
    }
    next();
};

module.exports = {
    join,
    login,
    emailVerify
};
