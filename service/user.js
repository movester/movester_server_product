const jwt = require('../modules/jwt');
const userDao = require('../dao/user');
const encrypt = require('../modules/encrypt');
const emailSender = require('../modules/emailSender');
const CODE = require('../utils/statusCode');
const responseMessage = require('../utils/responseMessage');
const utils = require('../utils/responseForm');
const redis = require('../modules/redis');

const join = async joinUser => {
  try {
    const hashPassword = await encrypt.hash(joinUser.password);

    joinUser.password = hashPassword;
    joinUser.emailVerifyKey = Math.random().toString().substr(2, 6);
    await emailSender.emailVerifySender(joinUser.email, joinUser.emailVerifyKey);
    const result = await userDao.join({ joinUser });
    return result;
  } catch (err) {
    console.log(err);
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const login = async ({ email, password }) => {
  try {
    const user = await userDao.findUserByEmail(email);

    if (!user) {
      return CODE.BAD_REQUEST;
    }

    const isCorrectPassword = await encrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return CODE.NOT_FOUND;
    }

    if (!user.is_email_verify) {
      return CODE.UNAUTHORIZED;
    }

    const token = {
      accessToken: await jwt.signAccessToken({ idx: user.user_idx, email: user.email }),
      refreshToken: await jwt.signRefreshToken({ idx: user.user_idx, email: user.email }),
    };

    redis.set(user.user_idx, token.refreshToken);

    return {
      user: {
        userIdx: user.user_idx,
        email: user.email,
        name: user.name,
      },
      token,
    };
  } catch (err) {
    console.log(err);
    return CODE.INTERNAL_SERVER_ERROR;
  }
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

const logout = async (email, res) => {
  await redis.del(email.toString());

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
  logout,
};
