const jwt = require('jsonwebtoken');
const userDao = require('../dao/user');
const encrypt = require('../modules/encrypt');
const emailSender = require('../modules/emailSender');
const CODE = require('../utils/statusCode');
const responseMessage = require('../utils/responseMessage');
const utils = require('../utils/responseForm');
const auth = require('../middleware/auth');
const redisClient = require('../config/redis');

const join = async joinUser => {
  try {
    const hashPassword = await encrypt.hash(joinUser.password);

    joinUser.password = hashPassword;
    joinUser.emailVerifyKey = Math.random().toString().substr(2, 6);
    await emailSender.emailVerifySender(joinUser.email, joinUser.emailVerifyKey);
    // TODO: emailSender error handling
    const result = await userDao.join({ joinUser });
    return result;
  } catch (err) {
    console.log(err)
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const login = async ({ loginUser }, res) => {
  const daoRow = await userDao.login(loginUser.email);
  if (!daoRow) {
    const isLoginSuccess = res.status(CODE.DB_ERROR).json(utils.fail(responseMessage.DB_ERROR));
    return isLoginSuccess;
  }
  if (Object.keys(daoRow).length === 0) {
    const isLoginSuccess = res.status(CODE.BAD_REQUEST).json(utils.fail(responseMessage.EMAIL_NOT_EXIST));
    return isLoginSuccess;
  }
  const hashPassword = daoRow[0].password;
  const isCorrectPassword = await encrypt.compare(loginUser.password, hashPassword);

  // TODO : 0 과 false 는 둘 다 falsy 한 값으로 명확한 네이밍으로 수정 필요
  if (isCorrectPassword === 0) {
    const isLoginSuccess = res.status(CODE.INTERNAL_SERVER_ERROR).json(utils.fail(responseMessage.ENCRYPT_ERROR));
    return isLoginSuccess;
  }

  if (isCorrectPassword === false) {
    const isLoginSuccess = res.status(CODE.BAD_REQUEST).json(utils.fail(responseMessage.PW_MISMATCH));
    return isLoginSuccess;
  }
  if (!daoRow[0].is_email_verify) {
    const isLoginSuccess = res.status(CODE.BAD_REQUEST).json(utils.fail(responseMessage.EMAIL_VERIFY_NOT));
    return isLoginSuccess;
  }

  const accessToken = jwt.sign({ sub: loginUser.email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TIME,
  });
  const refreshToken = auth.generateRefreshToken(loginUser.email);

  const dataToSubmit = {
    accessToken,
    refreshToken,
    isAuth: true,
  };

  const isLoginSuccess = res.status(CODE.OK).json(utils.success(responseMessage.LOGIN_SUCCESS, dataToSubmit));
  return isLoginSuccess;
};

const findUserByEmail = async email => {
  try {
    const result = await userDao.findUserByEmail(email);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const emailVerify = async (email, emailVerifyKey, res) => {
  const isExistUser = await findUserByEmail(email);
  if (!isExistUser) {
    const isEmailVerifySuccess = res.status(CODE.DB_ERROR).json(utils.fail(responseMessage.DB_ERROR));
    return isEmailVerifySuccess;
  }
  if (Object.keys(isExistUser).length === 0) {
    const isEmailVerifySuccess = res.status(CODE.BAD_REQUEST).json(utils.fail(responseMessage.EMAIL_NOT_EXIST));
    return isEmailVerifySuccess;
  }
  if (isExistUser[0].is_email_verify) {
    const isEmailVerifySuccess = res.status(CODE.BAD_REQUEST).json(utils.fail(responseMessage.EMAIL_VERIFY_ALREADY));
    return isEmailVerifySuccess;
  }
  if (isExistUser[0].email_verify_key !== emailVerifyKey) {
    const isEmailVerifySuccess = res
      .status(CODE.BAD_REQUEST)
      .json(utils.fail(responseMessage.EMAIL_VERIFY_KEY_MISMATCH));
    return isEmailVerifySuccess;
  }
  const daoRow = await userDao.emailVerify(email, emailVerifyKey);
  if (!daoRow) {
    const isEmailVerifySuccess = res.status(CODE.DB_ERROR).json(utils.fail(responseMessage.DB_ERROR));
    return isEmailVerifySuccess;
  }
  const isEmailVerifySuccess = res.status(CODE.OK).json(utils.success(responseMessage.EMAIL_VERIFY_SUCCESS));
  return isEmailVerifySuccess;
};

const reissueAccessToken = (email, res) => {
  const accessToken = jwt.sign({ sub: email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TIME,
  });
  const refreshToken = auth.generateRefreshToken(email);

  const token = {
    accessToken,
    refreshToken,
  };

  const isReissueAccessToken = res
    .status(CODE.OK)
    .json(utils.success(responseMessage.TOKEN_GENERATE_REFRESH_SUCCESS, token));
  return isReissueAccessToken;
};

const logout = async (email, res) => {
  await redisClient.del(email.toString());

  const dataToSubmit = {
    isAuth: false,
  };

  const isLogoutSuccess = res.status(CODE.OK).json(utils.success(responseMessage.LOGOUT_SUCCESS, dataToSubmit));
  return isLogoutSuccess;
};
module.exports = {
  join,
  login,
  findUserByEmail,
  emailVerify,
  reissueAccessToken,
  logout,
};
