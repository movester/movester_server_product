const userDao = require("../dao/user");
const encrypt = require("../utils/encrypt");
const emailSender = require("../utils/emailSender");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const redisClient = require("../config/redis");

const join = async ({ joinUser }, res) => {
    const hashPassword = await encrypt.hashPassword(joinUser.password);
    if (!hashPassword) {
        const IsJoinSuccess = res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(utils.successFalse(responseMessage.ENCRYPT_ERROR));
        return IsJoinSuccess;
    }
    joinUser.password = hashPassword;
    joinUser.emailVerifyKey = Math.random().toString().substr(2, 6);

    const daoRow = await userDao.join({ joinUser });
    if (!daoRow) {
        const IsJoinSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return IsJoinSuccess;
    }
    const IsEmailSenderSuccess = await emailSender.emailVerifySender(
        joinUser.email,
        joinUser.emailVerifyKey
    );

    if (!IsEmailSenderSuccess) {
        const IsJoinSuccess = res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(utils.successFalse(responseMessage.EMIAL_SENDER_ERROR));
        return IsJoinSuccess;
    }
    const IsJoinSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.JOIN_SUCCESS));
    return IsJoinSuccess;
};

const login = async ({ loginUser }, res) => {
    const daoRow = await userDao.login(loginUser.email);
    if (!daoRow) {
        const IsLoginSuccess = res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
        return IsLoginSuccess;
    }
    if (Object.keys(daoRow).length === 0) {
        const IsLoginSuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_NOT_EXIST));
        return IsLoginSuccess;
    }
    const hashPassword = daoRow[0].password;
    const IsCorrectPassword = await encrypt.comparePassword(
        loginUser.password,
        hashPassword,
        res
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

    const accessToken = jwt.sign(
        { sub: loginUser.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TIME }
    );
    const refreshToken = auth.GenerateRefreshToken(loginUser.email);

    loginUser.accessToken = accessToken;
    loginUser.refreshToken = refreshToken;

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
    if (Object.keys(IsExistUser).length === 0) {
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

const getAccessToken = (email, res) => {
    const accessToken = jwt.sign(
        { sub: email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TIME }
    );
    const refreshToken = auth.GenerateRefreshToken(email);

    const token = {
        accessToken: accessToken,
        refreshToken: refreshToken
    };

    const isGetAccessTokenSuccess = res
        .status(statusCode.OK)
        .json(
            utils.successTrue(
                responseMessage.TOKEN_GENERATE_REFRESH_SUCCESS,
                token
            )
        );
    return isGetAccessTokenSuccess;
};

const logout = async (email, res) => {
    await redisClient.del(email.toString());

    const isLogoutSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.LOGOUT_SUCCESS));
    return isLogoutSuccess;
};
module.exports = {
    join,
    login,
    findUserByEmail,
    emailVerify,
    getAccessToken,
    logout
};
