# Deployment Guide - Flappy Bird Clone

This guide will walk you through deploying the Flappy Bird Clone to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier is sufficient)
- Git installed locally

## Step 1: Prepare the Repository

1. Ensure all changes are committed:
```bash
git add .
git commit -m "Prepare for deployment"
```

2. Push to GitHub:
```bash
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Run deployment:
```bash
vercel
```

3. Follow the prompts:
   - Link to existing project or create new
   - Select the `flappy-bird-game` directory
   - Use default settings

### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `flappy-bird-game`
   - Build Command: `npm run build` (default)
   - Output Directory: `out`
5. Click "Deploy"

## Step 3: Post-Deployment

1. **Test the deployment**:
   - Visit the provided URL
   - Test all game features
   - Check mobile responsiveness
   - Test PWA installation

2. **Configure custom domain** (optional):
   - Go to project settings
   - Add your domain
   - Update DNS records

3. **Enable Analytics** (optional):
   - Go to Analytics tab
   - Enable Web Vitals tracking

## Environment Variables

No environment variables are required for this project.

## Troubleshooting

### Build Fails

1. Check Node.js version (should be 18.x or later)
2. Clear cache: `vercel --force`
3. Check build logs for specific errors

### 404 Errors

The project uses static export, so all routes should work. If you encounter 404s:
1. Ensure `output: 'export'` is in next.config.js
2. Check that vercel.json is properly configured

### Performance Issues

1. Check Vercel Analytics for bottlenecks
2. Ensure images are optimized
3. Review bundle size with `npm run build`

## Monitoring

After deployment, monitor:
- Vercel Analytics for performance metrics
- Error logs in Vercel dashboard
- User feedback for gameplay issues

## Updates

To deploy updates:
1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Vercel will automatically deploy

## Rollback

If issues arise:
1. Go to Vercel dashboard
2. Select your project
3. Go to "Deployments"
4. Find previous working deployment
5. Click "..." menu → "Promote to Production"

## Security Headers

Security headers are configured in vercel.json:
- X-Content-Type-Options
- X-Frame-Options  
- X-XSS-Protection
- Cache-Control for assets

## Performance Optimization

The deployment is optimized with:
- Static export for CDN distribution
- Asset caching (1 year for JS/CSS)
- Compression enabled
- Minimal bundle size

## Support

For deployment issues:
- Check Vercel documentation
- Review build logs
- Test locally with `npm run build && npx serve out`

Happy deploying! 🚀 