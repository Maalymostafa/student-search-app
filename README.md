# Student Search App - Mrs. Hoda Ismail

A modern web application for searching student records with performance tracking, converted from Google Apps Script to Node.js with database integration.

## Features

- 🔍 **Student Code Search**: Search by student codes (G4, G5, G6, P1)
- 📊 **Performance Tracking**: Monthly performance and quiz scores
- 🎨 **Beautiful UI**: Modern, responsive design with Arabic language support
- 🗄️ **Database Integration**: Support for Supabase and Firebase
- ☁️ **Cloud Deployment**: Ready for Vercel deployment with custom domain

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL) or Firebase (Firestore)
- **Deployment**: Vercel
- **Domain**: Custom domain support

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/student-search-app.git
cd student-search-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

Choose either **Supabase** or **Firebase**:

#### Option A: Supabase Setup

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Create Database Tables**:
   ```sql
   -- Create tables for each grade level
   CREATE TABLE g4 (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     is_confirmed BOOLEAN DEFAULT false,
     student_code TEXT UNIQUE NOT NULL,
     september JSONB,
     october JSONB,
     november JSONB,
     december JSONB
   );

   CREATE TABLE g5 (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     is_confirmed BOOLEAN DEFAULT false,
     student_code TEXT UNIQUE NOT NULL,
     september JSONB,
     october JSONB,
     november JSONB,
     december JSONB
   );

   CREATE TABLE g6 (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     is_confirmed BOOLEAN DEFAULT false,
     student_code TEXT UNIQUE NOT NULL,
     september JSONB,
     october JSONB,
     november JSONB,
     december JSONB
   );

   CREATE TABLE p1 (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     is_confirmed BOOLEAN DEFAULT false,
     student_code TEXT UNIQUE NOT NULL,
     september JSONB,
     october JSONB,
     november JSONB,
     december JSONB
   );
   ```

3. **Set Environment Variables**:
   ```bash
   DB_TYPE=supabase
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

#### Option B: Firebase Setup

1. **Create Firebase Project**:
   - Go to [firebase.google.com](https://firebase.google.com)
   - Create a new project
   - Enable Firestore Database

2. **Create Service Account**:
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Download the JSON file

3. **Set Environment Variables**:
   ```bash
   DB_TYPE=firebase
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   ```

### 4. Run Locally

```bash
npm run dev
```

Visit: http://localhost:3000

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. **Connect GitHub Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the Node.js project

2. **Set Environment Variables**:
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add your database credentials:
     - `DB_TYPE`
     - `SUPABASE_URL` (if using Supabase)
     - `SUPABASE_ANON_KEY` (if using Supabase)
     - `FIREBASE_SERVICE_ACCOUNT` (if using Firebase)

3. **Deploy**:
   - Click "Deploy"
   - Your app will be live at: `https://your-project.vercel.app`

### 3. Add Custom Domain

1. **In Vercel Dashboard**:
   - Go to Settings > Domains
   - Add your custom domain (e.g., `student-search.yourdomain.com`)

2. **Configure DNS**:
   - Add CNAME record pointing to your Vercel deployment
   - Or use Vercel's automatic DNS configuration

## Database Schema

### Student Record Structure

```javascript
{
  id: "1",
  name: "Student Name",
  is_confirmed: true,
  student_code: "G4001",
  september: {
    session1_perf: "A",
    session1_quiz: "90",
    session2_perf: "A",
    session2_quiz: "85",
    session3_perf: "B+",
    session3_quiz: "88",
    session4_perf: "A",
    session4_quiz: "92"
  },
  october: { /* similar structure */ },
  november: { /* similar structure */ },
  december: { /* similar structure */ }
}
```

### Supported Student Codes

- **G4**: Grade 4 students
- **G5**: Grade 5 students  
- **G6**: Grade 6 students
- **P1**: Primary 1 students

## API Endpoints

### Search Student
```
POST /api/search
Content-Type: application/json

{
  "code": "G4001"
}
```

### Health Check
```
GET /api/health
```

## Migration from Google Apps Script

This application is a direct conversion from Google Apps Script with:

- ✅ **Same UI/UX**: Identical styling and user experience
- ✅ **Same Logic**: Exact search and display logic
- ✅ **Database Ready**: Modern database integration
- ✅ **Scalable**: Cloud deployment ready

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please contact the development team or create an issue in the GitHub repository.

---

**Mrs. Hoda Ismail wishes you the best of luck!** 🍀
