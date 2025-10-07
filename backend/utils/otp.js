const OTP = require('../models/OTP');
const logger = require('./logger');

// Only require twilio if not in mock mode
let client = null;
if (process.env.TWILIO_MOCK_MODE !== 'true') {
  try {
    const twilio = require('twilio');
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
  } catch (error) {
    console.log('⚠️  Twilio not configured, using mock mode');
  }
}

// Generate OTP
exports.generateOTP = () => {
  const length = parseInt(process.env.OTP_LENGTH) || 6;
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
};

// Send OTP via SMS
exports.sendOTP = async (phone) => {
  try {
    // Normalize phone number
    const normalizedPhone = phone.startsWith('0') 
      ? `+251${phone.substring(1)}` 
      : phone.startsWith('+251') 
        ? phone 
        : `+251${phone}`;

    // Generate OTP
    const otpCode = this.generateOTP();
    
    // Delete any existing OTPs for this phone
    await OTP.deleteMany({ phone: normalizedPhone });

    // Save OTP to database
    await OTP.create({
      phone: normalizedPhone,
      otp: otpCode,
      expiresAt: new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000)
    });

    // Send SMS (if not in mock mode)
    if (process.env.TWILIO_MOCK_MODE !== 'true' && client) {
      await client.messages.create({
        body: `Your Ethiopia Market verification code is: ${otpCode}. Valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: normalizedPhone
      });
      logger.info(`OTP sent to ${normalizedPhone}`);
    } else {
      // Mock mode - log OTP to console
      console.log(`📱 Mock OTP for ${normalizedPhone}: ${otpCode}`);
      logger.info(`Mock OTP generated for ${normalizedPhone}: ${otpCode}`);
    }

    return {
      success: true,
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV === 'development' && { otp: otpCode })
    };
  } catch (error) {
    logger.error('Error sending OTP:', error);
    throw error;
  }
};

// Verify OTP
exports.verifyOTP = async (phone, otpCode) => {
  try {
    // Normalize phone number
    const normalizedPhone = phone.startsWith('0') 
      ? `+251${phone.substring(1)}` 
      : phone.startsWith('+251') 
        ? phone 
        : `+251${phone}`;

    // Find OTP
    const otpRecord = await OTP.findOne({
      phone: normalizedPhone,
      verified: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return {
        success: false,
        message: 'OTP expired or not found'
      };
    }

    // Increment attempts
    otpRecord.attempts += 1;
    await otpRecord.save();

    // Check max attempts
    if (otpRecord.attempts > 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return {
        success: false,
        message: 'Too many failed attempts. Please request a new OTP'
      };
    }

    // Verify OTP
    if (otpRecord.otp !== otpCode) {
      return {
        success: false,
        message: 'Invalid OTP'
      };
    }

    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    return {
      success: true,
      message: 'OTP verified successfully'
    };
  } catch (error) {
    logger.error('Error verifying OTP:', error);
    throw error;
  }
};

