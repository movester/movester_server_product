const { check } = require("express-validator");

const join = [
    check("email")
        .notEmpty()
        .withMessage("이메일을 입력해주세요.")
        .isEmail()
        .withMessage("이메일은 이메일 형식이어야 합니다.")
        .isLength({ min: 10, max: 50 })
        .withMessage("이메일은 최소 10글자부터 최대 50글자까지 가능합니다."),
    check("password")
        .notEmpty()
        .withMessage("비밀번호를 입력해주세요.")
        .isLength({ min: 4, max: 20 }) // 개발시 테스트 버전
        .withMessage("비밀번호는 최소 8글자부터 최대 20글자까지 가능합니다."),
    check("confirmPassword")
        .notEmpty()
        .withMessage("확인 비밀번호를 입력해주세요.")
        .isLength({ min: 4, max: 20 })
        .withMessage("비밀번호는 최소 8글자부터 최대 20글자까지 가능합니다."),
    check("name")
        .notEmpty()
        .withMessage("이름 입력해주세요.")
        .isLength({ min: 1, max: 12 })
        .withMessage("이름은 최소 1글자부터 최대 12글자까지 가능합니다.")
];

const login = [
    check("email")
        .notEmpty()
        .withMessage("이메일을 입력해주세요.")
        .isEmail()
        .withMessage("이메일은 이메일 형식이어야 합니다.")
        .isLength({ min: 10, max: 50 })
        .withMessage("이메일은 최소 10글자부터 최대 50글자까지 가능합니다."),
    check("password")
        .notEmpty()
        .withMessage("비밀번호를 입력해주세요.")
        .isLength({ min: 4, max: 20 })
        .withMessage("비밀번호는 최소 8글자부터 최대 20글자까지 가능합니다.")
];

const emailVerify = [
    check("email")
        .notEmpty()
        .withMessage("이메일을 입력해주세요.")
        .isEmail()
        .withMessage("이메일은 이메일 형식이어야 합니다.")
        .isLength({ min: 10, max: 50 })
        .withMessage("이메일은 최소 10글자부터 최대 50글자까지 가능합니다."),
    check("emailVerifyKey")
        .notEmpty()
        .withMessage("이메일 인증 번호를 입력해주세요.")
        .isInt(6)
        .withMessage("이메일 인증 번호는 6자리 숫자입니다")
];

module.exports = {
    join,
    login,
    emailVerify
};
