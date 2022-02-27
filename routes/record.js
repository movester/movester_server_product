const express = require('express');

const router = express.Router();
const recordCtrl = require('../controllers/record');
const validator = require('../middleware/validator/record');
const validatorError = require('../middleware/validatorError');
const auth = require('../middleware/auth');

router.post('/', auth.checkToken, validator.checkBodyType, validator.checkBodyRecord, validatorError.err, recordCtrl.createRecord);
router.patch('/', auth.checkToken, validator.checkBodyType, validator.checkBodyRecord, validatorError.err, recordCtrl.updateRecord);
router.delete('/:type', auth.checkToken, validator.checkParamType, validatorError.err, recordCtrl.deleteRecord);
router.get('/summary', auth.checkToken, recordCtrl.getSummaryRecords);

module.exports = router;
