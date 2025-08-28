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

### Step 2: Build and Deploy (Recommended Method)
Use the automated deployment script:

```bash
# Make sure you're in the flutter_app directory
cd flutter_app

# Run the deployment script
./deploy-to-vercel.sh
```

This script will:
- Build your Flutter web app locally
- Install Vercel CLI if needed
- Deploy to Vercel automatically

### Step 3: Manual Deployment (Alternative)
If you prefer manual deployment:

1. **Build locally first:**
```bash
flutter build web --release
```

2. **Deploy to Vercel:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Step 4: Get Your Live URL
Vercel will give you a URL like: `https://your-app.vercel.app`

## ✅ Done!
Your Flutter web app is now live and accessible worldwide!

## 🔄 Future Updates
To update your deployed app:
```bash
./deploy-to-vercel.sh
```

## 🐛 Troubleshooting
- If build fails, check that Flutter is installed
- If app doesn't work, verify Supabase credentials
- Check browser console for errors
- Make sure you're in the flutter_app directory

## 📞 Need Help?
- See `DEPLOYMENT.md` for detailed instructions
- Check Vercel documentation: https://vercel.com/docs
