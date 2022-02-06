const userService = require('../service/user');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

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
      return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.NOT_EMAIL_VERIFIED));
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

const emailVerify = async (req, res) => {
  const emailVerifyUser = req.body;
  const isEmailVerifySuccess = await userService.emailVerify(
    emailVerifyUser.email,
    emailVerifyUser.emailVerifyKey,
    res
  );
  return isEmailVerifySuccess;
};

const reissueAccessToken = async (req, res) => {
  const email = req.decodeRefreshToken.sub;
  const isReissueAccessTokenSuccess = userService.reissueAccessToken(email, res);
  return isReissueAccessTokenSuccess;
};

// accessToken, refeshToken 재발급 과정 동작이 원활한지 테스트를 만들도록 함
const dashboard = async (req, res) => res.json({ status: true, message: 'hello from dashboard' });

const logout = async (req, res) => {
  const email = req.decodeData.sub;

  const isLogoutSuccess = await userService.logout(email, res);

  return isLogoutSuccess;
};

const auth = async (req, res) => {
  const authUser = {
    isAuth: true,
    email: req.decodeData.sub,
    accessToken: req.accessToken,
  };
  res.json(form.successTrue(MSG.LOGIN_SUCCESS, authUser));
};

module.exports = {
  join,
  login,
  emailVerify,
  reissueAccessToken,
  dashboard,
  logout,
  auth,
};
