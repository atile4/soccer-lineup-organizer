# Deployment Instructions

## Building the Project

Since this is a Next.js application with static export configured, follow these steps:

### 1. Install Dependencies

```bash
npm install
```

### 2. Build for Production

```bash
npm run build
```

This will create an `out/` directory with your static site.

### 3. Verify the Build

The `out/` directory should contain:
- `index.html` (login page)
- `dashboard/index.html` (dashboard page)
- `_next/` directory with optimized JavaScript and CSS
- All necessary static assets

## Deploying to AWS Amplify

### Option 1: Manual Deploy (Drag and Drop)

1. **Build locally** (follow steps above)

2. **Go to AWS Amplify Console**
   - Navigate to https://console.aws.amazon.com/amplify/
   - Sign in to your AWS account

3. **Create New App**
   - Click "New app" → "Host web app"
   - Select "Deploy without Git provider"
   - Click "Continue"

4. **Upload Build**
   - Give your app a name (e.g., "soccer-lineup-organizer")
   - Drag and drop the entire `out/` folder
   - Or zip the `out/` folder and upload the zip file
   - Click "Save and deploy"

5. **Done!**
   - Your app will be live at: `https://[app-id].amplifyapp.com`
   - Amplify provides a free SSL certificate
   - You can add a custom domain in the settings

### Option 2: Git-Based Deploy

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Connect to Amplify**
   - In Amplify Console, choose "Host web app"
   - Select your Git provider
   - Authorize and select your repository
   - Select the branch to deploy (usually `main`)

3. **Configure Build Settings**
   Amplify should auto-detect Next.js. If not, use this build config:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: out
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

4. **Deploy**
   - Click "Save and deploy"
   - Amplify will build and deploy automatically
   - Future pushes to the branch will auto-deploy

## Alternative Deployment Options

### Vercel (Easiest for Next.js)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts, and your site is live!

### Netlify

1. Build locally:
   ```bash
   npm run build
   ```

2. Install Netlify CLI:
   ```bash
   npm install netlify-cli -g
   ```

3. Deploy:
   ```bash
   netlify deploy --dir=out --prod
   ```

Or drag and drop the `out/` folder to https://app.netlify.com/drop

### GitHub Pages

1. Build locally:
   ```bash
   npm run build
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add to package.json scripts:
   ```json
   "deploy": "gh-pages -d out"
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

### CloudFlare Pages

1. Build locally or connect Git repository

2. Go to CloudFlare Pages dashboard

3. Create new project:
   - Build command: `npm run build`
   - Build output directory: `out`

4. Deploy

### AWS S3 + CloudFront

1. Build locally:
   ```bash
   npm run build
   ```

2. Create S3 bucket:
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

3. Upload files:
   ```bash
   aws s3 sync out/ s3://your-bucket-name
   ```

4. Configure bucket for static website hosting

5. (Optional) Add CloudFront for CDN

## Environment Variables

If you add authentication or other services requiring environment variables:

### For Build-Time Variables
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```

**Important**: Only variables prefixed with `NEXT_PUBLIC_` are embedded in the client-side bundle.

### For AWS Amplify
Add environment variables in the Amplify Console:
1. Go to App Settings → Environment variables
2. Add your variables
3. Redeploy

### For Vercel
Add in Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add variables for Production/Preview/Development
3. Redeploy if needed

## Post-Deployment Checklist

- [ ] Test login page functionality
- [ ] Test team creation and player management
- [ ] Test lineup creator with drag and drop
- [ ] Test on mobile devices
- [ ] Verify all formations work correctly
- [ ] Test localStorage persistence (refresh page)
- [ ] Set up custom domain (if applicable)
- [ ] Configure SSL certificate (usually automatic)
- [ ] Set up authentication (see AUTHENTICATION_GUIDE.md)
- [ ] Monitor performance and errors

## Troubleshooting

### Build Fails
- Check Node.js version (18+ required)
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`

### 404 Errors After Deployment
- Ensure `next.config.js` has `output: 'export'`
- Check that `trailingSlash: true` is set
- Verify all pages are in the `out/` directory

### Drag and Drop Not Working
- Check browser console for errors
- Ensure JavaScript is enabled
- Try clearing browser cache

### Styles Not Loading
- Check that `_next/` folder is deployed
- Verify Tailwind CSS is configured correctly
- Check browser console for CSS loading errors

### Images or SVGs Not Showing
- All images are inline SVGs, so this shouldn't be an issue
- Check browser console for any errors

## Performance Optimization

After deployment, consider:

1. **Enable Compression**
   - Most hosting providers enable this by default
   - Reduces file sizes significantly

2. **Add Caching Headers**
   - Static assets can be cached for long periods
   - Configure in your hosting provider settings

3. **Monitor Performance**
   - Use Lighthouse in Chrome DevTools
   - Aim for 90+ scores in all categories

4. **Add Analytics**
   - Google Analytics
   - Vercel Analytics
   - AWS CloudWatch (for Amplify)

## Scaling Considerations

As your app grows:

1. **Add a Database**
   - Move from localStorage to PostgreSQL/MySQL
   - Consider Supabase, PlanetScale, or AWS RDS

2. **Add a Backend**
   - Create API routes in Next.js
   - Or use a separate backend (Node.js, Python, etc.)

3. **Implement Caching**
   - Redis for session management
   - CDN for static assets (CloudFront, Cloudflare)

4. **Add Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring (New Relic, DataDog)
   - Uptime monitoring (UptimeRobot)

## Support

For deployment issues:
- AWS Amplify: https://docs.amplify.aws/
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com/
- Next.js: https://nextjs.org/docs

For application issues, refer to the main README.md and AUTHENTICATION_GUIDE.md files.
