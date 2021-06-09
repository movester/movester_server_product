require("dotenv").config();

const secretKey = {
    secretKey: process.env.JWT_KEY,
    option : {
        algorithm : "HS256", // 해싱 알고리즘
        expiresIn : "60m",  // 토큰 유효 기간
        issuer : "issuer" // 발행자
    }
};

module.exports = secretKey;