require("dotenv").config();

const kakaoKey = {
    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    callbackURL: process.env.KAKAO_CALLBACK_URL
};

module.exports = {
    kakaoKey
}