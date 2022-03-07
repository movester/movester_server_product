const express = require('express');

const router = express.Router();
const stretchingCtrl = require('../controllers/stretching');
const validator = require('../middleware/validator/stretching');
const validatorError = require('../middleware/validatorError');

router.get('/', validator.getStretchings, validatorError.err, stretchingCtrl.getStretchings);



module.exports = router;
