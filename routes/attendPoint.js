const express = require('express');

const router = express.Router();
const attendPointCtrl = require('../controllers/attendPoint');
const auth = require('../middleware/auth');

router.post('/', auth.checkToken, attendPointCtrl.createAttendPoint);

module.exports = router;
