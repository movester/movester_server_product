const express = require('express');

const router = express.Router();
const likeCtrl = require('../controllers/like');
const validator = require('../middleware/validator/like');
const validatorError = require('../middleware/validatorError');
const auth = require('../middleware/auth');

router.post('/', auth.checkToken, validator.create, validatorError.err, likeCtrl.createLike);

module.exports = router;
