const express = require('express');
const router = express.Router();
const {
  getUser,
  getUserListings,
  updateAvatar
} = require('../controllers/usersController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/:id', getUser);
router.get('/:id/listings', optionalAuth, getUserListings);

// Protected routes
router.put('/avatar', protect, updateAvatar);

module.exports = router;





