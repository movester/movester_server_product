const userDao = require("../dao/user");
const encrypt = require("../utils/encrypt");
const emailSender = require("../utils/emailSender");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");

const join = async ({ joinUser }, res) => {
    const hashPassword = await encrypt.hashPassword(joinUser.password);
    if (!hashPassword) {
        const isJoinSuccess = res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(utils.successFalse(responseMessage.ENCRYPT_ERROR));
        return isJoinSuccess;
    }
    joinUser.password = hashPassword;
    joinUser.emailVerifyKey = Math.random().toString().substr(2, 6);

    const daoRow = await userDao.join({ joinUser });
    if (!daoRow) {
        const isJoinSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return isJoinSuccess;
    }
    const isEmailSenderSuccess = await emailSender.emailVerifySender(
        joinUser.email,
        joinUser.emailVerifyKey
    );

    if (!isEmailSenderSuccess) {
        const isJoinSuccess = res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(utils.successFalse(responseMessage.EMIAL_SENDER_ERROR));
        return isJoinSuccess;
    }
    const isJoinSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.JOIN_SUCCESS));
    return isJoinSuccess;
};

const login = async ({ loginUser }, res) => {
    const daoRow = await userDao.login(loginUser.email);
    if (!daoRow) {
        const isLoginSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return isLoginSuccess;
    }
    if (Object.keys(daoRow).length === 0) {
        const isLoginSuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_NOT_EXIST));
        return isLoginSuccess;
    }
    const hashPassword = daoRow[0].password;
    const isCorrectPassword = await encrypt.comparePassword(
        loginUser.password,
        hashPassword,
        res
    );

    if (!isCorrectPassword) {
        const isLoginSuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.PW_MISMATCH));
        return isLoginSuccess;
    }
    if (!daoRow[0].is_email_verify) {
        const isLoginSuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_VERIFY_NOT));
        return isLoginSuccess;
    }
    const isLoginSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.LOGIN_SUCCESS, loginUser));
    return isLoginSuccess;
};

const findUserByEmail = async email => {
    const daoRow = await userDao.findUserByEmail(email);
    if (!daoRow) {
        return false;
    }
    return daoRow;
};

const emailVerify = async (email, emailVerifyKey, res) => {
    const isExistUser = await findUserByEmail(email);
    if (!isExistUser) {
        const isEmailVerifySuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return isEmailVerifySuccess;
    }
    if (Object.keys(isExistUser).length === 0) {
        const isEmailVerifySuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_NOT_EXIST));
        return isEmailVerifySuccess;
    }
    if (isExistUser[0].is_email_verify) {
        const isEmailVerifySuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_VERIFY_ALREADY));
        return isEmailVerifySuccess;
    }
    if (isExistUser[0].email_verify_key !== emailVerifyKey) {
        const isEmailVerifySuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(
                utils.successFalse(responseMessage.EMAIL_VERIFY_KEY_MISMATCH)
            );
        return isEmailVerifySuccess;
    }
    const daoRow = await userDao.emailVerify(email, emailVerifyKey);
    if (!daoRow) {
        const isEmailVerifySuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return isEmailVerifySuccess;
    }
    const isEmailVerifySuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.EMAIL_VERIFY_SUCCESS));
    return isEmailVerifySuccess;
};
module.exports = {
    join,
    login,
    findUserByEmail,
    emailVerify
};
