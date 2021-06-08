const userService = require("../service/user");
const type = require("../config/enum");

const join = async (req, res) => {
    let joinUser = req.body;
    const IsJoinSuccess = await userService.join({ joinUser });

    switch (IsJoinSuccess) {
        case type.joinEnum.JOIN_SUCCESS:
            res.status(200).json({
                success: true,
                message: "회원가입 성공"
            });
            break;
        case type.joinEnum.DB_ERROR:
            res.status(500).json({
                success: false,
                message: "db 에러"
            });
            break;
        case type.joinEnum.EXIST_EMAIL:
            res.status(400).json({
                success: false,
                message: "이미 존재하는 이메일"
            });
            break;
        case type.joinEnum.INCORRECT_PASSWORD:
            res.status(400).json({
                success: false,
                message: "잘못된 비밀번호"
            });
            break;
    }
};

const login = async (req, res) => {
    const loginUser = req.body;
    const IsLoginSuccess = await userService.login({ loginUser });
    switch (IsLoginSuccess) {
        case type.loginEnum.LOGIN_SUCCESS:
            res.status(200).json({
                success: true,
                message: "로그인 성공"
            });
            break;
        case type.loginEnum.NOT_VERIFY:
            res.status(400).json({
                success: false,
                message: "이메일 인증 안됐음"
            });
            break;
        case type.loginEnum.INCORRECT_PASSWORD:
            res.status(400).json({
                success: false,
                message: "잘못된 비밀번호"
            });
            break;
        case type.loginEnum.INCORRECT_EMAIL:
            res.status(400).json({
                success: false,
                message: "없는 이메일"
            });
            break;
    }
};

const emailVerify = async (req, res) => {
    const emailVerifyUser = req.body;
    const IsCorrectEmailVerifyKey = await userService.emailVerify(
        emailVerifyUser.email,
        emailVerifyUser.inputEmailVerifyKey
    );
    switch (IsCorrectEmailVerifyKey) {
        case type.emailVerifyEnum.EMAIL_VERIFY_SUCCESS:
            res.status(200).json({
                success: true,
                message: "인증 성공"
            });
            break;
        case type.emailVerifyEnum.DB_ERROR:
            res.status(500).json({
                success: false,
                message: "DB 에러"
            });
            break;
        case type.emailVerifyEnum.NOT_EXIST_EMAIL:
            res.status(400).json({
                success: false,
                message: "없는 이메일"
            });
            break;
        case type.emailVerifyEnum.INCORRECT_KEY:
            res.status(400).json({
                success: false,
                message: "잘못된 인증 번호"
            });
            break;
    }
};

module.exports = {
    join,
    login,
    emailVerify
};
