const jwt = require('../modules/jwt');
const userDao = require('../dao/user');
const encrypt = require('../modules/encrypt');
const emailSender = require('../modules/emailSender');
const CODE = require('../utils/statusCode');
const redis = require('../modules/redis');

const EMAIL_AUTH_TYPE = {
  JOIN: 1,
  PASSWORD_RESET: 2
}

const sendEmail = async (userIdx, email, type) => {
  try {
    const emailAuthNum = Math.floor(Math.random() * (999999 - 100000) + 100000);

    await userDao.setEmailAuthNum(userIdx, emailAuthNum, type);
    await emailSender.emailAuthSender(email, emailAuthNum, type);
  } catch (err) {
    console.log('Service Error: sendEmail ', err);
    throw new Error(err);
  }
};

const join = async joinUser => {
  try {
    const hashPassword = await encrypt.hash(joinUser.password);
    joinUser.password = hashPassword;

    const userIdx = await userDao.join({ joinUser });
    sendEmail(userIdx, joinUser.email, EMAIL_AUTH_TYPE.JOIN);
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

    if (!user.isEmailAuth) {
      return CODE.UNAUTHORIZED;
    }

    const token = {
      accessToken: await jwt.signAccessToken({ idx: user.userIdx, email: user.email }),
      refreshToken: await jwt.signRefreshToken({ idx: user.userIdx, email: user.email }),
    };

    redis.set(user.userIdx, token.refreshToken);

    return {
      user: {
        userIdx: user.userIdx,
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
    const user = await userDao.findUserByEmail(email);
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const findUserByIdx = async idx => {
  try {
    const user = await userDao.findUserByIdx(idx);
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const emailAuthForJoin = async ({ userIdx, emailAuthNum: reqNum }) => {
  try {
    const user = await findUserByIdx(userIdx);

    if (!user) return CODE.NOT_FOUND;
    if (user.isEmailAuth) return CODE.UNAUTHORIZED;

    const authNum = await userDao.getEmailAuthNum(userIdx, EMAIL_AUTH_TYPE.JOIN);

    if (!authNum) return CODE.DUPLICATE;

    if (authNum !== reqNum) return CODE.BAD_REQUEST;

    const isEmailAuth = await userDao.setIsEmailAuth(userIdx);
    return isEmailAuth;
  } catch (err) {
    console.log(err);
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const sendEmailForPwReset = async (userIdx, email) => {
  try {
    sendEmail(userIdx, email, EMAIL_AUTH_TYPE.PASSWORD_RESET);
  } catch (err) {
    console.log('Service Error: sendEmailForPwReset ', err);
    throw new Error(err);
  }
};

const emailAuthForPwReset = async (userIdx, reqNum) => {
  try {
    const type = 2;
    const authNum = await userDao.getEmailAuthNum(userIdx, type);

    if (!authNum) return CODE.NOT_FOUND;
    if (authNum !== reqNum) return CODE.BAD_REQUEST;

    return CODE.OK;
  } catch (err) {
    console.log('Service Error: emailAuthForPwReset ', err);
    throw new Error(err);
  }
};

const resetPassword = async (userIdx, password) => {
  try {
    const hashPassword = await encrypt.hash(password);
    await userDao.resetPassword(userIdx, hashPassword);
    return CODE.OK;
  } catch (err) {
    console.log('Service Error: emailAuthForPwReset ', err);
    throw new Error(err);
  }
};

module.exports = {
  sendEmail,
  join,
  login,
  findUserByEmail,
  findUserByIdx,
  emailAuthForJoin,
  sendEmailForPwReset,
  emailAuthForPwReset,
  resetPassword
};
