const express = require('express');

const router = express.Router();
const recordCtrl = require('../controllers/record');
const validator = require('../middleware/validator/record');
const validatorError = require('../middleware/validatorError');
const auth = require('../middleware/auth');

router.post('/', auth.checkToken, validator.checkQueryType, validator.checkQueryRecord, validatorError.err, recordCtrl.createRecord);
router.patch('/', auth.checkToken, validator.checkBodyType, validator.checkBodyRecord, validatorError.err, recordCtrl.updateRecord);
router.delete('/:type', auth.checkToken, validator.checkParamType, validatorError.err, recordCtrl.deleteRecord);
router.get('/summary', auth.checkToken, recordCtrl.getSummaryRecords);
router.get('/:type', auth.checkToken, validator.checkParamType, validatorError.err, recordCtrl.getRecords);
router.get('/search/:type', auth.checkToken, validator.checkParamType, validator.checkQueryDate, validatorError.err, recordCtrl.getSearchRecords);

module.exports = router;
