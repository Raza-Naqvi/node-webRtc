const express = require("express");
const userController = require("../Controllers/userController");

const router = express();

router.get('/', userController.loadIndex);

module.exports = router;