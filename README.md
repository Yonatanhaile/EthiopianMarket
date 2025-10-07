# 🇪🇹 Ethiopia Market - Full Stack Marketplace

A complete, production-ready marketplace platform optimized for Ethiopia with real-time messaging, OTP authentication, and low-bandwidth support.

## ✨ Features

### 🔐 Authentication & Security
- **OTP-based authentication** via SMS (Twilio)
- JWT token management
- Protected routes
- Role-based access control (User, Seller, Admin)
- Rate limiting & security headers

### 📱 Core Functionality
- **Listings Management**: Create, edit, delete listings with images
- **Real-time Search**: Category, region, and text search
- **Messaging System**: Direct messaging between buyers and sellers
- **User Profiles**: View seller ratings and listings
- **Admin Dashboard**: Content moderation and user management
- **Image Upload**: Cloudinary integration with auto-compression

### 🌍 Ethiopia-Specific
- Ethiopian phone number validation (+251)
- Amharic language support (አማርኛ)
- Regional filters (Addis Ababa, Oromia, Amhara, etc.)
- WhatsApp & Telegram integration
- Low-data mode for slow connections
- Mobile-first design

### 🚀 Technical Features
- Progressive Web App (PWA)
- Lazy image loading
- Client-side image compression
- Responsive design
- MongoDB database
- RESTful API
- Docker support

## 📦 Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack React Query** for data fetching
- **React Hook Form** for forms
- **react-i18next** for internationalization
- **vite-plugin-pwa** for PWA features

### Backend
- **Node.js** + **Express**
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for image storage
- **Twilio** for SMS OTP
- **Winston** for logging
- **Helmet** for security

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Cloudinary account
- Twilio account (optional, can use mock mode)

### 1. Clone Repository

```bash
git clone <repository-url>
cd ethiopia-market
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Required environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/ethiopia-market
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
TWILIO_MOCK_MODE=true  # Set false for production
```

```bash
# Start backend
npm run dev
```

Backend runs at: http://localhost:5000

### 3. Frontend Setup

```bash
cd EthiopiaMarket

# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

# Start frontend
npm run dev
```

Frontend runs at: http://localhost:3000

### 4. Create First Admin User

```bash
# After registering a user, make them admin:
mongosh
use ethiopia-market
db.users.updateOne(
  { phone: "+251911234567" },
  { $set: { role: "admin" } }
)
```

## 📁 Project Structure

```
ethiopia-market/
├── backend/                    # Node.js/Express API
│   ├── config/                # Database config
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Auth, errors, rate limiting
│   ├── models/                # MongoDB models
│   ├── routes/                # API routes
│   ├── utils/                 # Helpers (OTP, images, logging)
│   ├── .env.example           # Environment template
│   ├── server.js              # Entry point
│   ├── Dockerfile             # Docker configuration
│   └── package.json
│
├── EthiopiaMarket/            # React/Vite frontend
│   ├── src/
│   │   ├── api/               # API client
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── i18n/              # Translations (EN/AM)
│   │   ├── pages/             # Route pages
│   │   ├── utils/             # Utilities
│   │   ├── App.jsx            # Main app
│   │   └── main.jsx           # Entry point
│   ├── public/                # Static assets
│   ├── Dockerfile             # Docker configuration
│   ├── nginx.conf             # Nginx config
│   └── package.json
│
├── docker-compose.yml         # Docker Compose config
├── DEPLOYMENT.md              # Deployment guide
└── README.md                  # This file
```

## 🐳 Docker Deployment

### Quick Start with Docker

```bash
# Create .env file with your credentials
nano .env

# Build and run
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Services:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **MongoDB**: localhost:27017

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/send-otp      # Send OTP to phone
POST   /api/auth/verify-otp    # Verify OTP
POST   /api/auth/register      # Register user
POST   /api/auth/login         # Login with OTP
GET    /api/auth/me            # Get current user
PUT    /api/auth/profile       # Update profile
```

### Listings
```
GET    /api/listings           # Get all listings
GET    /api/listings/:id       # Get single listing
POST   /api/listings           # Create listing (auth)
PUT    /api/listings/:id       # Update listing (auth + owner)
DELETE /api/listings/:id       # Delete listing (auth + owner)
```

### Messages
```
POST   /api/messages                      # Send message
GET    /api/messages/conversations        # Get conversations
GET    /api/messages/:listingId/:userId   # Get messages
PUT    /api/messages/:id/read             # Mark as read
```

### Admin
```
GET    /api/admin/stats                   # Dashboard stats
GET    /api/admin/listings/pending        # Pending listings
PUT    /api/admin/listings/:id/approve    # Approve listing
PUT    /api/admin/listings/:id/reject     # Reject listing
GET    /api/admin/users                   # Get all users
PUT    /api/admin/users/:id/deactivate    # Deactivate user
```

Full API documentation: [backend/README.md](./backend/README.md)

## 🔐 Authentication Flow

1. User enters phone number
2. Backend sends OTP via Twilio (or mock in dev)
3. User enters 6-digit OTP
4. Backend verifies OTP and issues JWT token
5. Frontend stores token and user data
6. Token used for all authenticated requests

## 📱 User Guide

### For Buyers
1. Browse listings on home page
2. Use search and filters
3. View listing details
4. Contact seller via WhatsApp, Telegram, Phone, or Email
5. Send messages to sellers

### For Sellers
1. Register/Login with phone number
2. Go to Dashboard
3. Click "Create Listing"
4. Fill form with:
   - Title, description, category
   - Region, images
   - Contact methods
5. Submit (listing goes live immediately)
6. Manage listings from dashboard
7. View messages from buyers

### For Admins
1. Login with admin account
2. Go to Admin Dashboard
3. View statistics
4. Approve/reject pending listings
5. Manage users
6. Monitor activity

## 🌍 Localization

### Supported Languages
- English (en)
- Amharic (አማርኛ) (am)

### Adding Translations
Edit translation files:
- `EthiopiaMarket/src/i18n/locales/en.json`
- `EthiopiaMarket/src/i18n/locales/am.json`

## 🎨 Customization

### Branding
Edit colors in `EthiopiaMarket/tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#10b981', // Main color
    600: '#059669', // Hover color
  }
}
```

### Categories
Add/edit categories in:
- `backend/models/Listing.js` (enum)
- `EthiopiaMarket/src/i18n/locales/en.json` (translations)

### Regions
Add/edit regions in:
- `backend/models/Listing.js` (enum)
- `EthiopiaMarket/src/i18n/locales/en.json` (translations)

## 🚢 Production Deployment

### Cloud Options
1. **Render.com** - Backend + MongoDB
2. **Vercel** - Frontend
3. **AWS EC2** - Full stack
4. **DigitalOcean** - Docker deployment
5. **Heroku** - Easy deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Environment Setup

**Backend Production:**
- Set `NODE_ENV=production`
- Use MongoDB Atlas
- Configure Cloudinary
- Set up Twilio with real phone number
- Set strong `JWT_SECRET`
- Enable HTTPS

**Frontend Production:**
- Update `VITE_API_BASE_URL` to production API
- Build: `npm run build`
- Deploy `dist` folder

## 🔧 Configuration

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-super-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=123456
CLOUDINARY_API_SECRET=abc123
TWILIO_ACCOUNT_SID=AC123...
TWILIO_AUTH_TOKEN=abc123...
TWILIO_PHONE_NUMBER=+1234567890
FRONTEND_URL=https://yoursite.com
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://api.yoursite.com/api
```

## 📊 Database Schema

### Collections
- **users** - User accounts
- **listings** - Product listings
- **messages** - Chat messages
- **otps** - OTP codes (temporary)

### Indexes
- User phone (unique)
- Listing: category, region, status
- Message: sender, receiver, listing
- Full-text search on listings

## 🔒 Security Features

- JWT authentication
- OTP verification
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration
- Helmet.js security headers
- Password-less authentication
- Token expiration

## 📈 Performance

- Image compression (client & server)
- Lazy loading
- Code splitting
- MongoDB indexes
- API caching
- CDN-ready
- PWA offline support
- Optimized bundle size

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB connection
mongosh "your-connection-string"

# Check logs
npm run dev
# or
docker-compose logs backend
```

### Frontend can't connect to API
```bash
# Verify API URL in .env
cat EthiopiaMarket/.env

# Check CORS settings in backend
# Ensure FRONTEND_URL is set correctly
```

### OTP not sending
```bash
# In development, check console for OTP
# Set TWILIO_MOCK_MODE=true

# In production, verify Twilio credentials
# Check Twilio console for errors
```

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Complete deployment instructions
- [Backend API](./backend/README.md) - API documentation
- [Frontend Guide](./EthiopiaMarket/README.md) - Frontend documentation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📝 License

MIT License - See LICENSE file

## 🙏 Acknowledgments

- Built for Ethiopian entrepreneurs
- Optimized for local internet conditions
- Designed with Ethiopian UX in mind

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: See docs above
- **Email**: support@example.com

---

## ✅ Complete Feature List

### Implemented ✅
- [x] User registration with OTP
- [x] Phone-based authentication
- [x] Create/Edit/Delete listings
- [x] Image upload with compression
- [x] Search and filters
- [x] Messaging system
- [x] User profiles
- [x] Seller dashboard
- [x] Admin dashboard
- [x] Multi-language (EN/AM)
- [x] Low-data mode
- [x] PWA support
- [x] Docker deployment
- [x] Cloud-ready
- [x] Real API integration
- [x] Database persistence
- [x] Security features
- [x] Rate limiting
- [x] Error handling
- [x] Logging system

### Future Enhancements
- [ ] Real-time notifications
- [ ] Payment integration
- [ ] Advanced search
- [ ] User ratings/reviews
- [ ] Favorite listings
- [ ] Social media sharing
- [ ] Email notifications
- [ ] Mobile app (React Native)

---

**🚀 Ready for Production Deployment!**

Built with ❤️ for Ethiopia 🇪🇹


