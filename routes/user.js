const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');
const Validator = require('../middleware/validator/user');
const ValidatorError = require('../middleware/validatorError');
const auth = require('../middleware/auth');

router.post('/join', Validator.join, ValidatorError.join, userCtrl.join);
router.post('/login', Validator.login, ValidatorError.login, userCtrl.login);
router.get('/logout', auth.checkToken, userCtrl.logout);
router.patch('/email-auth/join', Validator.emailAuth, ValidatorError.emailAuth, userCtrl.emailAuthForJoin);


module.exports = router;
