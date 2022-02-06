const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const signAccessToken = async user => jwt.sign(user, jwtConfig.secretKey, jwtConfig.option);

const signRefreshToken = async user => jwt.sign(user, jwtConfig.refeshSecretKey, jwtConfig.refeshOption);

const verifyAccessToken = async token => {
  try {
    return jwt.verify(token, jwtConfig.secretKey);
  } catch (err) {
    if (err.message === 'jwt expired') {
      return TOKEN_EXPIRED;
    }
    if (err.message === 'invalid token') {
      return TOKEN_INVALID;
    }
    return TOKEN_INVALID;
  }
};

const verifyRefeshToken = async token => {
  try {
    return jwt.verify(token, jwtConfig.refeshSecretKey);
  } catch (err) {
    if (err.message === 'jwt expired') {
      return TOKEN_EXPIRED;
    }
    if (err.message === 'invalid token') {
      return TOKEN_INVALID;
    }
    return TOKEN_INVALID;
  }
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefeshToken,
};
