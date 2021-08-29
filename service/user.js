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
    const missDataToSubmit = {
        email: null
    };

    const hashPassword = await encrypt.hashPassword(joinUser.password);
    if (!hashPassword) {
        const isJoinSuccess = res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(
                utils.successFalse(
                    responseMessage.ENCRYPT_ERROR,
                    missDataToSubmit
                )
            );
        return isJoinSuccess;
    }
    joinUser.password = hashPassword;
    joinUser.emailVerifyKey = Math.random().toString().substr(2, 6);

    const daoRow = await userDao.join({ joinUser });
    if (!daoRow) {
        const isJoinSuccess = res
            .status(statusCode.DB_ERROR)
            .json(
                utils.successFalse(responseMessage.DB_ERROR, missDataToSubmit)
            );
        return isJoinSuccess;
    }
    const isEmailSenderSuccess = await emailSender.emailVerifySender(
        joinUser.email,
        joinUser.emailVerifyKey
    );

    if (!isEmailSenderSuccess) {
        const isJoinSuccess = res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(
                utils.successFalse(
                    responseMessage.EMIAL_SENDER_ERROR,
                    missDataToSubmit
                )
            );
        return isJoinSuccess;
    }
    const dataToSubmit = {
        email: joinUser.email
    };
    const isJoinSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.JOIN_SUCCESS, dataToSubmit));
    return isJoinSuccess;
};

const login = async ({ loginUser }, res) => {
    const missDataToSubmit = {
        isAuth: false
    };
    const daoRow = await userDao.login(loginUser.email);
    if (!daoRow) {
        const isLoginSuccess = res
            .status(statusCode.DB_ERROR)
            .json(
                utils.successFalse(responseMessage.DB_ERROR, missDataToSubmit)
            );
        return isLoginSuccess;
    }
    if (Object.keys(daoRow).length === 0) {
        const isLoginSuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(
                utils.successFalse(
                    responseMessage.EMAIL_NOT_EXIST,
                    missDataToSubmit
                )
            );
        return isLoginSuccess;
    }
    const hashPassword = daoRow[0].password;
    const isCorrectPassword = await encrypt.comparePassword(
        loginUser.password,
        hashPassword
    );

    // TODO : 0 과 false 는 둘 다 falsy 한 값으로 명확한 네이밍으로 수정 필요
    if (isCorrectPassword === 0) {
        const isLoginSuccess = res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(
                utils.successFalse(
                    responseMessage.ENCRYPT_ERROR,
                    missDataToSubmit
                )
            );
        return isLoginSuccess;
    }

    if (isCorrectPassword === false) {
        const isLoginSuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(
                utils.successFalse(
                    responseMessage.PW_MISMATCH,
                    missDataToSubmit
                )
            );
        return isLoginSuccess;
    }
    if (!daoRow[0].is_email_verify) {
        const isLoginSuccess = res
            .status(statusCode.BAD_REQUEST)
            .json(
                utils.successFalse(
                    responseMessage.EMAIL_VERIFY_NOT,
                    missDataToSubmit
                )
            );
        return isLoginSuccess;
    }

    const accessToken = jwt.sign(
        { sub: loginUser.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TIME }
    );
    const refreshToken = auth.generateRefreshToken(loginUser.email);

    const dataToSubmit = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        isAuth: true
    };

    const isLoginSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.LOGIN_SUCCESS, dataToSubmit));
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

const reissueAccessToken = (email, res) => {
    const accessToken = jwt.sign(
        { sub: email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TIME }
    );
    const refreshToken = auth.generateRefreshToken(email);

    const token = {
        accessToken: accessToken,
        refreshToken: refreshToken
    };

    const isReissueAccessToken = res
        .status(statusCode.OK)
        .json(
            utils.successTrue(
                responseMessage.TOKEN_GENERATE_REFRESH_SUCCESS,
                token
            )
        );
    return isReissueAccessToken;
};

const logout = async (email, res) => {
    await redisClient.del(email.toString());

    const dataToSubmit = {
        isAuth: false
    };

    const isLogoutSuccess = res
        .status(statusCode.OK)
        .json(utils.successTrue(responseMessage.LOGOUT_SUCCESS, dataToSubmit));
    return isLogoutSuccess;
};
module.exports = {
    join,
    login,
    findUserByEmail,
    emailVerify,
    reissueAccessToken,
    logout
};
