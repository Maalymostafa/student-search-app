import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF00838F);
  static const Color secondary = Color(0xFF0277BD);
  static const Color accent = Color(0xFF0288D1);
  static const Color buttonColor = Color(0xFF00796B);
  static const Color buttonHoverColor = Color(0xFF004D40);
  static const Color inputBorderColor = Color(0xFF81D4FA);
  static const Color tableHeaderColor = Color(0xFF0288D1);
  static const Color successColor = Colors.green;
  static const Color errorColor = Colors.red;
  static const Color warningColor = Color(0xFFFFC107);
  static const Color backgroundOverlay = Color(0xCCE0F7FA);
}

class AppTextStyles {
  static const TextStyle heading1 = TextStyle(
    color: AppColors.primary,
    fontSize: 30,
    fontWeight: FontWeight.w700,
  );

  static const TextStyle heading2 = TextStyle(
    color: AppColors.secondary,
    fontSize: 26,
    fontWeight: FontWeight.w600,
  );

  static const TextStyle heading3 = TextStyle(
    color: AppColors.accent,
    fontSize: 24,
    fontWeight: FontWeight.w500,
  );

  static const TextStyle bodyText = TextStyle(
    color: Colors.black87,
    fontSize: 16,
    fontWeight: FontWeight.w400,
  );

  static const TextStyle buttonText = TextStyle(
    color: Colors.white,
    fontSize: 16,
    fontWeight: FontWeight.w600,
  );

  static const TextStyle tableHeader = TextStyle(
    color: Colors.white,
    fontSize: 18,
    fontWeight: FontWeight.bold,
  );

  static const TextStyle tableSubHeader = TextStyle(
    color: Colors.white,
    fontSize: 16,
    fontWeight: FontWeight.bold,
  );

  static const TextStyle resultText = TextStyle(
    fontSize: 30,
    fontWeight: FontWeight.bold,
  );

  static const TextStyle statusText = TextStyle(
    fontSize: 50,
    fontWeight: FontWeight.bold,
  );
}

class AppSizes {
  static const double padding = 20.0;
  static const double smallPadding = 12.0;
  static const double largePadding = 25.0;
  static const double borderRadius = 12.0;
  static const double inputHeight = 50.0;
  static const double buttonHeight = 50.0;
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
