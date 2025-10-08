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

    // DEBUG LOGGING
    console.log('=== getUserListings DEBUG ===');
    console.log('req.params.id:', req.params.id);
    console.log('req.user:', req.user ? {
      id: req.user.id,
      _id: req.user._id,
      name: req.user.name,
      role: req.user.role
    } : 'NOT AUTHENTICATED');

    // Only filter by status if explicitly provided
    // This allows owners to see all their listings (pending, active, rejected, etc.)
    // But public viewers only see active listings
    if (status) {
      query.status = status;
      console.log('Status filter from query params:', status);
    } else {
      // If viewing own listings (authenticated and owner), show all statuses
      // Otherwise, only show active listings
      const userId = (req.user && (req.user.id || req.user._id))?.toString();
      const paramId = req.params.id?.toString();
      const isOwner = userId && paramId && userId === paramId;
      
      console.log('userId:', userId);
      console.log('paramId:', paramId);
      console.log('isOwner:', isOwner);
      
      if (!isOwner) {
        query.status = 'active';
        console.log('NOT OWNER - filtering to active only');
      } else {
        console.log('IS OWNER - showing all statuses');
      }
    }

    console.log('Final query:', query);
    console.log('=========================');

    const listings = await Listing.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('seller', 'name phone rating')
      .lean();

    const total = await Listing.countDocuments(query);

    console.log('Found listings count:', listings.length);
    console.log('Total in database:', total);
    if (listings.length > 0) {
      console.log('First listing:', {
        title: listings[0].title,
        status: listings[0].status,
        seller: listings[0].seller
      });
    }

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


