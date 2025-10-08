# 🚀 Ethiopia Market - Complete Deployment Guide

This guide covers deploying the full-stack Ethiopia Market application to production.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Production Deployment](#production-deployment)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Post-Deployment](#post-deployment)

---

## Prerequisites

### Required Services
1. **MongoDB Database**
   - MongoDB Atlas (recommended) or self-hosted MongoDB
   - [Get MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Cloudinary Account** (for image uploads)
   - [Sign up for Cloudinary](https://cloudinary.com/)
   - Free tier: 25GB storage, 25GB bandwidth/month

3. **Twilio Account** (for SMS OTP)
   - [Sign up for Twilio](https://www.twilio.com/)
   - Buy a phone number for SMS
   - Or use mock mode for development

### Tools Required
- Node.js 16+ and npm
- Docker & Docker Compose (for containerized deployment)
- Git

---

## Local Development Setup

### 1. Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd ethiopia-market

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd EthiopiaMarket
npm install
cd ..
```

### 2. Setup MongoDB Locally

Option A: Use MongoDB Atlas (Recommended)
1. Create account at https://mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/ethiopia-market`

Option B: Install MongoDB locally
```bash
# MacOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt install mongodb
sudo systemctl start mongodb

# Windows
# Download from https://www.mongodb.com/try/download/community
```

### 3. Configure Environment Variables

Create `backend/.env`:
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ethiopia-market
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ethiopia-market

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# Cloudinary (get from cloudinary.com dashboard)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Twilio (get from twilio.com console)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_MOCK_MODE=true  # Set to false in production

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# OTP
OTP_EXPIRY_MINUTES=10
OTP_LENGTH=6
```

Create `EthiopiaMarket/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Run Development Servers

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd EthiopiaMarket
npm run dev
```

Backend: http://localhost:5000
Frontend: http://localhost:3000

---

## Production Deployment

### Option 1: Docker Compose (Recommended)

#### Complete Setup with Docker

1. **Create Production Environment File**

Create `.env` in project root:
```env
# MongoDB
MONGO_USERNAME=admin
MONGO_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-production-jwt-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_MOCK_MODE=false
```

2. **Build and Run**

```bash
# Build and start all services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

#### Production with Custom Domain

Update `docker-compose.yml` for production:
```yaml
services:
  backend:
    environment:
      - FRONTEND_URL=https://your-domain.com
  
  frontend:
    environment:
      - VITE_API_BASE_URL=https://api.your-domain.com/api
```

---

## Cloud Deployment

### Deploy to Render.com

#### Backend Deployment

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Name**: ethiopia-market-api
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Starter (or Free)

3. **Add Environment Variables**
   Add all variables from `backend/.env.example`:
   - `MONGODB_URI` - Get from MongoDB Atlas
   - `JWT_SECRET` - Generate secure random string
   - `CLOUDINARY_*` - From Cloudinary dashboard
   - `TWILIO_*` - From Twilio console
   - `FRONTEND_URL` - Your frontend URL

4. **MongoDB Setup**
   - Create MongoDB Atlas cluster
   - Whitelist Render's IP: `0.0.0.0/0` (or specific IPs)
   - Copy connection string to `MONGODB_URI`

#### Frontend Deployment (Vercel)

1. **Update API URL**

Create `EthiopiaMarket/.env.production`:
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

2. **Deploy to Vercel**
```bash
cd EthiopiaMarket
npm install -g vercel
vercel --prod
```

Or use Vercel Dashboard:
- Import GitHub repository
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Add environment variable: `VITE_API_BASE_URL`

#### Frontend Deployment (Netlify)

```bash
cd EthiopiaMarket
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

Or use Netlify Dashboard:
- Connect GitHub repository
- Build Command: `npm run build`
- Publish Directory: `dist`
- Environment: `VITE_API_BASE_URL=<your-backend-url>`

---

### Deploy to AWS (EC2)

#### Prerequisites
- AWS account
- EC2 instance (Ubuntu 20.04 LTS)
- Domain name (optional)

#### Server Setup

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### Deploy Application

```bash
# Clone repository
cd /home/ubuntu
git clone <your-repo-url> ethiopia-market
cd ethiopia-market

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your values
nano .env

# Start backend with PM2
pm2 start server.js --name ethiopia-market-api
pm2 save
pm2 startup

# Setup frontend
cd ../EthiopiaMarket
npm install
npm run build

# Copy build to nginx
sudo cp -r dist/* /var/www/html/
```

#### Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/ethiopia-market
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri /index.html;
    }

    # Backend API
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

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/ethiopia-market /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## Environment Variables

### Backend (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| NODE_ENV | Yes | Environment | production |
| PORT | Yes | Server port | 5000 |
| MONGODB_URI | Yes | MongoDB connection | mongodb+srv://... |
| JWT_SECRET | Yes | JWT secret key | random-secret-key |
| JWT_EXPIRE | No | Token expiry | 7d |
| FRONTEND_URL | Yes | Frontend URL | https://yoursite.com |
| CLOUDINARY_CLOUD_NAME | Yes | Cloud name | your-cloud |
| CLOUDINARY_API_KEY | Yes | API key | 123456789 |
| CLOUDINARY_API_SECRET | Yes | API secret | abc123def456 |
| TWILIO_ACCOUNT_SID | Yes* | Twilio SID | AC123... |
| TWILIO_AUTH_TOKEN | Yes* | Twilio token | abc123... |
| TWILIO_PHONE_NUMBER | Yes* | SMS number | +1234567890 |
| TWILIO_MOCK_MODE | No | Mock SMS | false |

*Required only if TWILIO_MOCK_MODE is false

### Frontend (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| VITE_API_BASE_URL | Yes | Backend API URL | https://api.yoursite.com/api |

---

## Post-Deployment

### 1. Create Admin User

```bash
# Connect to MongoDB
mongosh "your-connection-string"

# Switch to database
use ethiopia-market

# Update user role to admin
db.users.updateOne(
  { phone: "+251911234567" },
  { $set: { role: "admin" } }
)
```

### 2. Monitor Application

```bash
# Check PM2 processes
pm2 list
pm2 logs ethiopia-market-api

# Check Docker containers
docker-compose logs -f

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### 3. Database Backup

```bash
# MongoDB backup
mongodump --uri="your-connection-string" --out=/backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="your-connection-string" /backup/20240101
```

### 4. Performance Monitoring

- Use PM2 monitoring: `pm2 monit`
- Set up error tracking (Sentry)
- Monitor API response times
- Track user analytics

### 5. Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable CORS properly
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] API key rotation
- [ ] Regular backups
- [ ] Monitor error logs

---

## Troubleshooting

### Backend Won't Start

```bash
# Check logs
pm2 logs ethiopia-market-api

# Common issues:
# 1. MongoDB connection failed
#    - Verify MONGODB_URI
#    - Check network access in MongoDB Atlas
# 2. Port already in use
#    - Change PORT in .env
# 3. Missing dependencies
#    - Run npm install
```

### Frontend Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Connection Issues

```bash
# Test MongoDB connection
mongosh "your-connection-string"

# Check MongoDB is running
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### SMS Not Sending

```bash
# Verify Twilio credentials
# Check Twilio console for errors
# Ensure phone number is verified in Twilio
# Check TWILIO_MOCK_MODE setting
```

---

## Scaling & Optimization

### Load Balancing

Use Nginx as load balancer:
```nginx
upstream backend {
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
}
```

### Caching

Add Redis for caching:
```bash
docker run -d --name redis -p 6379:6379 redis:alpine
```

### CDN

Use Cloudflare or AWS CloudFront for:
- Static asset caching
- DDoS protection
- Global distribution

---

## Support

For issues or questions:
- Check the [main README](./README.md)
- Review [API documentation](./backend/README.md)
- Check backend logs
- Verify environment variables

---

**Ready for Production! 🚀**






