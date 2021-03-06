const express = require('express');

const router = express.Router();
const stretchingCtrl = require('../controllers/stretching');
const validator = require('../middleware/validator/stretching');
const commonValidator = require('../middleware/validator/common');
const validatorError = require('../middleware/validatorError');

router.get('/', validator.getStretchings, validatorError.err, stretchingCtrl.getStretchings);
router.get('/:idx', commonValidator.checkParamIdx, validatorError.err, stretchingCtrl.getStretching);
router.get('/tag/match', stretchingCtrl.getTagStretchings);
router.get('/recommend/:idx', commonValidator.checkParamIdx, validatorError.err, stretchingCtrl.getRecommendStretchings);



module.exports = router;
