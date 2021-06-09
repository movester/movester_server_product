const userDao = require("../dao/user");
const encrypt = require("../utils/encrypt");
const emailSender = require("../utils/emailSender");
const responseMessage = require("../utils/responseMessage");

// 회원가입
const join = async ({ joinUser }) => {
    if (joinUser.password === joinUser.confirmPassword) {
        const IsEmail = await findUser(joinUser.email);
        if (!IsEmail) {
            joinUser.password = await encrypt.hashPassword(joinUser.password);
            joinUser.emailVerifyKey = Math.random().toString().substr(2, 6);
            const daoRows = await userDao.join({ joinUser });
            if (daoRows) {
                await emailSender.emailVerifySender(
                    joinUser.email,
                    joinUser.keyForVerify
                );
                return responseMessage.JOIN_SUCCESS;
            } else {
                return responseMessage.DB_ERROR;
            }
        } else {
            return responseMessage.ALREADY_EMAIL;
        }
    } else {
        return responseMessage.MISS_MATCH_PW;
    }
};

// 로그인
const login = async ({ loginUser }) => {
    const daoRows = await userDao.login(loginUser.email);
    if (daoRows.length > 0) {
        const hashPassword = daoRows[0].password;
        const IsCorrectPassword = await encrypt.comparePassword(
            loginUser.password,
            hashPassword
        );
        if (IsCorrectPassword) {
            if (daoRows[0].is_email_verify) {
                return responseMessage.LOGIN_SUCCESS;
            } else {
                return responseMessage.NOT_VERIFY_EMAIL;
            }
        } else {
            return responseMessage.MISS_MATCH_PW;
        }
    } else {
        return responseMessage.NO_USER;
    }
};

// email 로 user 찾기
const findUser = async email => {
    const daoRows = await userDao.findUser(email);
    if (daoRows.length > 0) {
        return daoRows;
    } else {
        return false;
    }
};

// 이메일 인증
const emailVerify = async (email, emailVerifyKey) => {
    const IsExistUser = await findUser(email);
    if (IsExistUser.length > 0) {
        if (IsExistUser[0].is_email_verify) {
            return responseMessage.ALREADY_VERIFY_USER;
        } else {
            if (IsExistUser[0].email_verify_key === emailVerifyKey) {
                const daoRows = await userDao.emailVerify(
                    email,
                    emailVerifyKey
                );
                if (daoRows) {
                    return responseMessage.EMAIL_VERIFY_SUCCESS;
                } else {
                    return responseMessage.DB_ERROR;
                }
            } else {
                return responseMessage.MISS_MATCH_VERIFY_KEY;
            }
        }
    } else {
        return responseMessage.NO_USER;
    }
};
module.exports = {
    join,
    login,
    findUser,
    emailVerify
};
