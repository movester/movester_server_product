const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const Validator = require("../middleware/validator");
const ValidatorError = require("../middleware/validatorError");
const auth = require("../middleware/auth");
const passport = require("passport");
require("../utils/kakaoPassport")(passport);
require("dotenv").config();
const kakaoKey = {
    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    callbackURL: process.env.KAKAO_CALLBACK_URL
};

router.post("/join", Validator.join, ValidatorError.join, userCtrl.join);
router.post("/login", Validator.login, ValidatorError.login, userCtrl.login);
router.post(
    "/emailVerify",
    Validator.emailVerify,
    ValidatorError.emailVerify,
    userCtrl.emailVerify
);
router.post(
    "/reissueAccessToken",
    auth.verifyRefreshToken,
    userCtrl.reissueAccessToken
);
router.get("/logout", auth.verifyToken, userCtrl.logout);
router.get("/auth", auth.verifyToken, userCtrl.auth);
// test api
router.get("/dashboard", auth.verifyToken, userCtrl.dashboard);

router.get("/kakao", passport.authenticate("kakao-login"));
router.get(
    "/auth/kakao/callback",
    passport.authenticate("kakao-login", {
        successRedirect: "/",
        failureRedirect: "/api/auth/fail"
    })
);

router.get("/test", (req, res) => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoKey.clientID}&redirect_uri=${kakaoKey.callbackURL}&response_type=code`;

    return res.redirect(kakaoAuthUrl);
});

module.exports = router;
