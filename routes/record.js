const express = require('express');

const router = express.Router();
const recordCtrl = require('../controllers/record');
const validator = require('../middleware/validator/record');
const validatorError = require('../middleware/validatorError');
const auth = require('../middleware/auth');

router.post('/', auth.checkToken, validator.checkType, validator.checkRecord, validatorError.err, recordCtrl.createRecord);

module.exports = router;
