const userService = require("../service/user");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");

const join = async (req, res) => {
    const joinUser = req.body;
    if (joinUser.password !== joinUser.confirmPassword) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.PW_MISMATCH));
    }

    const isEmail = await userService.findUserByEmail(joinUser.email);
    if (!isEmail) {
        return res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
    }
    if (Object.keys(isEmail).length !== 0) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_ALREADY_EXIST));
    }
    const isJoinSuccess = await userService.join({ joinUser }, res);
    return isJoinSuccess;
};

const login = async (req, res) => {
    const loginUser = req.body;
    const isLoginSuccess = await userService.login({ loginUser }, res);
    return isLoginSuccess;
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

module.exports = {
    join,
    login,
    emailVerify
};
