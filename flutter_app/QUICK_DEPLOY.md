# ⚡ Quick Deploy to Vercel

## 🚀 Fast Track Deployment (5 minutes)

### Step 1: Update Supabase Credentials
Replace the placeholder values in `lib/main.dart` with your actual Supabase credentials:

```dart
await Supabase.initialize(
  url: 'https://your-project.supabase.co',  // Your actual URL
  anonKey: 'your-actual-anon-key',         // Your actual anon key
);
```

### Step 2: Push to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Ready for Vercel deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework**: Other
   - **Build Command**: `flutter build web --release`
   - **Output Directory**: `build/web`
6. Click "Deploy"

### Step 4: Get Your Live URL
Vercel will give you a URL like: `https://your-app.vercel.app`

## 🔧 Alternative: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

## ✅ Done!
Your Flutter web app is now live and accessible worldwide!

## 🐛 Troubleshooting
- If build fails, check that Flutter is installed
- If app doesn't work, verify Supabase credentials
- Check browser console for errors

## 📞 Need Help?
- See `DEPLOYMENT.md` for detailed instructions
- Check Vercel documentation: https://vercel.com/docs
