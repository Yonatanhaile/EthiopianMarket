const Listing = require('../models/Listing');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const { uploadMultipleImages, deleteImage } = require('../utils/cloudinary');
const logger = require('../utils/logger');

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
exports.getListings = async (req, res, next) => {
  try {
    const {
      category,
      region,
      search,
      status = 'active',
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = { status };

    if (category) query.category = category;
    if (region) query.region = region;
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query
    const listings = await Listing.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('seller', 'name phone rating')
      .lean();

    const total = await Listing.countDocuments(query);

    res.status(200).json({
      success: true,
      count: listings.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: listings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
exports.getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name phone email rating totalRatings createdAt');

    if (!listing) {
      return next(new ErrorResponse('Listing not found', 404));
    }

    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create listing
// @route   POST /api/listings
// @access  Private
exports.createListing = async (req, res, next) => {
  try {
    const {
      title,
      shortDescription,
      longDescription,
      category,
      region,
      images,
      contactMethods
    } = req.body;

    // Upload images to Cloudinary
    let uploadedImages = [];
    if (images && images.length > 0) {
      uploadedImages = await uploadMultipleImages(images, 'listings');
    }

    // Create listing
    const listing = await Listing.create({
      title,
      shortDescription,
      longDescription,
      category,
      region,
      images: uploadedImages,
      contactMethods,
      seller: req.user.id
    });

    // Populate seller info
    await listing.populate('seller', 'name phone rating');

    logger.info(`New listing created: ${listing.id} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
exports.updateListing = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(new ErrorResponse('Listing not found', 404));
    }

    const {
      title,
      shortDescription,
      longDescription,
      category,
      region,
      images,
      contactMethods,
      status
    } = req.body;

    // Handle image updates
    let uploadedImages = listing.images;
    if (images && Array.isArray(images)) {
      // Delete old images from Cloudinary
      if (listing.images && listing.images.length > 0) {
        for (const img of listing.images) {
          if (img.publicId) {
            await deleteImage(img.publicId).catch(err => 
              logger.error('Error deleting image:', err)
            );
          }
        }
      }
      
      // Upload new images
      const base64Images = images.filter(img => img.startsWith('data:'));
      if (base64Images.length > 0) {
        uploadedImages = await uploadMultipleImages(base64Images, 'listings');
      }
    }

    // Update fields
    const fieldsToUpdate = {
      ...(title && { title }),
      ...(shortDescription && { shortDescription }),
      ...(longDescription && { longDescription }),
      ...(category && { category }),
      ...(region && { region }),
      ...(contactMethods && { contactMethods }),
      ...(status && { status }),
      images: uploadedImages
    };

    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).populate('seller', 'name phone rating');

    logger.info(`Listing updated: ${listing.id}`);

    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(new ErrorResponse('Listing not found', 404));
    }

    // Delete images from Cloudinary
    if (listing.images && listing.images.length > 0) {
      for (const img of listing.images) {
        if (img.publicId) {
          await deleteImage(img.publicId).catch(err =>
            logger.error('Error deleting image:', err)
          );
        }
      }
    }

    await listing.deleteOne();

    logger.info(`Listing deleted: ${req.params.id}`);

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment listing views
// @route   PUT /api/listings/:id/view
// @access  Public
exports.incrementViews = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(new ErrorResponse('Listing not found', 404));
    }

    await listing.incrementViews();

    res.status(200).json({
      success: true,
      views: listing.views
    });
  } catch (error) {
    next(error);
  }
};

