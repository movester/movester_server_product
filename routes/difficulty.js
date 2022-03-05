const express = require('express');

const router = express.Router();
const difficultyCtrl = require('../controllers/difficulty');
const validator = require('../middleware/validator/difficulty');
const commonValidator = require('../middleware/validator/common');
const validatorError = require('../middleware/validatorError');
const auth = require('../middleware/auth');

router.post('/', auth.checkToken, validator.createDifficulty, validatorError.err, difficultyCtrl.createDifficulty);
router.delete('/:idx', auth.checkToken, commonValidator.checkParamIdx, validatorError.err, difficultyCtrl.deleteDifficulty);

module.exports = router;
