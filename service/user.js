const jwt = require('../modules/jwt');
const userDao = require('../dao/user');
const encrypt = require('../modules/encrypt');
const emailSender = require('../modules/emailSender');
const CODE = require('../utils/statusCode');
const redis = require('../modules/redis');

const setEmailVerifyKey = async (userIdx, type, email) => {
  try {
    const emailVerifyKey = Math.floor(Math.random() * (999999 - 100000) + 100000);

    await userDao.setEmailVerifyKey(userIdx, emailVerifyKey, type);
    await emailSender.emailVerifySender(email, emailVerifyKey);
  } catch (err) {
    throw new Error(err);
  }
};

const join = async joinUser => {
  try {
    const hashPassword = await encrypt.hash(joinUser.password);
    joinUser.password = hashPassword;

    const userIdx = await userDao.join({ joinUser });
    setEmailVerifyKey(userIdx, 0, joinUser.email);

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

    if (!user.isEmailVerify) {
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
    const result = await userDao.findUserByEmail(email);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const findUserByIdx = async idx => {
  try {
    const result = await userDao.findUserByIdx(idx);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const emailVerify = async ({ userIdx, emailVerifyKey }) => {
  const user = await findUserByIdx(userIdx);

  if (!user) {
    return CODE.NOT_FOUND;
  }

  if (user.is_email_verify) {
    return CODE.UNAUTHORIZED;
  }

  if (user.email_verify_key !== emailVerifyKey) {
    return CODE.BAD_REQUEST;
  }

  const result = await userDao.emailVerify(userIdx, emailVerifyKey);
  return result;
};

module.exports = {
  setEmailVerifyKey,
  join,
  login,
  findUserByEmail,
  findUserByIdx,
  emailVerify,
};
