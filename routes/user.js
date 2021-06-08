const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

router.post("/join", userCtrl.join);
router.post("/login", userCtrl.login);
router.post("/emailVerify", userCtrl.emailVerify);

module.exports = router;
