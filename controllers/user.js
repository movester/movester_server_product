const userService = require("../service/user");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");

// 회원가입
const join = async (req, res) => {
    let joinUser = req.body;
    const { email, password, confirmPassword, name } = req.body;
    if (
        !joinUser.email ||
        !joinUser.password ||
        !joinUser.confirmPassword ||
        !joinUser.name
    ) {
        const missParameters = Object.entries({
            email,
            password,
            confirmPassword,
            name
        })
            .filter(it => it[1] == undefined)
            .map(it => it[0])
            .join(",");
        res.status(statusCode.BAD_REQUEST).json(
            utils.successFalse(responseMessage.X_NULL_VALUE(missParameters))
        );
    }

    const IsJoinSuccess = await userService.join({ joinUser });

    switch (IsJoinSuccess) {
        case responseMessage.JOIN_SUCCESS:
            res.status(statusCode.OK).json(
                utils.successTrue(responseMessage.JOIN_SUCCESS)
            );
            break;
        case responseMessage.DB_ERROR:
            res.status(statusCode.DB_ERROR).json(
                utils.successFalse(responseMessage.DB_ERROR)
            );
            break;
        case responseMessage.ALREADY_EMAIL:
            res.status(statusCode.BAD_REQUEST).json(
                utils.successFalse(responseMessage.ALREADY_EMAIL)
            );
            break;
        case responseMessage.MISS_MATCH_PW:
            res.status(statusCode.BAD_REQUEST).json(
                utils.successFalse(responseMessage.MISS_MATCH_PW)
            );
            break;
    }
};

// 로그인
const login = async (req, res) => {
    const loginUser = req.body;
    const { email, password } = req.body;
    if (!loginUser.email || !loginUser.password) {
        const missParameters = Object.entries({
            email,
            password
        })
            .filter(it => it[1] == undefined)
            .map(it => it[0])
            .join(",");
        res.status(statusCode.BAD_REQUEST).json(
            utils.successFalse(responseMessage.X_NULL_VALUE(missParameters))
        );
        return;
    }

    const IsLoginSuccess = await userService.login({ loginUser });

    switch (IsLoginSuccess) {
        case responseMessage.LOGIN_SUCCESS:
            res.status(statusCode.OK).json(
                utils.successTrue(responseMessage.LOGIN_SUCCESS, loginUser)
            );
            break;
        case responseMessage.NOT_VERIFY_EMAIL:
            res.status(statusCode.BAD_REQUEST).json(
                utils.successFalse(responseMessage.NOT_VERIFY_EMAIL)
            );
            break;
        case responseMessage.MISS_MATCH_PW:
            res.status(statusCode.BAD_REQUEST).json(
                utils.successFalse(responseMessage.MISS_MATCH_PW)
            );
            break;
        case responseMessage.NO_USER:
            res.status(statusCode.BAD_REQUEST).json(
                utils.successFalse(responseMessage.NO_USER)
            );
            break;
    }
};

// 이메일 인증
const emailVerify = async (req, res) => {
    const emailVerifyUser = req.body;

    const { email, emailVerifyKey } = req.body;
    if (!emailVerifyUser.email || !emailVerifyUser.emailVerifyKey) {
        const missParameters = Object.entries({
            email,
            emailVerifyKey
        })
            .filter(it => it[1] == undefined)
            .map(it => it[0])
            .join(",");
        res.status(statusCode.BAD_REQUEST).json(
            utils.successFalse(responseMessage.X_NULL_VALUE(missParameters))
        );
    }

    const IsCorrectEmailVerifyKey = await userService.emailVerify(
        emailVerifyUser.email,
        emailVerifyUser.emailVerifyKey
    );

    switch (IsCorrectEmailVerifyKey) {
        case responseMessage.EMAIL_VERIFY_SUCCESS:
            res.status(statusCode.OK).json(
                utils.successTrue(responseMessage.EMAIL_VERIFY_SUCCESS)
            );
            break;
        case responseMessage.DB_ERROR:
            res.status(statusCode.DB_ERROR).json(
                utils.successFalse(responseMessage.DB_ERROR)
            );
            break;
        case responseMessage.NO_USER:
            res.status(statusCode.BAD_REQUEST).json(
                utils.successFalse(responseMessage.NO_USER)
            );
            break;
        case responseMessage.MISS_MATCH_VERIFY_KEY:
            res.status(statusCode.BAD_REQUEST).json(
                utils.successFalse(responseMessage.MISS_MATCH_VERIFY_KEY)
            );
            break;
        case responseMessage.ALREADY_VERIFY_USER:
            res.status(statusCode.BAD_REQUEST).json(
                utils.successFalse(responseMessage.ALREADY_VERIFY_USER)
            );
            break;
    }
};

module.exports = {
    join,
    login,
    emailVerify
};
