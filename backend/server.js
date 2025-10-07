const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow configured frontend URL or localhost on any port in development
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = app;

