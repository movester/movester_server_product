const express = require('express');

const router = express.Router();
const likeCtrl = require('../controllers/like');
const validator = require('../middleware/validator/like');
const commonValidator = require('../middleware/validator/common');
const validatorError = require('../middleware/validatorError');
const auth = require('../middleware/auth');

router.post('/', auth.checkToken, validator.create, validatorError.err, likeCtrl.createLike);
router.delete('/:idx', auth.checkToken, commonValidator.checkParamIdx, validatorError.err, likeCtrl.deleteLike);
router.get('/', auth.checkToken, likeCtrl.getLikes);

module.exports = router;
