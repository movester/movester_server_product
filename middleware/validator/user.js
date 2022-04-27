const { query, body } = require('express-validator');

const join = [
  body('email')
    .notEmpty()
    .withMessage('이메일을 입력해주세요.')
    .isEmail()
    .withMessage('이메일은 이메일 형식이어야 합니다.'),
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/)
    .withMessage('비밀번호는 영문, 숫자를 반드시 포함하여 8자리 이상 20자리 이하로 입력해주세요.'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/)
    .withMessage('비밀번호는 영문, 숫자를 반드시 포함하여 8자리 이상 20자리 이하로 입력해주세요.'),
  body('name')
    .notEmpty()
    .withMessage('이름 입력해주세요.')
    .matches(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{2,12}$/)
    .withMessage('이름은 한글, 영문, 숫자로 조합된 2자리 이상 12자리 이하로 입력해주세요.'),
];

const login = [
  body('email')
    .notEmpty()
    .withMessage('이메일을 입력해주세요.')
    .isEmail()
    .withMessage('이메일은 이메일 형식이어야 합니다.'),
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/)
    .withMessage('비밀번호는 영문, 숫자를 반드시 포함하여 8자리 이상 20자리 이하로 입력해주세요.'),
];

const emailAuthForJoin = [
  body('userIdx').notEmpty().withMessage('userIdx를 입력해주세요.').isInt(6),
  body('emailAuthNum')
    .notEmpty()
    .withMessage('이메일 인증 번호를 입력해주세요.')
    .isInt()
    .withMessage('이메일 인증 번호는 숫자여야합니다.')
    .isLength(6)
    .withMessage('이메일 인증 번호는 6자리입니다.')
    .toInt(),
];

const emailAuthForPwReset = [
  query('email')
    .notEmpty()
    .withMessage('이메일을 입력해주세요.')
    .isEmail()
    .withMessage('이메일은 이메일 형식이어야 합니다.')
    .isLength({ min: 10, max: 50 })
    .withMessage('이메일은 최소 10글자부터 최대 50글자까지 가능합니다.'),
  query('emailAuthNum')
    .notEmpty()
    .withMessage('이메일 인증 번호를 입력해주세요.')
    .isInt()
    .withMessage('이메일 인증 번호는 숫자여야합니다.')
    .isLength(6)
    .withMessage('이메일 인증 번호는 6자리입니다.')
    .toInt(),
];

const checkEmail = [
  body('email')
    .notEmpty()
    .withMessage('이메일을 입력해주세요.')
    .isEmail()
    .withMessage('이메일은 이메일 형식이어야 합니다.')
    .isLength({ min: 10, max: 50 })
    .withMessage('이메일은 최소 10글자부터 최대 50글자까지 가능합니다.'),
];

const resetPassword = [
  body('email')
    .notEmpty()
    .withMessage('이메일을 입력해주세요.')
    .isEmail()
    .withMessage('이메일은 이메일 형식이어야 합니다.')
    .isLength({ min: 10, max: 50 })
    .withMessage('이메일은 최소 10글자부터 최대 50글자까지 가능합니다.'),
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
    .isLength({ min: 5, max: 20 })
    .withMessage('비밀번호는 최소 5글자부터 최대 20글자까지 가능합니다.'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('확인 비밀번호를 입력해주세요.')
    .isLength({ min: 5, max: 20 })
    .withMessage('비밀번호는 최소 5글자부터 최대 20글자까지 가능합니다.'),
];

const changePassword = [
  body('curPassword')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
    .isLength({ min: 5, max: 20 })
    .withMessage('비밀번호는 최소 5글자부터 최대 20글자까지 가능합니다.'),
  body('newPassword')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
    .isLength({ min: 5, max: 20 })
    .withMessage('비밀번호는 최소 5글자부터 최대 20글자까지 가능합니다.'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('확인 비밀번호를 입력해주세요.')
    .isLength({ min: 5, max: 20 })
    .withMessage('비밀번호는 최소 5글자부터 최대 20글자까지 가능합니다.'),
];

const checkPassword = [
  query('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
    .isLength({ min: 5, max: 20 })
    .withMessage('비밀번호는 최소 5글자부터 최대 20글자까지 가능합니다.'),
];

module.exports = {
  join,
  login,
  emailAuthForJoin,
  emailAuthForPwReset,
  checkEmail,
  resetPassword,
  changePassword,
  checkPassword,
};
