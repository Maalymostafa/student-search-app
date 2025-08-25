import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF1976D2);
  static const Color secondary = Color(0xFF42A5F5);
  static const Color accent = Color(0xFF2196F3);
  static const Color background = Color(0xFFF5F5F5);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color error = Color(0xFFD32F2F);
  static const Color success = Color(0xFF388E3C);
  static const Color warning = Color(0xFFF57C00);
  static const Color info = Color(0xFF1976D2);
}

class AppSizes {
  static const double padding = 16.0;
  static const double smallPadding = 8.0;
  static const double largePadding = 24.0;
  static const double borderRadius = 12.0;
  static const double cardElevation = 4.0;
}

class AppTextStyles {
  static const TextStyle heading1 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.black87,
  );
  
  static const TextStyle heading2 = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: Colors.black87,
  );
  
  static const TextStyle body1 = TextStyle(
    fontSize: 16,
    color: Colors.black87,
  );
  
  static const TextStyle body2 = TextStyle(
    fontSize: 14,
    color: Colors.black54,
  );
  
  static const TextStyle caption = TextStyle(
    fontSize: 12,
    color: Colors.black45,
  );
}

class ApiConfig {
  // For local development
  static const String baseUrl = 'http://localhost:3000';
  
  // For production (replace with your Vercel URL)
  // static const String baseUrl = 'https://your-app.vercel.app';
  
  static const String searchEndpoint = '/api/search';
  static const String healthEndpoint = '/api/health';
}

class DemoData {
  static const Map<String, Map<String, dynamic>> students = {
    'G4001': {
      'name': 'Ahmed Mohamed',
      'student_code': 'G4001',
      'is_confirmed': true,
      'september': ['A', '90', 'A', '85', 'B+', '88', 'A', '92', 'A'],
      'october': ['A', '95', 'A', '87', 'A', '91', 'B+', '89', 'A'],
      'november': ['A', '93', 'A', '88', 'A', '90', 'A', '94', 'A'],
      'december': ['A', '96', 'A', '89', 'A', '92', 'A', '95', 'A'],
    },
    'G5001': {
      'name': 'Fatima Ali',
      'student_code': 'G5001',
      'is_confirmed': true,
      'september': ['A', '88', 'B+', '82', 'A', '90', 'A', '87', 'A'],
      'october': ['A', '92', 'A', '85', 'B+', '88', 'A', '91', 'A'],
      'november': ['A', '89', 'A', '93', 'A', '86', 'B+', '90', 'A'],
      'december': ['A', '94', 'A', '88', 'A', '91', 'A', '93', 'A'],
    },
    'G6001': {
      'name': 'Omar Hassan',
      'student_code': 'G6001',
      'is_confirmed': false,
      'september': ['B+', '85', 'A', '90', 'A', '87', 'B+', '89', 'B+'],
      'october': ['A', '91', 'B+', '86', 'A', '92', 'A', '88', 'A'],
      'november': ['A', '88', 'A', '94', 'B+', '85', 'A', '91', 'A'],
      'december': ['A', '93', 'A', '87', 'A', '89', 'A', '92', 'A'],
    },
    'P1001': {
      'name': 'Layla Ahmed',
      'student_code': 'P1001',
      'is_confirmed': true,
      'september': ['A', '92', 'A', '88', 'A', '90', 'A', '94', 'A'],
      'october': ['A', '89', 'A', '93', 'A', '87', 'A', '91', 'A'],
      'november': ['A', '95', 'A', '86', 'A', '92', 'A', '88', 'A'],
      'december': ['A', '90', 'A', '94', 'A', '89', 'A', '93', 'A'],
    },
  };
}
