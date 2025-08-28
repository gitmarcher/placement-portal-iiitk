const express = require('express');
const {login, logout, verify, signup} = require('../controllers/authController.js');

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', verify);
router.post('/signup', signup);

module.exports = router;