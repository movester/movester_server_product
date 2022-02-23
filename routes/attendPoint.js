const express = require('express');

const router = express.Router();
const attendPointCtrl = require('../controllers/attendPoint');
const auth = require('../middleware/auth');
const Validator = require('../middleware/validator/attendPoint');
const ValidatorError = require('../middleware/validatorError');

router.post('/', auth.checkToken, attendPointCtrl.createAttendPoint);
router.get('/', auth.checkToken, Validator.checkYearMonth, ValidatorError.err, attendPointCtrl.getAttendPoints);

module.exports = router;
