const express = require('express');

const router = express.Router();
const weekCtrl = require('../controllers/week');

router.get('/expose', weekCtrl.getExposedWeek);


module.exports = router;
