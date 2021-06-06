const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

router.get("/test", userCtrl.test);

module.exports = router;
