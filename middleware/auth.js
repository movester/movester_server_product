const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");

const verifyToken = (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split("Bearer ")[1];

        const decodeAccessToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_SECRET
        );
        req.decodeData = decodeAccessToken;
        req.accessToken = accessToken;
        next();
    } catch (err) {
        const missDataToSubmit = {
            isAuth: false,
            accessToken: null,
            email: null
        };
        return res.json(
            utils.successFalse(responseMessage.TOKEN_INVALID, missDataToSubmit)
        );
    }
};

const verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.body.token;
    if (refreshToken === null) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(utils.successFalse(responseMessage.VALUE_NULL));
    }
    try {
        const decodeRefreshToken = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
        req.decodeRefreshToken = decodeRefreshToken;

        redisClient.get(decodeRefreshToken.sub.toString(), (err, data) => {
            if (err) throw err;

            if (data === null)
                return res
                    .status(statusCode.BAD_REQUEST)
                    .json(utils.successFalse(responseMessage.TOKEN_EMPTY));
            if (JSON.parse(data).token != refreshToken) {
                return res
                    .status(statusCode.BAD_REQUEST)
                    .json(utils.successFalse(responseMessage.TOKEN_INVALID));
            }
            next();
        });
    } catch (err) {
        console.log(`verifyRefreshToken > ${err}`);
        res.status(statusCode.BAD_REQUEST).json(
            utils.successFalse(responseMessage.TOKEN_INVALID)
        );
    }
};

const generateRefreshToken = email => {
    const refreshToken = jwt.sign(
        { sub: email, secret: "movester" },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_TIME }
    );

    redisClient.get(email.toString(), (err, data) => {
        if (err) throw err;

        redisClient.set(
            email.toString(),
            JSON.stringify({ token: refreshToken })
        );
    });

    return refreshToken;
};

module.exports = {
    verifyToken,
    verifyRefreshToken,
    generateRefreshToken
};
