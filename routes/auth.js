const express = require('express');
const authCtrl = require('../controllers/auth');

require('dotenv').config();

const router = express.Router();

router.get('/kakao/callback', authCtrl.getKakaoToken);

module.exports = router;
