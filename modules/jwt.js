const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const signAccessToken = async user => jwt.sign(user, jwtConfig.secretKey, jwtConfig.option);

const signRefreshToken = async user => jwt.sign(user, jwtConfig.refeshSecretKey, jwtConfig.refeshOption);

const verifyAccessToken = async token => {
  try {
    return jwt.verify(token, jwtConfig.secretKey);
  } catch (err) {
    console.log('token invalid');
  }
};

const verifyRefeshToken = async token => {
  try {
    return jwt.verify(token, jwtConfig.refeshSecretKey);
  } catch (err) {
    console.log('token invalid');
  }
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefeshToken,
};
