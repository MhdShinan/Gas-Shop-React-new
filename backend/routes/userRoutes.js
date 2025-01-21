const express = require('express');
const { registerUser, verifyOTP, loginUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);  // Correctly mapped to the loginUser controller

module.exports = router;
