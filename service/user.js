const userDao = require("../dao/user");
const encrypt = require("../utils/encrypt");
const emailSender = require("../utils/emailSender");
const type = require("../config/enum");

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
                return type.joinEnum.JOIN_SUCCESS;
            } else {
                return type.joinEnum.DB_ERROR;
            }
        } else {
            return type.joinEnum.EXIST_EMAIL;
        }
    } else {
        return type.joinEnum.INCORRECT_PASSWORD;
    }
};

const login = async ({ loginUser }) => {
    const daoRows = await userDao.login(loginUser.email);
    console.log(daoRows[0]);
    if (daoRows.length > 0) {
        const hashPassword = daoRows[0].password;
        const IsCorrectPassword = await encrypt.comparePassword(
            loginUser.password,
            hashPassword
        );
        if (IsCorrectPassword) {
            if (daoRows[0].is_email_verify) {
                return type.loginEnum.LOGIN_SUCCESS;
            } else {
                return type.loginEnum.NOT_VERIFY;
            }
        } else {
            return type.loginEnum.INCORRECT_PASSWORD;
        }
    } else {
        return type.loginEnum.INCORRECT_EMAIL;
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
const emailVerify = async (email, inputEmailVerifyKey) => {
    const daoRows1 = await findUser(email);
    if (daoRows1.length > 0) {
        if (daoRows1[0].email_verify_key === inputEmailVerifyKey) {
            // 이메일 인증!
            const daoRows2 = await userDao.emailVerify(
                email,
                inputEmailVerifyKey
            );
            if (daoRows2) {
                // db update 성공
                return type.emailVerifyEnum.EMAIL_VERIFY_SUCCESS;
            } else {
                // db update 실패
                return type.emailVerifyEnum.DB_ERROR;
            }
        } else {
            return type.emailVerifyEnum.INCORRECT_KEY;
        }
    } else {
        // 해당 계정 없는 경우
        return type.emailVerifyEnum.NOT_EXIST_EMAIL;
    }
};
module.exports = {
    join,
    login,
    findUser,
    emailVerify
};
