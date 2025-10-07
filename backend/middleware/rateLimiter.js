const rateLimit = require('express-rate-limit');

// General API rate limiter
exports.apiLimiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth endpoints
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 100 : 20, // High limit for development
  message: { success: false, error: 'Too many authentication attempts, please try again later' },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP limiter
exports.otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'development' ? 50 : 3, // High limit for development
  message: { success: false, error: 'Please wait before requesting another OTP' },
  skipFailedRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

