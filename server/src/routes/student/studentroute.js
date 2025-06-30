const express = require('express');
const router = express.Router();
const driveroute = require("./drive")
const profileroute = require("./profile")
const register = require("./registration")
const dashboard = require("./dashboard")
router.use("/drive",driveroute)
router.use("/profile",profileroute)
router.use("/register",register)
router.use("/dashboard",dashboard)

module.exports = router;

