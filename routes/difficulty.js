const express = require('express');

const router = express.Router();
const difficultyCtrl = require('../controllers/difficulty');
const validator = require('../middleware/validator/difficulty');
const validatorError = require('../middleware/validatorError');
const auth = require('../middleware/auth');

router.post('/', auth.checkToken, validator.createDifficulty, validatorError.err, difficultyCtrl.createDifficulty);

module.exports = router;
