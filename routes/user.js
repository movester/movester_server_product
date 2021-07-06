const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const Validator = require("../middleware/validator");
const ValidatorError = require("../middleware/validatorError");
const auth = require("../middleware/auth");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");

router.post("/join", Validator.join, ValidatorError.join, userCtrl.join);
router.post("/login", Validator.login, ValidatorError.login, userCtrl.login);
router.post(
    "/emailVerify",
    Validator.emailVerify,
    ValidatorError.emailVerify,
    userCtrl.emailVerify
);
router.post(
    "/getAccessToken",
    auth.verifyRefreshToken,
    userCtrl.getAccessToken
);
router.get("/logout", auth.verifyToken, userCtrl.logout);
// test api
router.get("/dashboard", auth.verifyToken, userCtrl.dashboard);
router.get("/auth", auth.verifyToken, (req, res) => {
    const authUser = {
        isAuth: true,
        email: req.decodeData.sub,
        accessToken: req.accessToken
    };
    res.json(utils.successTrue(responseMessage.LOGIN_SUCCESS, authUser));
});

module.exports = router;