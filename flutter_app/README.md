# 📱 Student Search App - Flutter

A modern Flutter mobile application for searching and managing student information with Supabase integration.

## 🚀 Features

### **Core Features:**
- ✅ **Student Search** - Search by student code or Arabic name
- ✅ **Real-time Database** - Connected to Supabase
- ✅ **Student Details** - View complete student information
- ✅ **Analytics Dashboard** - Performance insights and statistics
- ✅ **Modern UI** - Beautiful, responsive design
- ✅ **Offline Support** - Works with cached data

### **Search Capabilities:**
- 🔍 Search by student code (G4001, G5001, etc.)
- 🔍 Search by Arabic name
- 🔍 Real-time search results
- 🔍 Student status indicators

### **Student Information:**
- 📋 Personal details (name, grade, contact)
- 💳 Subscription information
- 📞 Contact details (phone, WhatsApp)
- ✅ Payment confirmation status
- 📅 Enrollment dates
- 📊 Performance records

## 📱 Screenshots

### **Home Screen**
- Dashboard with analytics
- Quick action buttons
- Database status indicator

### **Search Screen**
- Real-time search functionality
- Student cards with key information
- Status indicators (confirmed/pending)

### **Student Details**
- Complete student information
- Performance history
- Contact details
- Payment information

### **Analytics Screen**
- Student statistics
- Performance charts
- Grade distribution

## 🛠️ Setup Instructions

### **Prerequisites:**
- Flutter SDK (2.17.0 or higher)
- Android Studio / VS Code
- Supabase account and project

### **Step 1: Clone and Setup**
```bash
# Navigate to Flutter app directory
cd flutter_app

# Install dependencies
flutter pub get
```

### **Step 2: Configure Supabase**
1. **Update `lib/main.dart`:**
   ```dart
   await Supabase.initialize(
     url: 'YOUR_SUPABASE_URL',
     anonKey: 'YOUR_SUPABASE_ANON_KEY',
   );
   ```

2. **Get your Supabase credentials:**
   - Go to your Supabase dashboard
   - Navigate to Settings → API
   - Copy the Project URL and anon public key

### **Step 3: Run the App**
```bash
# For Android
flutter run

# For iOS
flutter run -d ios

# For web
flutter run -d chrome
```

## 📊 Database Integration

### **Tables Used:**
- `students` - Main student information
- `student_performance` - Performance tracking
- `subscriptions` - Payment information
- `student_contacts` - Contact details
- `student_reviews` - Review data
- `grade_specific_data` - Grade-specific information

### **API Endpoints:**
- Search students by code or name
- Get student details with related data
- Analytics and statistics
- Real-time updates

## 🎨 UI Components

### **Custom Widgets:**
- `FeatureCard` - Action buttons on home screen
- `StudentCard` - Student information display
- `AnalyticsCard` - Statistics display
- `SearchBar` - Enhanced search functionality

### **Design System:**
- **Colors:** Blue primary theme
- **Typography:** Roboto font family
- **Icons:** Material Design icons
- **Layout:** Responsive grid system

## 🔧 Configuration

### **Environment Variables:**
Create a `.env` file in the root directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **App Configuration:**
- Update app name in `pubspec.yaml`
- Configure app icons
- Set up signing for Android/iOS

## 📱 Platform Support

### **Android:**
- Minimum SDK: 21
- Target SDK: 33
- Supports Android 5.0+

### **iOS:**
- Minimum iOS: 12.0
- Supports iPhone and iPad

### **Web:**
- Modern browsers (Chrome, Firefox, Safari, Edge)

## 🚀 Deployment

### **Android APK:**
```bash
flutter build apk --release
```

### **Android App Bundle:**
```bash
flutter build appbundle --release
```

### **iOS:**
```bash
flutter build ios --release
```

### **Web:**
```bash
flutter build web --release
```

## 🔍 Testing

### **Unit Tests:**
```bash
flutter test
```

### **Integration Tests:**
```bash
flutter test integration_test/
```

### **Widget Tests:**
```bash
flutter test test/widget_test.dart
```

## 📈 Performance

### **Optimizations:**
- Lazy loading for large lists
- Image caching
- Efficient database queries
- Minimal network requests

### **Memory Management:**
- Proper disposal of controllers
- Efficient state management
- Image optimization

## 🔒 Security

### **Data Protection:**
- Secure API communication
- Input validation
- Error handling
- No sensitive data logging

### **Authentication:**
- Supabase Row Level Security (RLS)
- Secure API keys
- Environment variable protection

## 🆘 Troubleshooting

### **Common Issues:**

1. **Supabase Connection Error:**
   - Check your URL and API key
   - Verify internet connection
   - Check Supabase project status

2. **Build Errors:**
   - Run `flutter clean`
   - Run `flutter pub get`
   - Check Flutter version compatibility

3. **Search Not Working:**
   - Verify database tables exist
   - Check data import status
   - Test with known student codes

### **Debug Mode:**
```bash
flutter run --debug
```

## 📞 Support

### **Getting Help:**
1. Check the troubleshooting section
2. Review Supabase documentation
3. Check Flutter documentation
4. Create an issue in the repository

### **Useful Commands:**
```bash
# Check Flutter installation
flutter doctor

# Update dependencies
flutter pub upgrade

# Clean build cache
flutter clean

# Get package info
flutter pub deps
```

## 🎯 Future Enhancements

### **Planned Features:**
- 🔔 Push notifications
- 📊 Advanced analytics
- 📱 Offline mode
- 🔐 User authentication
- 📤 Data export
- 🎨 Dark mode
- 🌐 Multi-language support

### **Technical Improvements:**
- State management optimization
- Performance monitoring
- Automated testing
- CI/CD pipeline

---

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Development

### **Project Structure:**
```
lib/
├── main.dart
├── models/
│   └── student.dart
├── screens/
│   ├── home_screen.dart
│   ├── search_screen.dart
│   ├── student_details_screen.dart
│   └── analytics_screen.dart
├── widgets/
│   ├── feature_card.dart
│   └── student_card.dart
└── utils/
    └── constants.dart
```

### **Contributing:**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

**Built with ❤️ using Flutter and Supabase**
