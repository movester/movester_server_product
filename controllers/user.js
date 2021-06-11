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

    const IsEmail = await userService.findUserByEmail(joinUser.email);
    if (!IsEmail) {
        return res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
    }
    if (Object.keys(IsEmail).length !== 0) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_ALREADY_EXIST));
    }
    const IsJoinSuccess = await userService.join({ joinUser }, res);
    return IsJoinSuccess;
};

const login = async (req, res) => {
    const loginUser = req.body;
    const IsLoginSuccess = await userService.login({ loginUser }, res);
    return IsLoginSuccess;
};

const emailVerify = async (req, res) => {
    const emailVerifyUser = req.body;
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
