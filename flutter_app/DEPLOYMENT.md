# 🚀 Deploying Flutter Web App to Vercel

This guide will help you deploy your Flutter web app to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Flutter SDK**: Ensure Flutter is installed and configured
4. **Supabase Project**: Your Supabase project should be set up

## Step 1: Prepare Your Supabase Credentials

Before deploying, you need to update your Supabase credentials in the code:

1. Go to your Supabase project dashboard
2. Copy your project URL and anon key
3. Update the credentials in `lib/main.dart`:

```dart
await Supabase.initialize(
  url: 'YOUR_ACTUAL_SUPABASE_URL',
  anonKey: 'YOUR_ACTUAL_SUPABASE_ANON_KEY',
);
```

## Step 2: Push to GitHub

1. Create a new repository on GitHub
2. Push your Flutter app code to the repository:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Build Command**: `flutter build web --release`
   - **Output Directory**: `build/web`
   - **Install Command**: `flutter pub get`
5. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from your Flutter app directory:
```bash
cd flutter_app
vercel
```

## Step 4: Configure Environment Variables (Optional)

If you want to use environment variables for Supabase credentials:

1. In your Vercel project dashboard, go to Settings > Environment Variables
2. Add:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key

3. Update your code to use environment variables (requires additional setup)

## Step 5: Custom Domain (Optional)

1. In your Vercel project dashboard, go to Settings > Domains
2. Add your custom domain
3. Configure DNS settings as instructed

## Troubleshooting

### Build Issues

If you encounter build issues:

1. Ensure Flutter is properly installed
2. Run `flutter doctor` to check for issues
3. Try building locally first: `flutter build web --release`

### Runtime Issues

1. Check browser console for errors
2. Verify Supabase credentials are correct
3. Ensure your Supabase project is accessible

### Performance Optimization

1. Enable compression in Vercel settings
2. Use CDN for static assets
3. Optimize images and assets

## Monitoring

- Use Vercel Analytics to monitor performance
- Set up error tracking with Sentry or similar
- Monitor Supabase usage and performance

## Security Considerations

1. Never commit sensitive credentials to Git
2. Use environment variables for production secrets
3. Enable Supabase Row Level Security (RLS)
4. Regularly update dependencies

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Flutter Web Documentation](https://flutter.dev/web)
- [Supabase Documentation](https://supabase.com/docs)

---

🎉 Your Flutter web app is now deployed and accessible worldwide!
