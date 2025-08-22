# Complete Setup Guide - Student Search App

## Prerequisites

### 1. Install Node.js

**Option A: Using Homebrew (Recommended for macOS)**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

**Option B: Direct Download**
- Go to [nodejs.org](https://nodejs.org)
- Download the LTS version
- Install the downloaded package

**Option C: Using Node Version Manager (nvm)**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run
source ~/.bashrc

# Install Node.js
nvm install --lts
nvm use --lts
```

### 2. Install Git (if not already installed)
```bash
# macOS
brew install git

# Verify
git --version
```

## Database Setup

### Option A: Supabase (Recommended)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up with GitHub or email
   - Create a new project

2. **Get Credentials**
   - In your project dashboard, go to Settings > API
   - Copy your Project URL and anon public key

3. **Create Database Tables**
   - Go to SQL Editor in Supabase
   - Run the following SQL:

```sql
-- Create tables for each grade level
CREATE TABLE g4 (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  is_confirmed BOOLEAN DEFAULT false,
  student_code TEXT UNIQUE NOT NULL,
  september JSONB DEFAULT '{}',
  october JSONB DEFAULT '{}',
  november JSONB DEFAULT '{}',
  december JSONB DEFAULT '{}'
);

CREATE TABLE g5 (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  is_confirmed BOOLEAN DEFAULT false,
  student_code TEXT UNIQUE NOT NULL,
  september JSONB DEFAULT '{}',
  october JSONB DEFAULT '{}',
  november JSONB DEFAULT '{}',
  december JSONB DEFAULT '{}'
);

CREATE TABLE g6 (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  is_confirmed BOOLEAN DEFAULT false,
  student_code TEXT UNIQUE NOT NULL,
  september JSONB DEFAULT '{}',
  october JSONB DEFAULT '{}',
  november JSONB DEFAULT '{}',
  december JSONB DEFAULT '{}'
);

CREATE TABLE p1 (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  is_confirmed BOOLEAN DEFAULT false,
  student_code TEXT UNIQUE NOT NULL,
  september JSONB DEFAULT '{}',
  october JSONB DEFAULT '{}',
  november JSONB DEFAULT '{}',
  december JSONB DEFAULT '{}'
);
```

4. **Add Sample Data**
   - In Supabase Table Editor, add some test records
   - Or use the setup script: `npm run setup-db`

### Option B: Firebase

1. **Create Firebase Project**
   - Go to [firebase.google.com](https://firebase.google.com)
   - Create a new project
   - Enable Firestore Database

2. **Create Service Account**
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

3. **Set Up Collections**
   - Create collections: `g4`, `g5`, `g6`, `p1`
   - Add documents with the required fields

## Local Development Setup

### 1. Clone and Setup Project
```bash
# Clone your repository (replace with your actual repo URL)
git clone https://github.com/yourusername/student-search-app.git
cd student-search-app

# Install dependencies
npm install
```

### 2. Configure Environment Variables
```bash
# Create .env file
cp .env.example .env

# Edit .env file with your database credentials
nano .env
```

Add your credentials:
```env
# For Supabase
DB_TYPE=supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# For Firebase
DB_TYPE=firebase
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

### 3. Run the Application
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Visit: http://localhost:3000

## Deployment to Vercel

### 1. Prepare for Deployment
```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to connect your GitHub repository
```

**Option B: Using Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the Node.js project

### 3. Configure Environment Variables in Vercel
1. In Vercel dashboard, go to your project
2. Go to Settings > Environment Variables
3. Add the same variables from your `.env` file:
   - `DB_TYPE`
   - `SUPABASE_URL` (if using Supabase)
   - `SUPABASE_ANON_KEY` (if using Supabase)
   - `FIREBASE_SERVICE_ACCOUNT` (if using Firebase)

### 4. Deploy
- Click "Deploy" in Vercel dashboard
- Your app will be live at: `https://your-project.vercel.app`

## Custom Domain Setup

### 1. Add Domain in Vercel
1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain (e.g., `student-search.yourdomain.com`)
3. Vercel will provide DNS records to configure

### 2. Configure DNS
**Option A: Automatic DNS (Recommended)**
- If your domain provider supports it, use Vercel's automatic DNS configuration

**Option B: Manual DNS**
- Add a CNAME record:
  - Name: `student-search` (or your subdomain)
  - Value: `cname.vercel-dns.com`

### 3. Verify Domain
- Wait for DNS propagation (can take up to 48 hours)
- Vercel will automatically provision SSL certificate

## Testing the Application

### 1. Test Search Functionality
- Try searching with test codes: `G4001`, `G5001`, `G6001`, `P1001`
- Verify that results display correctly
- Check that the UI matches the original Google Apps Script version

### 2. Test Database Connection
- Visit: `https://your-domain.com/api/health`
- Should return database connection status

### 3. Test Error Handling
- Try invalid codes
- Test with empty input
- Verify error messages display correctly

## Troubleshooting

### Common Issues

**1. "Module not found" errors**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**2. Database connection issues**
- Verify environment variables are set correctly
- Check database credentials
- Ensure database tables exist

**3. Vercel deployment fails**
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure `vercel.json` is configured correctly

**4. Custom domain not working**
- Check DNS configuration
- Wait for DNS propagation
- Verify SSL certificate is provisioned

### Getting Help

1. Check the application logs
2. Review the README.md file
3. Check Vercel deployment logs
4. Create an issue in the GitHub repository

## Next Steps

After successful deployment:

1. **Add Real Data**: Import your actual student data
2. **Customize UI**: Modify colors, fonts, or layout as needed
3. **Add Features**: Consider adding admin panel, data export, etc.
4. **Monitor Performance**: Set up monitoring and analytics
5. **Backup Strategy**: Implement regular database backups

---

**Mrs. Hoda Ismail wishes you the best of luck!** 🍀
