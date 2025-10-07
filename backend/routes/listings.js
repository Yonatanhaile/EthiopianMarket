const express = require('express');
const router = express.Router();
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  incrementViews
} = require('../controllers/listingsController');
const { protect } = require('../middleware/auth');
const Listing = require('../models/Listing');
const { checkOwnership } = require('../middleware/auth');

router.route('/')
  .get(getListings)
  .post(protect, createListing);

router.route('/:id')
  .get(getListing)
  .put(protect, checkOwnership(Listing), updateListing)
  .delete(protect, checkOwnership(Listing), deleteListing);

router.put('/:id/view', incrementViews);

module.exports = router;

