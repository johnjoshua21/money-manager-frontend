# Hackathon Submission Instructions

## Repository Setup

### 1. Create GitHub Repository

```bash
# Navigate to project directory
cd money-manager-frontend

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Money Manager Frontend"

# Create repository on GitHub named: money-manager-frontend

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/money-manager-frontend.git

# Push to GitHub
git push -u origin main
```

### 2. Get Last Commit Hash

```bash
git log -1 --format="%H"
```

Copy this hash for your submission file.

---

## Deployment

### Backend Deployment (Already Done)

Your Spring Boot backend should be deployed. Common options:
- Heroku
- Railway
- Render
- AWS Elastic Beanstalk

Note your backend URL: `https://your-backend-url.com`

### Frontend Deployment

#### Option A: Vercel (Recommended - Easiest)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow prompts
   - Select project name
   - Configure build settings (auto-detected)

4. **Set Environment Variable**
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

5. **Production Deployment**
   ```bash
   vercel --prod
   ```

6. **Get URL**
   Your app will be at: `https://your-project.vercel.app`

#### Option B: Netlify

1. **Build Project**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```
   - Select `dist` folder

3. **Or Deploy via Web Interface**
   - Go to netlify.com
   - Drag and drop `dist` folder
   - Set environment variables in dashboard

4. **Get URL**
   Your app will be at: `https://your-project.netlify.app`

---

## Create Submission File

Create a text file named `submission.txt` with the following information:

```
MONEY MANAGER - HACKATHON SUBMISSION
=====================================

FRONTEND
--------
GitHub Repository: https://github.com/YOUR_USERNAME/money-manager-frontend
Last Commit Hash: [paste your commit hash here]
Live URL: https://your-project.vercel.app

BACKEND
-------
GitHub Repository: https://github.com/YOUR_USERNAME/money-manager-backend
Last Commit Hash: [paste your commit hash here]
Live URL: https://your-backend.com
API Base URL: https://your-backend.com/api

TECHNOLOGIES USED
-----------------
Frontend: React 18, Vite, Tailwind CSS, React Router, Recharts, Axios
Backend: Spring Boot 3.2.0, MongoDB, Spring Data MongoDB
Database: MongoDB Atlas

FEATURES IMPLEMENTED
--------------------
✓ Dashboard with period-based summary (Weekly/Monthly/Yearly)
✓ Income and Expense tracking
✓ Transaction management with 12-hour edit window
✓ Category-wise filtering and summary
✓ Division-wise tracking (Office/Personal)
✓ Date range filtering
✓ Multiple accounts management
✓ Inter-account transfers
✓ Visual charts (Bar chart, Pie chart)
✓ Responsive design (Mobile, Tablet, Desktop)
✓ Real-time balance updates

CREDENTIALS (if required)
-------------------------
[Add any test credentials if needed]

ADDITIONAL NOTES
----------------
- All requirements from the problem statement have been implemented
- Backend deployed and fully functional
- Frontend responsive and works on all devices
- Open source repository available on GitHub
```

---

## Verification Checklist

Before submitting, verify:

### Backend
- [ ] Backend is deployed and accessible
- [ ] All API endpoints working
- [ ] MongoDB connection successful
- [ ] CORS configured for frontend domain
- [ ] GitHub repository is public
- [ ] README.md is comprehensive

### Frontend
- [ ] Frontend is deployed and accessible
- [ ] Can access deployed URL
- [ ] Dashboard loads correctly
- [ ] Can add transactions
- [ ] Can filter transactions
- [ ] Can manage accounts
- [ ] Can create transfers
- [ ] Charts render correctly
- [ ] Mobile responsive
- [ ] GitHub repository is public
- [ ] README.md is comprehensive

### GitHub
- [ ] Both repositories are public
- [ ] No company name mentioned in code
- [ ] Clean commit history
- [ ] Last commit hash obtained
- [ ] .env files not committed (in .gitignore)

### Submission File
- [ ] All URLs are correct and accessible
- [ ] Commit hashes are correct
- [ ] Technologies listed
- [ ] Features documented

---

## Testing Your Deployment

1. **Open Frontend URL**
   - Verify dashboard loads
   - Check no console errors

2. **Test Core Features**
   ```
   ✓ Add Income transaction
   ✓ Add Expense transaction
   ✓ View transaction in history
   ✓ Filter by category
   ✓ Filter by date range
   ✓ Create account
   ✓ Create transfer
   ✓ Edit transaction (within 12 hours)
   ✓ View charts
   ```

3. **Test on Multiple Devices**
   - Desktop browser
   - Mobile browser
   - Tablet (if available)

4. **Test Different Browsers**
   - Chrome
   - Firefox
   - Safari (if available)

---

## Common Issues and Solutions

### Issue: Frontend can't connect to backend
**Solution**: 
- Verify VITE_API_URL is correct
- Check CORS configuration in backend
- Ensure backend is running

### Issue: 404 on page refresh
**Solution**: 
- Vercel/Netlify handle this automatically
- For custom hosting, configure SPA routing

### Issue: Environment variables not working
**Solution**:
- Rebuild after setting variables
- Variable must start with VITE_
- Check deployment platform settings

---

## Final Steps

1. **Push Final Changes**
   ```bash
   git add .
   git commit -m "Final submission"
   git push origin main
   ```

2. **Get Commit Hashes**
   ```bash
   # Frontend
   cd money-manager-frontend
   git log -1 --format="%H"
   
   # Backend
   cd ../money-manager-backend
   git log -1 --format="%H"
   ```

3. **Create submission.txt**
   - Fill in all information
   - Double-check all URLs
   - Verify all links work

4. **Submit**
   - Upload submission.txt
   - Send to hackathon organizers

---

## Additional Tips

1. **Make README Impressive**
   - Add screenshots
   - Clear installation instructions
   - List all features
   - Include tech stack

2. **Code Quality**
   - Clean, commented code
   - Consistent formatting
   - No console.log statements in production

3. **Documentation**
   - API documentation
   - Component documentation
   - Deployment guide

4. **Professional Touch**
   - Proper error handling
   - Loading states
   - User-friendly messages
   - Responsive design

---

## Need Help?

If you encounter issues:
1. Check build logs
2. Verify environment variables
3. Test backend API independently
4. Check browser console for errors
5. Review deployment platform documentation

---

Good luck with your hackathon submission! 🚀
