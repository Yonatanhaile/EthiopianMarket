const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    match: [/^(\+251|0)[0-9]{9}$/, 'Invalid phone number']
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 10*60*1000) // 10 minutes
  },
  verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // Auto-delete after 10 minutes
  }
});

// Index for phone number
OTPSchema.index({ phone: 1, expiresAt: 1 });

module.exports = mongoose.model('OTP', OTPSchema);

