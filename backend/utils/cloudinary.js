const cloudinary = require('cloudinary').v2;
const logger = require('./logger');

// Configure Cloudinary only if credentials are provided
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'demo' &&
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_KEY !== 'demo';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary configured');
} else {
  console.log('⚠️  Cloudinary not configured - using placeholder images');
}

// Upload image to Cloudinary
exports.uploadImage = async (base64Image, folder = 'listings') => {
  // If Cloudinary not configured, return placeholder
  if (!isCloudinaryConfigured) {
    logger.info('Using placeholder image (Cloudinary not configured)');
    return {
      url: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Ethiopia+Market',
      publicId: 'placeholder-' + Date.now()
    };
  }

  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: `ethiopia-market/${folder}`,
      resource_type: 'auto',
      transformation: [
        { width: 1024, height: 1024, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    logger.error('Cloudinary upload error:', error);
    // Fallback to placeholder if upload fails
    return {
      url: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Image',
      publicId: 'error-' + Date.now()
    };
  }
};

// Delete image from Cloudinary
exports.deleteImage = async (publicId) => {
  // Skip if not configured or placeholder
  if (!isCloudinaryConfigured || publicId.startsWith('placeholder') || publicId.startsWith('error')) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info(`Deleted image: ${publicId}`);
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    // Don't throw error, just log it
  }
};

// Upload multiple images
exports.uploadMultipleImages = async (base64Images, folder = 'listings') => {
  try {
    // Return empty array if no images
    if (!base64Images || base64Images.length === 0) {
      return [];
    }

    const uploadPromises = base64Images.map(image => 
      exports.uploadImage(image, folder) // Use exports instead of this
    );
    const results = await Promise.all(uploadPromises);
    
    logger.info(`Uploaded ${results.length} images`);
    return results;
  } catch (error) {
    logger.error('Multiple image upload error:', error);
    throw error;
  }
};

