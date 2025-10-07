# ⚡ Quick Start - Get Running in 2 Minutes!

## Step 1: Start Backend

```bash
# Go to backend folder
cd backend

# Install dependencies
npm install

# The .env file is already created with working defaults!
# Just start the server:
npm run dev
```

✅ Backend should start at: **http://localhost:5000**

You should see:
```
✅ MongoDB Connected: localhost
⚠️ Cloudinary not configured - using placeholder images
⚠️ Twilio not configured, using mock mode
🚀 Server running on port 5000
```

## Step 2: Start Frontend (New Terminal)

```bash
# Go to frontend folder
cd EthiopiaMarket

# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

# Start frontend
npm run dev
```

✅ Frontend should start at: **http://localhost:3000**

## Step 3: Test It!

1. Open browser: **http://localhost:3000**
2. Click "Register"
3. Fill form:
   - Name: `Test User`
   - Phone: `+251911234567` (or any Ethiopian phone)
   - Email: (optional)
4. Click "Continue"
5. **Check your terminal** - you'll see the OTP printed:
   ```
   📱 Mock OTP for +251911234567: 123456
   ```
6. Enter the OTP (any 6 digits work in mock mode)
7. You're logged in! ✅

## Step 4: Create a Listing

1. Click "Create Listing"
2. Fill the 4-step form
3. Upload images (optional - placeholders will be used)
4. Submit!
5. Your listing appears on the home page ✅

## Troubleshooting

### "Cannot connect to MongoDB"

**Option 1: Install MongoDB locally**
```bash
# Windows (with Chocolatey)
choco install mongodb

# Mac
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Linux
sudo apt install mongodb
sudo systemctl start mongodb
```

**Option 2: Use MongoDB Atlas (Free Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster
4. Get connection string
5. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ethiopia-market
   ```

### "Module not found" errors

```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Port already in use"

```bash
# Backend - change PORT in backend/.env
PORT=5001

# Frontend - change port:
npm run dev -- --port 3001
```

## What Works Right Now

✅ **With Mock Mode (No Setup Required)**:
- Registration & Login (OTP in console)
- Create/Edit/Delete listings
- Browse & Search
- Messaging
- Admin dashboard
- All features except:
  - Real SMS (use console OTP)
  - Real image upload (uses placeholders)

✅ **Everything works locally!**

## Next Steps

### To Use Real Services:

**1. Cloudinary (for real images)**
- Sign up: https://cloudinary.com
- Get credentials from dashboard
- Update `backend/.env`:
  ```env
  CLOUDINARY_CLOUD_NAME=your-cloud-name
  CLOUDINARY_API_KEY=your-key
  CLOUDINARY_API_SECRET=your-secret
  ```

**2. Twilio (for real SMS)**
- Sign up: https://www.twilio.com
- Buy phone number
- Update `backend/.env`:
  ```env
  TWILIO_ACCOUNT_SID=ACxxxx
  TWILIO_AUTH_TOKEN=xxxx
  TWILIO_PHONE_NUMBER=+1234567890
  TWILIO_MOCK_MODE=false
  ```

## Ready to Deploy?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment!

---

**You're all set! Start building! 🚀**

