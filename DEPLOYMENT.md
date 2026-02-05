# Deployment Guide

This guide covers deploying the Money Manager frontend to popular hosting platforms.

## Prerequisites

1. Backend API must be deployed and accessible
2. Update `VITE_API_URL` environment variable with your backend URL
3. Ensure CORS is configured in backend to allow your frontend domain

## Option 1: Vercel (Recommended)

Vercel offers the easiest deployment for React applications.

### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Navigate to your project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-api.com/api`

5. **Redeploy**
   ```bash
   vercel --prod
   ```

### GitHub Integration:

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Set environment variables
4. Automatic deployments on git push

**Live URL**: `https://your-project.vercel.app`

---

## Option 2: Netlify

### Steps:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

3. **Login**
   ```bash
   netlify login
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```
   - Select `dist` folder when prompted

5. **Set Environment Variables**
   - Go to Netlify Dashboard
   - Site Settings → Build & Deploy → Environment
   - Add: `VITE_API_URL` = `https://your-backend-api.com/api`

### GitHub Integration:

1. Connect GitHub repo in Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables

**Live URL**: `https://your-project.netlify.app`

---

## Option 3: GitHub Pages

### Steps:

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update vite.config.js**
   ```js
   export default defineConfig({
     base: '/money-manager-frontend/',
     // ... rest of config
   })
   ```

3. **Add scripts to package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Repository Settings → Pages
   - Source: gh-pages branch

**Live URL**: `https://yourusername.github.io/money-manager-frontend/`

**Note**: GitHub Pages doesn't support environment variables. You'll need to hardcode the API URL in production build.

---

## Option 4: Firebase Hosting

### Steps:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login**
   ```bash
   firebase login
   ```

3. **Initialize**
   ```bash
   firebase init hosting
   ```
   - Select `dist` as public directory
   - Configure as single-page app: Yes

4. **Build**
   ```bash
   npm run build
   ```

5. **Deploy**
   ```bash
   firebase deploy
   ```

**Live URL**: `https://your-project.web.app`

---

## Option 5: AWS S3 + CloudFront

### Steps:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   - Enable static website hosting
   - Upload `dist` folder contents

3. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Default root object: index.html
   - Custom error response: 404 → /index.html (for SPA routing)

4. **Update DNS**
   - Point domain to CloudFront distribution

---

## Environment Variables

For production deployment, set these environment variables:

```env
VITE_API_URL=https://your-backend-api.com/api
```

### Important Notes:

1. **Vite Environment Variables**
   - Must be prefixed with `VITE_`
   - Embedded at build time
   - Not runtime configurable

2. **Backend URL**
   - Must be accessible from frontend domain
   - HTTPS required for production
   - Configure CORS in backend

3. **CORS Configuration**
   Update your Spring Boot backend:
   ```java
   cors.allowed.origins=https://your-frontend.vercel.app
   ```

---

## Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Test all features:
  - [ ] Dashboard loads
  - [ ] Add transaction works
  - [ ] Filters work
  - [ ] Accounts management
  - [ ] Transfers work
- [ ] Check mobile responsiveness
- [ ] Test in different browsers
- [ ] Monitor console for errors

---

## Common Issues

### API Connection Failed

**Issue**: Frontend can't connect to backend

**Solutions**:
- Verify VITE_API_URL is correct
- Check backend is running and accessible
- Verify CORS configuration
- Check browser console for specific errors

### 404 on Page Refresh

**Issue**: Routes work on first load but 404 on refresh

**Solutions**:
- Configure server to redirect all routes to index.html
- For Netlify: Add `_redirects` file
  ```
  /* /index.html 200
  ```
- For Vercel: Automatic SPA routing

### Environment Variables Not Working

**Issue**: API calls go to wrong URL

**Solutions**:
- Rebuild after changing environment variables
- Verify variable name starts with `VITE_`
- Check deployment platform environment settings
- Clear build cache and rebuild

---

## Performance Optimization

1. **Enable Compression**
   - Most platforms enable this automatically
   - Reduces bundle size by ~70%

2. **CDN**
   - Vercel and Netlify include CDN
   - CloudFront for AWS

3. **Caching**
   - Configure cache headers for static assets
   - Most platforms handle this automatically

---

## Monitoring

### Recommended Tools:

- **Vercel Analytics**: Built-in for Vercel deployments
- **Google Analytics**: Add tracking code
- **Sentry**: Error tracking and monitoring
- **LogRocket**: Session replay and debugging

---

## Updating Deployment

### Vercel/Netlify (GitHub connected):
```bash
git add .
git commit -m "Update"
git push origin main
```
Automatic deployment triggered

### Manual deployment:
```bash
npm run build
vercel --prod
# or
netlify deploy --prod
```

---

## Security

1. **API Key Protection**
   - Never commit `.env` file
   - Use environment variables
   - Rotate keys regularly

2. **HTTPS Only**
   - All platforms provide free SSL
   - Enforce HTTPS in production

3. **CSP Headers**
   - Configure Content Security Policy
   - Prevent XSS attacks

---

## Support

For deployment issues:
- Check platform documentation
- Review build logs
- Test locally first
- Verify backend connectivity
