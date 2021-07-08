const userService = require("../service/user");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");

const join = async (req, res) => {
    const missDataToSubmit = {};
    missDataToSubmit.email = null;
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
            .json(utils.successFalse(responseMessage.DB_ERROR,missDataToSubmit));
    }
    if (Object.keys(isEmail).length > 0) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.EMAIL_ALREADY_EXIST,missDataToSubmit));
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

const getAccessToken = async (req, res) => {
    const email = req.decodeRefreshToken.sub;
    const isGetAccessTokenSuccess = userService.getAccessToken(email, res);
    return isGetAccessTokenSuccess;
};

// test api
const dashboard = async (req, res) => {
    return res.json({ status: true, message: "hello from dashboard" });
};

const logout = async (req, res) => {
    const email = req.decodeData.sub;

    const isLogoutSuccess = await userService.logout(email, res);

    return isLogoutSuccess;
};

const auth = async (req, res) => {
    const authUser = {
        isAuth: true,
        email: req.decodeData.sub,
        accessToken: req.accessToken
    };
    res.json(utils.successTrue(responseMessage.LOGIN_SUCCESS, authUser));
};

module.exports = {
    join,
    login,
    emailVerify,
    getAccessToken,
    dashboard,
    logout,
    auth
};