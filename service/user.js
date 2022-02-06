const jwt = require('../modules/jwt');
const userDao = require('../dao/user');
const encrypt = require('../modules/encrypt');
const emailSender = require('../modules/emailSender');
const CODE = require('../utils/statusCode');
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
  join,
  login,
  findUserByEmail,
  findUserByIdx,
  emailVerify,
};
