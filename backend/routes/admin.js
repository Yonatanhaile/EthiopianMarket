const express = require('express');
const router = express.Router();
const {
  getStats,
  getPendingListings,
  approveListing,
  rejectListing,
  getAllUsers,
  deactivateUser,
  activateUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All admin routes require authentication
router.use(authorize('admin')); // All admin routes require admin role

router.get('/stats', getStats);
router.get('/listings/pending', getPendingListings);
router.put('/listings/:id/approve', approveListing);
router.put('/listings/:id/reject', rejectListing);
router.get('/users', getAllUsers);
router.put('/users/:id/deactivate', deactivateUser);
router.put('/users/:id/activate', activateUser);

module.exports = router;

