const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const Validator = require("../utils/validator");
const ValidatorError = require("../utils/validatorError");

router.post("/join", Validator.join, ValidatorError.join, userCtrl.join);
router.post("/login", Validator.login, ValidatorError.login, userCtrl.login);
router.post("/emailVerify", Validator.emailVerify, ValidatorError.emailVerify, userCtrl.emailVerify);

module.exports = router;
