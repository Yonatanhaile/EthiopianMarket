const express = require('express');
const router = express.Router();
const { authLimiter } = require('../middleware/rateLimiter');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.put('/update', protect, updateDetails);
router.put('/update-password', protect, updatePassword);

module.exports = router;

