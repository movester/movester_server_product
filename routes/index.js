const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.send('Prod Server'));
router.use('/users', require('./user'));
router.use('/attend-points', require('./attendPoint'));

module.exports = router;
