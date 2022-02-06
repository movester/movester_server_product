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
  const result = await userService.join(joinUser);

  if (result === CODE.INTERNAL_SERVER_ERROR) {
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
  res.status(CODE.CREATED).json(form.success());
};

const login = async (req, res) => {
  const loginUser = req.body;
  const result = await userService.login(loginUser);

  if (typeof result === 'number') {
    if (result === CODE.BAD_REQUEST) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.EMAIL_NOT_EXIST));
    }
    if (result === CODE.NOT_FOUND) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.PW_MISMATCH));
    }
    if (result === CODE.UNAUTHORIZED) {
      return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.EMAIL_VERIFY_NOT));
    }
    if (result === CODE.INTERNAL_SERVER_ERROR) {
      return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
    }
  }

  return res
    .status(CODE.OK)
    .cookie('accessToken', result.token.accessToken, { httpOnly: true })
    .cookie('refreshToken', result.token.refreshToken, { httpOnly: true })
    .json(form.success(result.user));
};

const logout = async (req, res) => {
  redis.del(req.cookies.idx);
  res.clearCookie('accessToken').clearCookie('refreshToken').status(CODE.OK).json(form.success(MSG.LOGOUT_SUCCESS));
};

const emailVerify = async (req, res) => {
  const emailVerifyUser = req.body;
  const result = await userService.emailVerify(emailVerifyUser);

  if (typeof result === 'number') {
    if (result === CODE.NOT_FOUND) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.EMAIL_NOT_EXIST));
    }
    if (result === CODE.UNAUTHORIZED) {
      return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.EMAIL_VERIFY_ALREADY));
    }
    if (result === CODE.BAD_REQUEST) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.EMAIL_VERIFY_KEY_MISMATCH));
    }
    if (result === CODE.INTERNAL_SERVER_ERROR) {
      return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
    }
  }

  return res.status(CODE.OK).json(form.success());
};

module.exports = {
  join,
  login,
  logout,
  emailVerify,
};
