const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const Validator = require("../utils/validator");
const ValidatorError = require("../utils/validatorError");
const auth = require("../middleware/auth")

router.post("/join", Validator.join, ValidatorError.join, userCtrl.join);
router.post("/login", Validator.login, ValidatorError.login, userCtrl.login);
router.post("/emailVerify", Validator.emailVerify, ValidatorError.emailVerify, userCtrl.emailVerify);
router.post("/getAccessToken", auth.verifyRefreshToken, userCtrl.getAccessToken);
router.get('/logout', auth.verifyToken, userCtrl.logout)
// test api
router.get("/dashboard", auth.verifyToken, userCtrl.dashboard);


module.exports = router;
