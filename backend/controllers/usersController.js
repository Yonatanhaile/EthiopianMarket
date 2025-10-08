const User = require('../models/User');
const Listing = require('../models/Listing');
const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-__v')
      .populate('listingsCount');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's listings
// @route   GET /api/users/:id/listings
// @access  Public
exports.getUserListings = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, status } = req.query;

    const query = {
      seller: req.params.id
    };

    // Only filter by status if explicitly provided
    // This allows owners to see all their listings (pending, active, rejected, etc.)
    // But public viewers only see active listings
    if (status) {
      query.status = status;
    } else {
      // If viewing own listings (authenticated and owner), show all statuses
      // Otherwise, only show active listings
      const isOwner = req.user && req.user.id === req.params.id;
      if (!isOwner) {
        query.status = 'active';
      }
    }

    const listings = await Listing.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('seller', 'name phone rating')
      .lean();

    const total = await Listing.countDocuments(query);

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

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return next(new ErrorResponse('Please provide an avatar image', 400));
    }

    const user = await User.findById(req.user.id);

    // Delete old avatar if exists
    if (user.avatar) {
      // Extract public ID from URL and delete
      const urlParts = user.avatar.split('/');
      const publicId = urlParts.slice(-2).join('/').split('.')[0];
      await deleteImage(publicId).catch(err => logger.error('Error deleting old avatar:', err));
    }

    // Upload new avatar
    const result = await uploadImage(avatar, 'avatars');
    user.avatar = result.url;
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};


