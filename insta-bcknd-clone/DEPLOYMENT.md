# Render Deployment Guide

## Overview
This Instagram clone is configured for deployment on Render using a single server approach where the Node.js backend serves the React frontend as static files.

## Prerequisites
- GitHub repository with this code
- Render account
- MongoDB Atlas database
- ImageKit account (for image uploads)

## Environment Variables Required
Set these in your Render dashboard:

```bash
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure deployment settings:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: `18.x` or higher
5. Add environment variables from above
6. Click "Create Web Service"

### 3. Verify Deployment
- Render will automatically build and deploy
- Frontend will be served from `/` (root path)
- API endpoints will be available at `/api/*`
- Visit your app at `https://your-app-name.onrender.com`

## Architecture in Production
```
User Browser
      ↓
Render Web Service (Node.js + Express)
      ↓
┌─────────────────┬─────────────────┐
│   React SPA    │   API Routes   │
│  (static files) │ (/api/*)       │
└─────────────────┴─────────────────┘
```

## Local Development
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

## Troubleshooting

### Build Issues
- Ensure Node.js version >= 18
- Check MongoDB Atlas connection
- Verify ImageKit credentials

### Runtime Issues
- Check environment variables in Render dashboard
- Verify CORS configuration
- Check MongoDB Atlas IP whitelist

### File Upload Issues
- Ensure ImageKit credentials are correct
- Check file size limits
- Verify ImageKit URL endpoint

## Features
- ✅ Single server deployment
- ✅ Production-ready CORS
- ✅ Environment-based API URLs
- ✅ Static file serving
- ✅ Automated build process
- ✅ API catch-all routing
