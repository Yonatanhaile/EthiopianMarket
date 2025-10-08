# Ethiopia Market Backend API

Complete REST API for the Ethiopia Market marketplace platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Run in development
npm run dev

# Run in production
npm start
```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── listingsController.js # Listings CRUD
│   ├── messagesController.js # Messaging system
│   ├── usersController.js    # User management
│   └── adminController.js    # Admin operations
├── middleware/
│   ├── js              # JWT authentication
│   ├── errorHandler.js      # Error handling
│   └── rateLimiter.js       # Rate limiting
├── models/
│   ├── User.js              # User schema
│   ├── Listing.js           # Listing schema
│   ├── Message.js           # Message schema
│   └── OTP.js               # OTP schema
├── routes/
│   ├── js              # Auth routes
│   ├── listings.js          # Listing routes
│   ├── messages.js          # Message routes
│   ├── users.js             # User routes
│   └── admin.js             # Admin routes
├── utils/
│   ├── cloudinary.js        # Image upload
│   ├── otp.js               # OTP generation/verification
│   ├── logger.js            # Winston logger
│   └── errorResponse.js     # Custom error class
├── logs/                    # Application logs
├── .env.example             # Environment template
├── server.js                # Entry point
└── package.json
```

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/send-otp     Send OTP to phone number
POST   /api/auth/verify-otp   Verify OTP code
POST   /api/auth/register     Register new user
POST   /api/auth/login        Login with OTP
GET    /api/auth/me           Get current user
PUT    /api/auth/profile      Update profile
```

### Listings

```
GET    /api/listings          Get all listings (with filters)
GET    /api/listings/:id      Get single listing
POST   /api/listings          Create listing (auth required)
PUT    /api/listings/:id      Update listing (auth + owner)
DELETE /api/listings/:id      Delete listing (auth + owner)
PUT    /api/listings/:id/view Increment view count
```

### Users

```
GET    /api/users/:id             Get user profile
GET    /api/users/:id/listings    Get user's listings
PUT    /api/users/avatar          Update avatar (auth required)
```

### Messages

```
POST   /api/messages                      Send message (auth required)
GET    /api/messages/conversations        Get user conversations
GET    /api/messages/:listingId/:userId   Get conversation messages
PUT    /api/messages/:id/read             Mark as read
```

### Admin

```
GET    /api/admin/stats                   Get dashboard stats
GET    /api/admin/listings/pending        Get pending listings
PUT    /api/admin/listings/:id/approve    Approve listing
PUT    /api/admin/listings/:id/reject     Reject listing
GET    /api/admin/users                   Get all users
PUT    /api/admin/users/:id/deactivate    Deactivate user
PUT    /api/admin/users/:id/activate      Activate user
```

## 🔐 Authentication

API uses JWT (JSON Web Tokens) for authentication.

### Get Token
Login or register to receive a token:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Use Token
Include in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 📝 Request/Response Examples

### Register User

**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Abebe Kebede",
  "phone": "+251911234567",
  "email": "abebe@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Abebe Kebede",
    "phone": "+251911234567",
    "email": "abebe@example.com",
    "role": "seller",
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Create Listing

**Request:**
```bash
POST /api/listings
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "iPhone 13 Pro",
  "shortDescription": "Like new condition",
  "longDescription": "iPhone 13 Pro in excellent condition...",
  "category": "electronics",
  "region": "addisababa",
  "images": ["data:image/jpeg;base64,..."],
  "contactMethods": {
    "phone": "+251911234567",
    "whatsapp": "+251911234567"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "iPhone 13 Pro",
    "shortDescription": "Like new condition",
    "category": "electronics",
    "region": "addisababa",
    "images": [
      {
        "url": "https://res.cloudinary.com/.../image.jpg",
        "publicId": "ethiopia-market/listings/xyz123"
      }
    ],
    "seller": {
      "_id": "507f191e810c19729de860ea",
      "name": "Abebe Kebede",
      "phone": "+251911234567",
      "rating": 4.8
    },
    "status": "active",
    "views": 0,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get Listings with Filters

**Request:**
```bash
GET /api/listings?category=electronics&region=addisababa&page=1&limit=12
```

**Response:**
```json
{
  "success": true,
  "count": 12,
  "total": 45,
  "totalPages": 4,
  "currentPage": 1,
  "data": [
    { ... },
    { ... }
  ]
}
```

## 🖼️ Image Upload

Images are uploaded to Cloudinary and compressed automatically.

### Format
Send images as base64 strings:
```json
{
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "data:image/png;base64,iVBORw0KGgoAA..."
  ]
}
```

### Processing
- Maximum size: 1024x1024
- Format: Auto (WebP preferred)
- Quality: Auto optimization
- Folder: `ethiopia-market/listings/` or `ethiopia-market/avatars/`

## 📧 OTP System

### Send OTP
```bash
POST /api/auth/send-otp
{
  "phone": "+251911234567"
}
```

### Verify OTP
```bash
POST /api/auth/verify-otp
{
  "phone": "+251911234567",
  "otp": "123456"
}
```

### Configuration
- Length: 6 digits (configurable)
- Expiry: 10 minutes (configurable)
- Max attempts: 3
- Rate limit: 1 per minute

### Mock Mode
Set `TWILIO_MOCK_MODE=true` to:
- Skip real SMS sending
- Log OTP to console
- Accept any valid format OTP

## 🔒 Security Features

### Rate Limiting
- General API: 100 requests / 15 minutes
- Auth endpoints: 5 requests / 15 minutes
- OTP requests: 1 request / minute

### Input Validation
- Express Validator for all inputs
- Phone number format validation
- Email validation
- Required field checks

### Error Handling
- Centralized error middleware
- Detailed error messages in development
- Generic messages in production
- Error logging with Winston

### Security Headers
- Helmet.js for HTTP headers
- CORS configured
- XSS protection
- Content Security Policy

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  phone: String (unique),
  email: String,
  role: 'user' | 'seller' | 'admin',
  isVerified: Boolean,
  isActive: Boolean,
  avatar: String,
  rating: Number,
  totalRatings: Number,
  totalViews: Number,
  createdAt: Date
}
```

### Listing Model
```javascript
{
  title: String,
  shortDescription: String,
  longDescription: String,
  category: Enum,
  region: Enum,
  images: [{ url, publicId }],
  contactMethods: {
    phone, whatsapp, telegram, email
  },
  seller: ObjectId (ref: User),
  status: 'pending' | 'active' | 'rejected' | 'expired' | 'sold',
  views: Number,
  featured: Boolean,
  expiresAt: Date,
  createdAt: Date
}
```

### Message Model
```javascript
{
  listing: ObjectId (ref: Listing),
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  content: String,
  isRead: Boolean,
  readAt: Date,
  createdAt: Date
}
```

## 🧪 Testing

### Manual Testing
Use tools like Postman or Insomnia with the provided endpoints.

### Test User Creation
```bash
# Register test user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "+251911111111",
    "otp": "123456"
  }'
```

## 📈 Monitoring

### Logs
- Location: `logs/` directory
- Types: `combined.log`, `error.log`
- Format: JSON with timestamps

### Health Check
```bash
GET /health

Response:
{
  "success": true,
  "message": "Server is running",
  "environment": "production"
}
```

## 🔧 Configuration

### Environment Variables
See `.env.example` for all available options.

### MongoDB Indexes
Automatically created on application start:
- User: phone (unique)
- Listing: category, region, status, seller
- Message: sender, receiver, listing
- Text search: title, descriptions

## 🚀 Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for complete deployment instructions.

### Quick Deploy with Docker
```bash
docker build -t ethiopia-market-backend .
docker run -p 5000:5000 --env-file .env ethiopia-market-backend
```

## 📖 API Documentation

### Swagger/OpenAPI
Coming soon: Interactive API documentation at `/api-docs`

### Postman Collection
Import collection from: `docs/postman-collection.json` (coming soon)

## 🤝 Contributing

1. Follow existing code style
2. Add JSDoc comments
3. Update tests
4. Update documentation

## 📝 License

MIT License - See LICENSE file for details

---

Built with ❤️ for Ethiopia






