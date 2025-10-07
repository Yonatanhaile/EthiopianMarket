const User = require('../models/User');
const Listing = require('../models/Listing');
const Message = require('../models/Message');
const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const activeListings = await Listing.countDocuments({ status: 'active' });
    const pendingListings = await Listing.countDocuments({ status: 'pending' });
    const totalMessages = await Message.countDocuments();

    // Recent users (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const newListings = await Listing.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Category breakdown
    const listingsByCategory = await Listing.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          newThisWeek: newUsers
        },
        listings: {
          total: totalListings,
          active: activeListings,
          pending: pendingListings,
          newThisWeek: newListings,
          byCategory: listingsByCategory
        },
        messages: {
          total: totalMessages
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending listings
// @route   GET /api/admin/listings/pending
// @access  Private/Admin
exports.getPendingListings = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const listings = await Listing.find({ status: 'pending' })
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('seller', 'name phone email createdAt')
      .lean();

    const total = await Listing.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      count: listings.length,
      total,
      data: listings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve listing
// @route   PUT /api/admin/listings/:id/approve
// @access  Private/Admin
exports.approveListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(new ErrorResponse('Listing not found', 404));
    }

    listing.status = 'active';
    await listing.save();

    logger.info(`Listing approved: ${listing.id} by admin ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject listing
// @route   PUT /api/admin/listings/:id/reject
// @access  Private/Admin
exports.rejectListing = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(new ErrorResponse('Listing not found', 404));
    }

    listing.status = 'rejected';
    await listing.save();

    logger.info(`Listing rejected: ${listing.id} by admin ${req.user.id}. Reason: ${reason || 'Not provided'}`);

    res.status(200).json({
      success: true,
      message: 'Listing rejected',
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, isActive } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v')
      .populate('listingsCount')
      .lean();

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate user
// @route   PUT /api/admin/users/:id/deactivate
// @access  Private/Admin
exports.deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    user.isActive = false;
    await user.save();

    // Also deactivate all user's listings
    await Listing.updateMany(
      { seller: user._id },
      { status: 'expired' }
    );

    logger.info(`User deactivated: ${user.id} by admin ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'User deactivated',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate user
// @route   PUT /api/admin/users/:id/activate
// @access  Private/Admin
exports.activateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    user.isActive = true;
    await user.save();

    logger.info(`User activated: ${user.id} by admin ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'User activated',
      data: user
    });
  } catch (error) {
    next(error);
  }
};


