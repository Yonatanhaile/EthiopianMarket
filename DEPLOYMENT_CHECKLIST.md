# ✅ Ethiopia Market - Deployment Checklist

Use this checklist to deploy your marketplace to production.

## 📋 Pre-Deployment Checklist

### 1. Accounts & Services Setup

- [ ] **MongoDB Atlas**
  - [ ] Create account at mongodb.com/cloud/atlas
  - [ ] Create free cluster
  - [ ] Whitelist IP addresses (0.0.0.0/0 for now)
  - [ ] Get connection string
  - [ ] Test connection locally

- [ ] **Cloudinary**
  - [ ] Sign up at cloudinary.com
  - [ ] Get Cloud Name, API Key, API Secret
  - [ ] Test upload locally
  - [ ] Configure upload presets (optional)

- [ ] **Twilio** (Optional but recommended)
  - [ ] Sign up at twilio.com
  - [ ] Buy phone number
  - [ ] Get Account SID and Auth Token
  - [ ] Test SMS locally
  - [ ] Or use TWILIO_MOCK_MODE=true for now

- [ ] **GitHub Repository**
  - [ ] Create repository
  - [ ] Push code
  - [ ] Verify all files committed

### 2. Local Testing

- [ ] **Backend Tests**
  ```bash
  cd backend
  npm install
  npm run dev
  # Test: http://localhost:5000/health
  ```

- [ ] **Frontend Tests**
  ```bash
  cd EthiopiaMarket
  npm install
  npm run dev
  # Test: http://localhost:3000
  ```

- [ ] **Integration Tests**
  - [ ] Register user
  - [ ] Login
  - [ ] Create listing
  - [ ] Upload images
  - [ ] Search listings
  - [ ] Send message
  - [ ] Test admin features

- [ ] **Docker Tests**
  ```bash
  docker-compose up -d --build
  docker-compose ps
  # Test both frontend and backend
  docker-compose down
  ```

### 3. Environment Configuration

- [ ] **Backend .env**
  ```env
  NODE_ENV=production
  PORT=5000
  MONGODB_URI=mongodb+srv://...
  JWT_SECRET=<64-char-random-string>
  CLOUDINARY_CLOUD_NAME=your-cloud
  CLOUDINARY_API_KEY=your-key
  CLOUDINARY_API_SECRET=your-secret
  TWILIO_ACCOUNT_SID=ACxxx
  TWILIO_AUTH_TOKEN=xxx
  TWILIO_PHONE_NUMBER=+1234567890
  TWILIO_MOCK_MODE=false
  FRONTEND_URL=https://your-domain.com
  ```

- [ ] **Frontend .env**
  ```env
  VITE_API_BASE_URL=https://api.your-domain.com/api
  ```

- [ ] **Generate Secure Secrets**
  ```bash
  # Generate JWT secret
  openssl rand -base64 64
  
  # Or use:
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

---

## 🚀 Deployment Steps

### Option A: Quick Deploy (Render + Vercel)

#### Step 1: Deploy Backend to Render.com

- [ ] Go to https://dashboard.render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure:
  - **Name**: ethiopia-market-api
  - **Root Directory**: backend
  - **Environment**: Node
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Instance Type**: Starter (or Free)

- [ ] Add Environment Variables:
  - `NODE_ENV` = production
  - `MONGODB_URI` = <your-atlas-uri>
  - `JWT_SECRET` = <generated-secret>
  - `CLOUDINARY_CLOUD_NAME` = <your-cloud>
  - `CLOUDINARY_API_KEY` = <your-key>
  - `CLOUDINARY_API_SECRET` = <your-secret>
  - `TWILIO_ACCOUNT_SID` = <your-sid>
  - `TWILIO_AUTH_TOKEN` = <your-token>
  - `TWILIO_PHONE_NUMBER` = <your-number>
  - `TWILIO_MOCK_MODE` = false
  - `FRONTEND_URL` = https://your-frontend.vercel.app

- [ ] Deploy and wait
- [ ] Test: https://your-api.onrender.com/health
- [ ] Copy API URL for frontend

#### Step 2: Deploy Frontend to Vercel

- [ ] Go to https://vercel.com
- [ ] Click "New Project"
- [ ] Import GitHub repository
- [ ] Configure:
  - **Root Directory**: EthiopiaMarket
  - **Framework Preset**: Vite
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`

- [ ] Add Environment Variable:
  - `VITE_API_BASE_URL` = https://your-api.onrender.com/api

- [ ] Deploy
- [ ] Test: https://your-project.vercel.app
- [ ] Update FRONTEND_URL in Render backend env

#### Step 3: Update CORS

- [ ] Go back to Render dashboard
- [ ] Update `FRONTEND_URL` to match Vercel URL
- [ ] Trigger redeploy

#### Step 4: Create Admin User

```bash
# Connect to MongoDB Atlas
mongosh "your-atlas-connection-string"

# Switch to database
use ethiopia-market

# Find user by phone and make admin
db.users.updateOne(
  { phone: "+251911234567" },
  { $set: { role: "admin" } }
)

# Verify
db.users.findOne({ phone: "+251911234567" })
```

---

### Option B: Docker Deploy (DigitalOcean/AWS)

#### Step 1: Provision Server

- [ ] Create Droplet/EC2 instance
  - OS: Ubuntu 20.04 LTS
  - Size: 2GB RAM minimum
  - Enable SSH access

#### Step 2: Server Setup

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

#### Step 3: Deploy Application

```bash
# Clone repository
git clone <your-repo-url>
cd ethiopia-market

# Create .env file
nano .env
# Paste your environment variables

# Start services
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs -f
```

#### Step 4: Configure Nginx (Optional)

```bash
# Install Nginx
apt install -y nginx

# Create config
nano /etc/nginx/sites-available/ethiopia-market
```

Paste configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/ethiopia-market /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### Step 5: SSL Certificate

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d your-domain.com

# Auto-renewal
certbot renew --dry-run
```

---

## ✅ Post-Deployment Checks

### Functionality Tests

- [ ] **Frontend Accessible**
  - [ ] Visit your domain
  - [ ] Check mobile view
  - [ ] Test all pages load

- [ ] **Registration Works**
  - [ ] Click Register
  - [ ] Enter phone number
  - [ ] Receive OTP (check phone or logs)
  - [ ] Complete registration
  - [ ] Auto-login works

- [ ] **Login Works**
  - [ ] Logout
  - [ ] Click Login
  - [ ] Enter phone number
  - [ ] Receive OTP
  - [ ] Login successfully

- [ ] **Create Listing**
  - [ ] Click "Create Listing"
  - [ ] Fill all 4 steps
  - [ ] Upload images
  - [ ] Submit
  - [ ] Listing appears

- [ ] **Search & Filter**
  - [ ] Search by keyword
  - [ ] Filter by category
  - [ ] Filter by region
  - [ ] Results load correctly

- [ ] **Listing Details**
  - [ ] Click listing
  - [ ] Images display
  - [ ] Contact buttons work
  - [ ] WhatsApp link opens
  - [ ] Telegram link opens

- [ ] **Protected Routes**
  - [ ] Logout
  - [ ] Try to access /dashboard → redirected to login
  - [ ] Login
  - [ ] Access dashboard → works

- [ ] **Admin Features**
  - [ ] Login as admin
  - [ ] Access /admin
  - [ ] View stats
  - [ ] Moderate listings

### Performance Checks

- [ ] **Load Times**
  - [ ] Homepage < 3 seconds
  - [ ] API responses < 1 second
  - [ ] Image loading lazy/smooth

- [ ] **Mobile Performance**
  - [ ] Test on real mobile device
  - [ ] Touch targets adequate
  - [ ] Images load properly
  - [ ] Forms work well

- [ ] **PWA**
  - [ ] Install prompt appears
  - [ ] Can be installed
  - [ ] Works offline (basic)
  - [ ] Icons correct

### Security Checks

- [ ] **HTTPS**
  - [ ] SSL certificate installed
  - [ ] No mixed content warnings
  - [ ] Secure padlock in browser

- [ ] **Authentication**
  - [ ] Can't access protected routes without login
  - [ ] Token expires correctly
  - [ ] Logout clears session

- [ ] **API Security**
  - [ ] CORS configured correctly
  - [ ] Rate limiting active
  - [ ] Invalid requests rejected

- [ ] **Data Protection**
  - [ ] Environment variables secure
  - [ ] No secrets in code
  - [ ] Database access restricted

---

## 📊 Monitoring Setup

### Application Monitoring

- [ ] **Backend Logs**
  ```bash
  # Docker
  docker-compose logs -f backend
  
  # Server
  pm2 logs
  
  # Check for errors
  ```

- [ ] **Database Monitoring**
  - [ ] MongoDB Atlas monitoring enabled
  - [ ] Check connection limits
  - [ ] Review slow queries

- [ ] **Error Tracking**
  - [ ] Consider Sentry.io integration
  - [ ] Monitor error rates
  - [ ] Set up alerts

### Performance Monitoring

- [ ] **Google Analytics** (optional)
  - [ ] Add tracking code
  - [ ] Monitor page views
  - [ ] Track user flows

- [ ] **API Monitoring**
  - [ ] Use Postman monitoring
  - [ ] Or UptimeRobot
  - [ ] Alert on downtime

---

## 🔄 Maintenance Tasks

### Daily
- [ ] Check application logs
- [ ] Monitor error rates
- [ ] Check OTP delivery

### Weekly
- [ ] Review new listings
- [ ] Moderate reported content
- [ ] Check database size
- [ ] Review user feedback

### Monthly
- [ ] Database backup
- [ ] Security updates
- [ ] Performance review
- [ ] Cost optimization

---

## 📞 Troubleshooting

### Issue: OTP not sending

```bash
# Check Twilio logs
# Verify phone number format
# Check Twilio balance
# Review error logs
```

### Issue: Images not uploading

```bash
# Check Cloudinary credentials
# Verify file size < 10MB
# Check browser console for errors
# Test Cloudinary dashboard
```

### Issue: Database connection failed

```bash
# Check connection string
# Verify IP whitelist in MongoDB Atlas
# Test connection:
mongosh "your-connection-string"
```

### Issue: Frontend can't reach backend

```bash
# Verify VITE_API_BASE_URL
# Check CORS settings
# Verify FRONTEND_URL in backend
# Check network tab in browser
```

---

## ✅ Final Checklist

Before going live:

- [ ] All features tested and working
- [ ] SSL certificate installed
- [ ] Environment variables configured
- [ ] Database backed up
- [ ] Error monitoring set up
- [ ] User documentation ready
- [ ] Admin account created
- [ ] Terms of service added
- [ ] Privacy policy added
- [ ] Contact information updated

---

## 🎉 Launch!

Once all items are checked:

1. [ ] Announce launch
2. [ ] Share with test users
3. [ ] Collect feedback
4. [ ] Monitor closely
5. [ ] Iterate and improve

---

**🚀 Ready for Launch! Good luck with your marketplace! 🚀**

Need help? Check:
- [Complete Project Summary](./COMPLETE_PROJECT_SUMMARY.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Main README](./README.md)

