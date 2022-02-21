const userService = require('../service/user');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');
const redis = require('../modules/redis');

const join = async (req, res) => {
  const joinUser = req.body;
  if (joinUser.password !== joinUser.confirmPassword) {
    return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.CONFIRM_PW_MISMATCH));
  }

  try {
    const isEmailDuplicate = await userService.findUserByEmail(joinUser.email);
    if (isEmailDuplicate) {
      return res.status(CODE.DUPLICATE).json(form.fail(MSG.EMAIL_ALREADY_EXIST));
    }
  } catch (err) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
  const isJoin = await userService.join(joinUser);

  if (isJoin === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
  res.status(CODE.CREATED).json(form.success());
};

const login = async (req, res) => {
  const reqUser = req.body;
  const loginUser = await userService.login(reqUser);

  if (typeof loginUser === 'number') {
    if (loginUser === CODE.BAD_REQUEST) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.EMAIL_NOT_EXIST));
    }
    if (loginUser === CODE.NOT_FOUND) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.PW_MISMATCH));
    }
    if (loginUser === CODE.UNAUTHORIZED) {
      return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.EMAIL_AUTH_NOT));
    }
    if (loginUser === CODE.INTERNAL_SERVER_ERROR) {
      return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
    }
  }

  return res
    .status(CODE.OK)
    .cookie('accessToken', loginUser.token.accessToken, { httpOnly: true })
    .cookie('refreshToken', loginUser.token.refreshToken, { httpOnly: true })
    .json(form.success(loginUser.user));
};

const logout = async (req, res) => {
  redis.del(req.cookies.userIdx);
  res.clearCookie('accessToken').clearCookie('refreshToken').status(CODE.OK).json(form.success(MSG.LOGOUT_SUCCESS));
};

const emailAuthForJoin = async (req, res) => {
  const emailAuthUser = req.body;
  const isEmailAuth = await userService.emailAuthForJoin(emailAuthUser);

  if (typeof isEmailAuth === 'number') {
    if (isEmailAuth === CODE.NOT_FOUND) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.EMAIL_NOT_EXIST));
    }
    if (isEmailAuth === CODE.UNAUTHORIZED) {
      return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.EMAIL_AUTH_ALREADY));
    }
    if (isEmailAuth === CODE.BAD_REQUEST) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.EMAIL_AUTH_NUM_MISMATCH));
    }
    if (isEmailAuth === CODE.DUPLICATE) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.EMAIL_AUTH_NOT_FIND));
    }
    if (isEmailAuth === CODE.INTERNAL_SERVER_ERROR) {
      return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
    }
  }

  return res.status(CODE.OK).json(form.success());
};

const sendEmailForPwReset = async (req, res) => {
  const { email } = req.body;

  try {
    const isExistUser = await userService.findUserByEmail(email);
    if (!isExistUser) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.EMAIL_NOT_EXIST));

    if (!isExistUser.isEmailAuth) return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.EMAIL_AUTH_NOT));

    await userService.sendEmailForPwReset(isExistUser.userIdx, email);
    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.log('Ctrl Error: sendEmailForPwReset ', err);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const emailAuthForPwReset = async (req, res) => {
  const { email, emailAuthNum } = req.query;

  try {
    const isExistUser = await userService.findUserByEmail(email);
    if (!isExistUser) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.EMAIL_NOT_EXIST));
    }

    const isEmailAuth = await userService.emailAuthForPwReset(isExistUser.userIdx, emailAuthNum);

    switch (isEmailAuth) {
      case CODE.NOT_FOUND:
        return res.status(CODE.NOT_FOUND).json(form.fail('인증 번호 발송 내역이 없습니다.'));
      case CODE.BAD_REQUEST:
        return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.EMAIL_AUTH_NUM_MISMATCH));
      case CODE.OK:
        return res.status(CODE.OK).json(form.success());
      default:
    }
  } catch (err) {
    console.log('Ctrl Error: emailAuthForPwReset ', err);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const createAttendPoint = async (req, res) => {
  try {
    const { userIdx } = req.cookies;
    await userService.createAttendPoint(userIdx);
    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== User Ctrl createAttendPoint Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  join,
  login,
  logout,
  emailAuthForJoin,
  sendEmailForPwReset,
  emailAuthForPwReset,
  createAttendPoint,
};
