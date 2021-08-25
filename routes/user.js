const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const Validator = require("../middleware/validator");
const ValidatorError = require("../middleware/validatorError");
const auth = require("../middleware/auth");
require("dotenv").config();

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

// accessToken, refeshToken 재발급 과정 동작이 원활한지 테스트를 만들도록 함
router.get("/dashboard", auth.verifyToken, userCtrl.dashboard);

module.exports = router;
