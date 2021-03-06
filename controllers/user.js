const userService = require('../service/user');
const encrypt = require('../modules/encrypt');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');
const redis = require('../modules/redis');

const join = async (req, res) => {
  const joinUser = req.body;
  if (joinUser.password !== joinUser.confirmPassword) {
    return res.status(CODE.BAD_REQUEST).json(form.fail('비밀번호 확인이 일치하지 않습니다.'));
  }

  const isEmailDuplicate = await userService.findUserByEmail(joinUser.email);

  if (isEmailDuplicate) {
    if (!isEmailDuplicate.deleteAt) {
      return res.status(CODE.DUPLICATE).json(form.fail('이미 존재하는 이메일입니다.'));
    }
    joinUser.userIdx = isEmailDuplicate.userIdx;
    const userIdx = await userService.rejoin(joinUser);
    return res.status(CODE.CREATED).json(form.success({ userIdx }));
  }

  const userIdx = await userService.join(joinUser);
  res.status(CODE.CREATED).json(form.success({ userIdx }));
};

const login = async (req, res) => {
  const reqUser = req.body;
  const loginUser = await userService.login(reqUser);

  switch (loginUser.code) {
    case CODE.BAD_REQUEST:
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.EMAIL_NOT_EXIST));
    case CODE.NOT_FOUND:
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.PW_MISMATCH));
    case CODE.UNAUTHORIZED:
      return res
        .status(CODE.UNAUTHORIZED)
        .json(form.fail('아직 이메일 인증을 하지 않았습니다.', { userIdx: loginUser.userIdx }));
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

const sendEmailForJoin = async (req, res) => {
  const { idx } = req.body;
  const isExistUser = await userService.findUserByIdx(idx);
  if (!isExistUser) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.EMAIL_NOT_EXIST));

  if (isExistUser.isEmailAuth) return res.status(CODE.BAD_REQUEST).json(form.fail('이미 이메일 인증된 사용자입니다.'));

  await userService.sendEmailForJoin(idx, isExistUser.email);
  return res.status(CODE.OK).json(form.success());
};

const emailAuthForJoin = async (req, res) => {
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
};

const sendEmailForPwReset = async (req, res) => {
  const { email } = req.body;
  const isExistUser = await userService.findUserByEmail(email);

  if (!isExistUser || isExistUser.deleteAt) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.EMAIL_NOT_EXIST));
  if (!isExistUser.isEmailAuth) return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.EMAIL_AUTH_NOT));
  if (isExistUser.kakaoId) return res.status(CODE.BAD_REQUEST).json(form.fail('카카오 계정으로 가입된 계정입니다.'));

  await userService.sendEmailForPwReset(isExistUser.userIdx, email);
  return res.status(CODE.OK).json(form.success());
};

const emailAuthForPwReset = async (req, res) => {
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
};

const resetPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.CONFIRM_PW_MISMATCH));
  }
  const isExistUser = await userService.findUserByEmail(email);
  if (!isExistUser) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.EMAIL_NOT_EXIST));

  await userService.resetPassword(isExistUser.userIdx, password);

  return res.status(CODE.OK).json(form.success());
};

const changePassword = async (req, res) => {
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
};

const isCorrectPassword = async (req, res) => {
  const { userIdx } = req.cookies;
  const { password } = req.query;

  const isCorrectPassword = await userService.isCorrectPassword(userIdx, password);
  if (!isCorrectPassword) return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.PW_MISMATCH));

  return res.status(CODE.OK).json(form.success());
};

const deleteUser = async (req, res) => {
  const { userIdx } = req.cookies;
  await userService.deleteUser(userIdx);

  return res.clearCookie('accessToken').clearCookie('refreshToken').status(CODE.OK).json(form.success());
};

module.exports = {
  join,
  login,
  logout,
  sendEmailForJoin,
  emailAuthForJoin,
  sendEmailForPwReset,
  emailAuthForPwReset,
  resetPassword,
  changePassword,
  isCorrectPassword,
  deleteUser,
};
