const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Please provide a short description'],
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  longDescription: {
    type: String,
    required: [true, 'Please provide a detailed description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['electronics', 'vehicles', 'realestate', 'fashion', 'home', 'services', 'jobs', 'other']
  },
  region: {
    type: String,
    required: [true, 'Please select a region'],
    enum: ['addisababa', 'oromia', 'amhara', 'tigray', 'somali', 'afar', 'sidama', 'snnpr', 'other']
  },
  images: [{
    url: String,
    publicId: String
  }],
  contactMethods: {
    phone: String,
    whatsapp: String,
    telegram: String,
    email: String
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected', 'expired', 'sold'],
    default: 'pending'
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ListingSchema.index({ category: 1, region: 1, status: 1 });
ListingSchema.index({ seller: 1, status: 1 });
ListingSchema.index({ createdAt: -1 });
ListingSchema.index({ title: 'text', shortDescription: 'text', longDescription: 'text' });

// Increment views
ListingSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

module.exports = mongoose.model('Listing', ListingSchema);


