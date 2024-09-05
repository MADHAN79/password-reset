const express = require('express');
const router = express.Router();
const { forgotPassword } = require('../controllers/authController');

// Define forgot password route
router.post('/forgot-password', forgotPassword);

module.exports = router;


const { resetPassword } = require('../controllers/authController');

// Define reset password route
router.post('/reset-password/:token', resetPassword);
