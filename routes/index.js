const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.send('Prod Server'));
router.use('/users', require('./user'));
router.use('/records', require('./record'));
router.use('/attend-points', require('./attendPoint'));
router.use('/auth', require('./auth'));
router.use('/stretchings/difficulty', require('./difficulty'));

module.exports = router;
