const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return next(new ErrorResponse('Please provide name, email, and password', 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new ErrorResponse('Email already registered', 400));
    }

    // Create user (only include phone if it's a non-empty string)
    const userData = {
      name,
      email: email.toLowerCase(),
      password,
      isVerified: true,
      role: 'seller'
    };

    // Only add phone if it's provided and not empty
    if (phone && phone.trim() !== '') {
      userData.phone = phone.trim();
    }

    const user = await User.create(userData);

    // Generate token
    const token = user.generateAuthToken();

    logger.info(`New user registered: ${user.id}`);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    // Log the full error for debugging
    console.error('=== REGISTRATION ERROR DEBUG ===');
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error('================================');

    logger.error('Registration error:', {
      name: error.name,
      code: error.code,
      message: error.message,
      errors: error.errors,
      stack: error.stack
    });

    // MongoDB duplicate key error
    if (error.code === 11000) {
      const field = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'unknown';
      return next(new ErrorResponse(`${field} already exists in database`, 400));
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return next(new ErrorResponse(messages.join(', '), 400));
    }

    // Return the actual error message in development
    if (process.env.NODE_ENV === 'development') {
      return next(new ErrorResponse(error.message || 'Registration failed', 500));
    }

    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new ErrorResponse('Account is deactivated', 403));
    }

    // Generate token
    const token = user.generateAuthToken();

    logger.info(`User logged in: ${user.id}`);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        rating: user.rating,
        totalRatings: user.totalRatings,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/update
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (phone) fieldsToUpdate.phone = phone;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    logger.info(`User updated details: ${user.id}`);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new ErrorResponse('Please provide current and new password', 400));
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(new ErrorResponse('Current password is incorrect', 401));
    }

    user.password = newPassword;
    await user.save();

    const token = user.generateAuthToken();

    logger.info(`User updated password: ${user.id}`);

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    next(error);
  }
};
