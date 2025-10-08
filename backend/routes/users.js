const express = require('express');
const router = express.Router();
const {
  getUser,
  getUserListings,
  updateAvatar
} = require('../controllers/usersController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/:id', getUser);
router.get('/:id/listings', getUserListings);

// Protected routes
router.put('/avatar', protect, updateAvatar);

module.exports = router;





