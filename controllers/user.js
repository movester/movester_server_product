const userService = require('../service/user');
const encrypt = require('../modules/encrypt');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');
const redis = require('../modules/redis');

const join = async (req, res) => {
  try {
    const joinUser = req.body;
    if (joinUser.password !== joinUser.confirmPassword) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.CONFIRM_PW_MISMATCH));
    }

    const isEmailDuplicate = await userService.findUserByEmail(joinUser.email);

    if (isEmailDuplicate) {
      if (!isEmailDuplicate.deleteAt) {
        return res.status(CODE.DUPLICATE).json(form.fail(MSG.EMAIL_ALREADY_EXIST));
      }
      joinUser.userIdx = isEmailDuplicate.userIdx;
      const userIdx = await userService.rejoin(joinUser);
      return res.status(CODE.CREATED).json(form.success({ userIdx }));
    }

    const userIdx = await userService.join(joinUser);
    res.status(CODE.CREATED).json(form.success({ userIdx }));
  } catch (err) {
    console.error(`=== User Ctrl join Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const login = async (req, res) => {
  try {
    const reqUser = req.body;
    const loginUser = await userService.login(reqUser);

    switch (loginUser.code) {
      case CODE.BAD_REQUEST:
        return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.EMAIL_NOT_EXIST));
      case CODE.NOT_FOUND:
        return res.status(CODE.NOT_FOUND).json(form.fail(MSG.PW_MISMATCH));
      case CODE.UNAUTHORIZED:
        return res.status(CODE.UNAUTHORIZED).json(form.fail('이메일 인증을 해주세요.', { userIdx: loginUser.userIdx }));
    }

    return res
      .status(CODE.OK)
      .cookie('accessToken', loginUser.token.accessToken, { httpOnly: true })
      .cookie('refreshToken', loginUser.token.refreshToken, { httpOnly: true })
      .json(form.success(loginUser.user));
  } catch (err) {
    console.error(`=== User Ctrl login Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const logout = async (req, res) => {
  try {
    redis.del(req.cookies.userIdx);
    res.clearCookie('accessToken').clearCookie('refreshToken').status(CODE.OK).json(form.success(MSG.LOGOUT_SUCCESS));
  } catch (err) {
    console.error(`=== User Ctrl logout Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const emailAuthForJoin = async (req, res) => {
  try {
    const emailAuthUser = req.body;
    const isEmailAuth = await userService.emailAuthForJoin(emailAuthUser);

    switch (isEmailAuth) {
      case CODE.NOT_FOUND:
        return res.status(CODE.NOT_FOUND).json(form.fail('가입되지 않은 유저입니다.'));
      case CODE.UNAUTHORIZED:
        return res.status(CODE.UNAUTHORIZED).json(form.fail('이미 인증된 사용자입니다.'));
      case CODE.BAD_REQUEST:
        return res.status(CODE.BAD_REQUEST).json(form.fail('인증 번호가 일치하지 않습니다.'));
      case CODE.DUPLICATE:
        return res.status(CODE.BAD_REQUEST).json(form.fail('이메일 인증 발송 내역이 없습니다.'));
    }

    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== User Ctrl emailAuthForJoin Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const sendEmailForPwReset = async (req, res) => {
  try {
    const { email } = req.body;
    const isExistUser = await userService.findUserByEmail(email);
    if (!isExistUser) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.EMAIL_NOT_EXIST));

    if (!isExistUser.isEmailAuth) return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.EMAIL_AUTH_NOT));

    await userService.sendEmailForPwReset(isExistUser.userIdx, email);
    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== User Ctrl sendEmailForPwReset Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const emailAuthForPwReset = async (req, res) => {
  try {
    const { email, emailAuthNum } = req.query;
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
    }

    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== User Ctrl emailAuthForPwReset Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.CONFIRM_PW_MISMATCH));
    }
    const isExistUser = await userService.findUserByEmail(email);
    if (!isExistUser) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.EMAIL_NOT_EXIST));

    await userService.resetPassword(isExistUser.userIdx, password);

    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== User Ctrl resetPassword Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const changePassword = async (req, res) => {
  try {
    const { userIdx } = req.cookies;
    const { curPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.CONFIRM_PW_MISMATCH));
    }
    const user = await userService.findUserByIdx(userIdx);
    if (!user) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.USER_NOT_EXIST));

    const isCorrectPassword = await encrypt.compare(curPassword, user.password);
    if (!isCorrectPassword) return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.PW_MISMATCH));

    const isSamePassword = await encrypt.compare(newPassword, user.password);
    if (isSamePassword)
      return res.status(CODE.BAD_REQUEST).json(form.fail('기존 비밀번호와 동일한 비밀번호로 변경할 수 없습니다.'));

    await userService.resetPassword(userIdx, newPassword);

    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== User Ctrl changePassword Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const isCorrectPassword = async (req, res) => {
  try {
    const { userIdx } = req.cookies;
    const { password } = req.query;

    const isCorrectPassword = await userService.isCorrectPassword(userIdx, password);
    if (!isCorrectPassword) return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.PW_MISMATCH));

    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== User Ctrl isCorrectPassword Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userIdx } = req.cookies;
    await userService.deleteUser(userIdx);

    return res.clearCookie('accessToken').clearCookie('refreshToken').status(CODE.OK).json(form.success());
  } catch (err) {
    console.log('Ctrl Error: deleteUser ', err);
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
  resetPassword,
  changePassword,
  isCorrectPassword,
  deleteUser,
};
