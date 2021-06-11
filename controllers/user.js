const userService = require("../service/user");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");

const join = async (req, res) => {
    const joinUser = req.body;
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

    if (joinUser.password !== joinUser.confirmPassword) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.PW_MISMATCH));
    }

    const IsEmail = await userService.findUserByEmail(joinUser.email);
    if (IsEmail) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_ALREADY_EXIST));
    }

    const IsJoinSuccess = await userService.join({ joinUser }, res);
    return IsJoinSuccess;
};

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

    const IsLoginSuccess = await userService.login({ loginUser }, res);
    return IsLoginSuccess;
};

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

    const IsEmailVerifySuccess = await userService.emailVerify(
        emailVerifyUser.email,
        emailVerifyUser.emailVerifyKey,
        res
    );
    return IsEmailVerifySuccess;
};

module.exports = {
    join,
    login,
    emailVerify
};
