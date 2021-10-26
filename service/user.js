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
        const isJoinSuccess = res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(utils.successFalse(responseMessage.ENCRYPT_ERROR));
        return isJoinSuccess;
    }
    joinUser.password = hashPassword;
    joinUser.emailVerifyKey = Math.random().toString().substr(2, 6);

    const daoRow = await userDao.join({ joinUser });
    if (!daoRow) {
        return res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
    }
    const isEmailSenderSuccess = await emailSender.emailVerifySender(
        joinUser.email,
        joinUser.emailVerifyKey
    );

    return isEmailSenderSuccess
        ? res.status(statusCode.OK).json(
              utils.successTrue(responseMessage.JOIN_SUCCESS, {
                  email: joinUser.email
              })
          )
        : res
              .status(statusCode.INTERNAL_SERVER_ERROR)
              .json(utils.successFalse(responseMessage.EMIAL_SENDER_ERROR));
};

const login = async ({ loginUser }, res) => {
    const daoRow = await userDao.login(loginUser.email);
    if (!daoRow) {
        return res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
    }
    if (Object.keys(daoRow).length === 0) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_NOT_EXIST));
    }
    const hashPassword = daoRow[0].password;
    const isCorrectPassword = await encrypt.comparePassword(
        loginUser.password,
        hashPassword
    );

    // TODO : 0 과 false 는 둘 다 falsy 한 값으로 명확한 네이밍으로 수정 필요
    if (isCorrectPassword === 0) {
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(utils.successFalse(responseMessage.ENCRYPT_ERROR));
    }

    if (isCorrectPassword === false) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.PW_MISMATCH));
    }
    if (!daoRow[0].is_email_verify) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_VERIFY_NOT));
    }

    const accessToken = jwt.sign(
        { sub: loginUser.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TIME }
    );
    const refreshToken = auth.generateRefreshToken(loginUser.email);

    return res.status(statusCode.OK).json(
        utils.successTrue(responseMessage.LOGIN_SUCCESS, {
            isAuth: true,
            userIdx: daoRow[0].user_idx,
            email: daoRow[0].email,
            name: daoRow[0].name,
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    );
};

const findUserByEmail = async email => {
    const daoRow = await userDao.findUserByEmail(email);
    return daoRow ? daoRow : false;
};

const emailVerify = async (email, emailVerifyKey, res) => {
    const isExistUser = await findUserByEmail(email);
    if (!isExistUser) {
        return res
            .status(statusCode.DB_ERROR)
            .json(utils.successFalse(responseMessage.DB_ERROR));
    }
    if (Object.keys(isExistUser).length === 0) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_NOT_EXIST));
    }
    if (isExistUser[0].is_email_verify) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_VERIFY_ALREADY));
    }
    if (isExistUser[0].email_verify_key !== emailVerifyKey) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(
                utils.successFalse(responseMessage.EMAIL_VERIFY_KEY_MISMATCH)
            );
    }
    const daoRow = await userDao.emailVerify(email, emailVerifyKey);
    return daoRow
        ? res
              .status(statusCode.OK)
              .json(utils.successTrue(responseMessage.EMAIL_VERIFY_SUCCESS))
        : res
              .status(statusCode.DB_ERROR)
              .json(utils.successFalse(responseMessage.DB_ERROR));
};

const reissueAccessToken = (email, res) => {
    const accessToken = jwt.sign(
        { sub: email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TIME }
    );
    const refreshToken = auth.generateRefreshToken(email);

    return res.status(statusCode.OK).json(
        utils.successTrue(responseMessage.TOKEN_GENERATE_REFRESH_SUCCESS, {
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    );
};

const logout = async (email, res) => {
    await redisClient.del(email.toString());

    return res.status(statusCode.OK).json(
        utils.successTrue(responseMessage.LOGOUT_SUCCESS, {
            isAuth: false
        })
    );
};
module.exports = {
    join,
    login,
    findUserByEmail,
    emailVerify,
    reissueAccessToken,
    logout
};
