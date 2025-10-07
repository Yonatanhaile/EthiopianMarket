const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        // More lenient email validation that accepts various TLDs
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  phone: {
    type: String,
    trim: true,
    match: [
      /^(\+251|0)[0-9]{9}$/,
      'Please provide a valid Ethiopian phone number'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'seller'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
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

// Virtual for listings count
UserSchema.virtual('listingsCount', {
  ref: 'Listing',
  localField: '_id',
  foreignField: 'seller',
  count: true
});

// Create sparse index for phone to allow multiple null values
// but ensure uniqueness when phone is provided
UserSchema.index({ phone: 1 }, { unique: true, sparse: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = mongoose.model('User', UserSchema);

