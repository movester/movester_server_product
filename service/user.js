const userDao = require("../dao/user");
const encrypt = require("../utils/encrypt");
const emailSender = require("../utils/emailSender");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");

const join = async ({ joinUser }, res) => {
    joinUser.password = await encrypt.hashPassword(joinUser.password);
    joinUser.emailVerifyKey = Math.random().toString().substr(2, 6);
    const daoRow = await userDao.join({ joinUser });
    if (!daoRow) {
        const IsLoginSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return IsLoginSuccess;
    }
    await emailSender.emailVerifySender(
        joinUser.email,
        joinUser.emailVerifyKey
    );
    const IsLoginSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.JOIN_SUCCESS));
    return IsLoginSuccess;
};

const login = async ({ loginUser }, res) => {
    const daoRow = await userDao.login(loginUser.email);
    if (!daoRow) {
        const IsLoginSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return IsLoginSuccess;
    }
    if (Object.keys(daoRow).length === 0){
        const IsLoginSuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_NOT_EXIST));
        return IsLoginSuccess;
    }
    const hashPassword = daoRow[0].password;
    const IsCorrectPassword = await encrypt.comparePassword(
        loginUser.password,
        hashPassword
    );

    if (!IsCorrectPassword) {
        const IsLoginSuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.PW_MISMATCH));
        return IsLoginSuccess;
    }
    if (!daoRow[0].is_email_verify) {
        const IsLoginSuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_VERIFY_NOT));
        return IsLoginSuccess;
    }
    const IsLoginSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.LOGIN_SUCCESS, loginUser));
    return IsLoginSuccess;
};

const findUserByEmail = async email => {
    const daoRow = await userDao.findUserByEmail(email);
    if (!daoRow) {
        return false;
    }
    return daoRow;
};

const emailVerify = async (email, emailVerifyKey, res) => {
    const IsExistUser = await findUserByEmail(email);
    if (!IsExistUser) {
        const IsEmailVerifySuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return IsEmailVerifySuccess;
    }
    if (Object.keys(IsExistUser).length === 0){
        const IsEmailVerifySuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_NOT_EXIST));
        return IsEmailVerifySuccess;
    }
    if (IsExistUser[0].is_email_verify) {
        const IsEmailVerifySuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_VERIFY_ALREADY));
        return IsEmailVerifySuccess;
    }
    if (IsExistUser[0].email_verify_key !== emailVerifyKey) {
        const IsEmailVerifySuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(
                utils.successFalse(responseMessage.EMAIL_VERIFY_KEY_MISMATCH)
            );
        return IsEmailVerifySuccess;
    }
    const daoRow = await userDao.emailVerify(email, emailVerifyKey);
    if (!daoRow) {
        const IsEmailVerifySuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return IsEmailVerifySuccess;
    }
    const IsEmailVerifySuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.EMAIL_VERIFY_SUCCESS));
    return IsEmailVerifySuccess;
};
module.exports = {
    join,
    login,
    findUserByEmail,
    emailVerify
};
