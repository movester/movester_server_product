const express = require('express');
const authCtrl = require('../controllers/auth');

require('dotenv').config();

const router = express.Router();

router.get('/kakao', authCtrl.getAuthCode);
router.get('/kakao/callback', authCtrl.getToken);

module.exports = router;
