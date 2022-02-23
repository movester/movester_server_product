const jwt = require('../modules/jwt');
const userDao = require('../dao/user');
const encrypt = require('../modules/encrypt');
const emailSender = require('../modules/emailSender');
const CODE = require('../utils/statusCode');
const redis = require('../modules/redis');

const EMAIL_AUTH_TYPE = {
  JOIN: 1,
  PASSWORD_RESET: 2,
};

const sendEmail = async (userIdx, email, type) => {
  try {
    const emailAuthNum = Math.floor(Math.random() * (999999 - 100000) + 100000);

    await userDao.setEmailAuthNum(userIdx, emailAuthNum, type);
    await emailSender.emailAuthSender(email, emailAuthNum, type);
  } catch (err) {
    console.log('User Service Error: sendEmail ', err);
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
    console.log('User Service Error: join ', err);
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
    console.log('User Service Error: login ', err);
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const findUserByEmail = async email => {
  try {
    const user = await userDao.findUserByEmail(email);
    return user;
  } catch (err) {
    console.log('User Service Error: findUserByEmail ', err);
    throw new Error(err);
  }
};

const findUserByIdx = async idx => {
  try {
    const user = await userDao.findUserByIdx(idx);
    return user;
  } catch (err) {
    console.log('User Service Error: findUserByIdx ', err);
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
    console.log('User Service Error: emailAuthForJoin ', err);
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const sendEmailForPwReset = async (userIdx, email) => {
  try {
    sendEmail(userIdx, email, EMAIL_AUTH_TYPE.PASSWORD_RESET);
  } catch (err) {
    console.log('User Service Error: sendEmailForPwReset ', err);
    throw new Error(err);
  }
};

const emailAuthForPwReset = async (userIdx, reqNum) => {
  try {
    const type = EMAIL_AUTH_TYPE.PASSWORD_RESET;
    const authNum = await userDao.getEmailAuthNum(userIdx, type);

    if (!authNum) return CODE.NOT_FOUND;
    if (authNum !== reqNum) return CODE.BAD_REQUEST;

    return CODE.OK;
  } catch (err) {
    console.log('User Service Error: emailAuthForPwReset ', err);
    throw new Error(err);
  }
};

const resetPassword = async (userIdx, password) => {
  try {
    const hashPassword = await encrypt.hash(password);
    await userDao.resetPassword(userIdx, hashPassword);
    return CODE.OK;
  } catch (err) {
    console.log('User Service Error: emailAuthForPwReset ', err);
    throw new Error(err);
  }
};

const isCorrectPassword = async (userIdx, password) => {
  try {
    const user = await findUserByIdx(userIdx);
    const isCorrectPassword = await encrypt.compare(password, user.password);
    return isCorrectPassword;
  } catch (err) {
    console.log('User Service Error: isCorrectPassword ', err);
    throw new Error(err);
  }
};

const findUserByKakaoId = async kakaoId => {
  try {
    const user = await userDao.findUserByKakaoId(kakaoId);
    return user;
  } catch (err) {
    console.log('User Service Error: findUserByKakaoId ', err);
    throw new Error(err);
  }
};

const getTokenAndSetRedis = async (userIdx, email, name) => {
  const token = {
    accessToken: await jwt.signAccessToken({ idx: userIdx, email }),
    refreshToken: await jwt.signRefreshToken({ idx: userIdx, email }),
  };

  redis.set(userIdx, token.refreshToken);

  return {
    user: {
      userIdx,
      email,
      name,
    },
    token,
  };
};

const authKaKako = async user => {
  try {
    const kakaoId = user.id;
    const { email } = user.kakao_account;
    const name = user.properties.nickname;

    const isExistUser = await findUserByKakaoId(kakaoId);
    if (isExistUser) {
      // 이미 가입된 유저 > 로그인
      return await getTokenAndSetRedis(isExistUser.userIdx, isExistUser.email, isExistUser.name);
    }

    const isExistEmailUser = await findUserByEmail(email);
    if (isExistEmailUser) {
      // 로컬 가입 되있지만 카카오 연동 x
      await userDao.updateUserKakaoId(isExistEmailUser.userIdx, kakaoId);
      return await getTokenAndSetRedis(isExistEmailUser.userIdx, isExistEmailUser.email, isExistEmailUser.name);
    }
    // 로컬 가입도 안되있는 유저
    const newUserIdx = await userDao.joinKakao(email, name, kakaoId);
    return await getTokenAndSetRedis(newUserIdx, email, name);
  } catch (err) {
    console.log('User Service Error: authKaKako ', err);
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
  resetPassword,
  isCorrectPassword,
  authKaKako,
};
