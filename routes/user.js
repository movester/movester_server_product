const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');
const Validator = require('../middleware/validator/user');
const ValidatorError = require('../middleware/validatorError');
const auth = require('../middleware/auth');

router.post('/join', Validator.join, ValidatorError.err, userCtrl.join);
router.post('/login', Validator.login, ValidatorError.err, userCtrl.login);
router.get('/logout', auth.checkToken, userCtrl.logout);
router.patch('/email-auth/join', Validator.emailAuthForJoin, ValidatorError.err, userCtrl.emailAuthForJoin);
router.post('/email-auth/password', Validator.checkEmail, ValidatorError.err, userCtrl.sendEmailForPwChange);
router.get('/email-auth/password', Validator.emailAuthForPw, ValidatorError.err, userCtrl.emailAuthForPw);

module.exports = router;
