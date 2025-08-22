# 📱 Student Search App - Flutter Version

A beautiful Flutter application for searching student records with performance tracking, converted from Google Apps Script to a modern cross-platform mobile and web app.

## ✨ Features

- 🔍 **Student Code Search**: Search by student codes (G4, G5, G6, P1)
- 📊 **Performance Tracking**: Monthly performance and quiz scores
- 🎨 **Beautiful UI**: Modern, responsive design with Arabic language support
- 📱 **Cross-Platform**: Works on iOS, Android, Web, and Desktop
- 🗄️ **Database Integration**: Support for Supabase and Firebase
- 🚀 **Demo Mode**: Test with sample data without database setup
- ☁️ **Cloud Ready**: Easy deployment to various platforms

## 🎯 Supported Platforms

- ✅ **iOS** (iPhone & iPad)
- ✅ **Android** (Phone & Tablet)
- ✅ **Web** (Chrome, Safari, Firefox, Edge)
- ✅ **Desktop** (Windows, macOS, Linux)

## 🛠️ Tech Stack

- **Framework**: Flutter 3.0+
- **Language**: Dart
- **State Management**: Provider
- **HTTP Client**: http package
- **Database**: Supabase (PostgreSQL) or Firebase (Firestore)
- **Deployment**: Multiple options (see deployment section)

## 🚀 Quick Start

### Prerequisites

1. **Install Flutter SDK**:
   ```bash
   # macOS
   brew install flutter
   
   # Or download from https://flutter.dev/docs/get-started/install
   ```

2. **Verify Installation**:
   ```bash
   flutter doctor
   ```

3. **Install IDE** (VS Code recommended):
   ```bash
   # Install VS Code Flutter extension
   code --install-extension Dart-Code.flutter
   ```

### Setup Project

1. **Clone/Download the project**:
   ```bash
   cd flutter_app
   ```

2. **Install dependencies**:
   ```bash
   flutter pub get
   ```

3. **Run the app**:
   ```bash
   # For web
   flutter run -d chrome
   
   # For iOS simulator
   flutter run -d ios
   
   # For Android emulator
   flutter run -d android
   ```

## 🧪 Testing

### Demo Mode (Default)
The app runs in demo mode by default with sample data:

**Test Codes:**
- `G4001` - Ahmed Mohamed (Confirmed)
- `G5001` - Fatima Ali (Confirmed)
- `G6001` - Omar Hassan (Not Confirmed)
- `P1001` - Layla Ahmed (Confirmed)

### Database Mode
To connect to your database:

1. **Update API configuration** in `lib/utils/constants.dart`:
   ```dart
   class ApiConfig {
     // Replace with your Vercel URL
     static const String baseUrl = 'https://your-app.vercel.app';
   }
   ```

2. **Toggle demo mode** in the app UI

## 🗄️ Database Setup

### Option 1: Use Existing Node.js Backend

1. **Deploy the Node.js backend** (see main README.md)
2. **Update the API URL** in Flutter app
3. **Toggle off demo mode**

### Option 2: Direct Database Connection

You can modify the app to connect directly to Supabase/Firebase:

1. **Add database packages**:
   ```yaml
   dependencies:
     supabase_flutter: ^1.10.0
     # or
     cloud_firestore: ^4.8.0
   ```

2. **Update the provider** to use direct database calls

## 📱 Building for Production

### Web Deployment

1. **Build for web**:
   ```bash
   flutter build web
   ```

2. **Deploy to any web hosting**:
   - **Vercel**: Drag `build/web` folder to Vercel
   - **Netlify**: Connect GitHub repository
   - **Firebase Hosting**: Use `firebase deploy`
   - **GitHub Pages**: Push to `gh-pages` branch

### Mobile App Stores

1. **Build for iOS**:
   ```bash
   flutter build ios --release
   ```

2. **Build for Android**:
   ```bash
   flutter build apk --release
   # or
   flutter build appbundle --release
   ```

3. **Submit to stores**:
   - **App Store**: Use Xcode to archive and upload
   - **Google Play**: Upload APK/AAB file

## 🎨 Customization

### Colors and Themes
Edit `lib/utils/constants.dart`:
```dart
class AppColors {
  static const Color primary = Color(0xFF00838F);
  static const Color secondary = Color(0xFF0277BD);
  // ... more colors
}
```

### Text Styles
```dart
class AppTextStyles {
  static const TextStyle heading1 = TextStyle(
    color: AppColors.primary,
    fontSize: 30,
    fontWeight: FontWeight.w700,
  );
  // ... more styles
}
```

### Adding New Features
1. **New Widgets**: Add to `lib/widgets/` folder
2. **New Screens**: Add to `lib/screens/` folder
3. **New Models**: Add to `lib/models/` folder
4. **New Services**: Add to `lib/services/` folder

## 📁 Project Structure

```
lib/
├── main.dart                 # App entry point
├── models/
│   └── student.dart         # Student data model
├── providers/
│   └── student_provider.dart # State management
├── screens/
│   └── home_screen.dart     # Main screen
├── utils/
│   └── constants.dart       # Colors, styles, config
└── widgets/
    ├── search_form.dart     # Search input
    ├── student_info.dart    # Student details
    └── performance_table.dart # Performance data
```

## 🔧 Configuration

### Environment Variables
Create `.env` file for sensitive data:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

### API Configuration
Update `lib/utils/constants.dart`:
```dart
class ApiConfig {
  static const String baseUrl = 'https://your-api-url.com';
  static const String searchEndpoint = '/api/search';
}
```

## 🚀 Deployment Options

### 1. Web Deployment

**Vercel (Recommended)**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Netlify**:
```bash
# Build
flutter build web

# Deploy
netlify deploy --prod --dir=build/web
```

**Firebase Hosting**:
```bash
# Initialize Firebase
firebase init hosting

# Build and deploy
flutter build web
firebase deploy
```

### 2. Mobile Deployment

**iOS App Store**:
1. Open `ios/Runner.xcworkspace` in Xcode
2. Configure signing and capabilities
3. Archive and upload to App Store Connect

**Google Play Store**:
1. Build app bundle: `flutter build appbundle`
2. Upload to Google Play Console
3. Configure store listing and release

### 3. Desktop Deployment

**Windows**:
```bash
flutter build windows
```

**macOS**:
```bash
flutter build macos
```

**Linux**:
```bash
flutter build linux
```

## 🧪 Testing

### Unit Tests
```bash
flutter test
```

### Widget Tests
```bash
flutter test test/widget_test.dart
```

### Integration Tests
```bash
flutter drive --target=test_driver/app.dart
```

## 🔍 Troubleshooting

### Common Issues

1. **"Flutter command not found"**:
   ```bash
   export PATH="$PATH:`pwd`/flutter/bin"
   ```

2. **"No supported devices connected"**:
   ```bash
   flutter devices
   flutter emulators --launch <emulator_id>
   ```

3. **"Package not found"**:
   ```bash
   flutter clean
   flutter pub get
   ```

4. **Web build issues**:
   ```bash
   flutter config --enable-web
   flutter create .
   ```

### Performance Optimization

1. **Enable release mode**:
   ```bash
   flutter run --release
   ```

2. **Profile performance**:
   ```bash
   flutter run --profile
   ```

3. **Analyze code**:
   ```bash
   flutter analyze
   ```

## 📞 Support

### Getting Help
1. **Check Flutter docs**: https://flutter.dev/docs
2. **Review error logs**: Look at console output
3. **Test demo mode**: Verify app works with sample data
4. **Check dependencies**: Run `flutter doctor`

### Common Commands
```bash
# Check Flutter installation
flutter doctor

# Get dependencies
flutter pub get

# Run app
flutter run

# Build for production
flutter build web
flutter build apk
flutter build ios

# Clean project
flutter clean

# Update Flutter
flutter upgrade
```

## 🎯 Next Steps

After successful setup:

1. **Customize UI**: Modify colors, fonts, layout
2. **Add Features**: Admin panel, data export, notifications
3. **Deploy**: Choose your target platform
4. **Monitor**: Set up analytics and crash reporting
5. **Update**: Keep Flutter and dependencies updated

---

## 🎉 Benefits of Flutter Version

- ✅ **Cross-Platform**: One codebase for all platforms
- ✅ **Native Performance**: Fast and smooth animations
- ✅ **Beautiful UI**: Material Design and Cupertino widgets
- ✅ **Hot Reload**: Instant code changes during development
- ✅ **Rich Ecosystem**: Thousands of packages available
- ✅ **Google Support**: Backed by Google and active community

---

**Mrs. Hoda Ismail wishes you the best of luck!** 🍀

*Need help? Check the main README.md for backend setup or create an issue in your repository.*
