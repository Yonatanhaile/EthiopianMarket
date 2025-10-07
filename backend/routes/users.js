const express = require('express');
const router = express.Router();
const {
  getUser,
  getUserListings,
  updateAvatar
} = require('../controllers/usersController');
const { protect } = require('../middleware/auth');

router.get('/:id', getUser);
router.get('/:id/listings', getUserListings);
router.put('/avatar', protect, updateAvatar);

module.exports = router;

