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
  static const String baseUrl = 'https://student-search-glxio0q0b-maaly-el-mansys-projects.vercel.app';
  
  // For production (replace with your Vercel URL)
  // static const String baseUrl = 'https://your-app.vercel.app';
  
  static const String searchEndpoint = '/api/search';
  static const String healthEndpoint = '/api/health';
}

class DemoData {
  // Demo student data with formula-based codes
  // Formula: ="G4" & TEXT(DEC2HEX(A4+100,4), "0000")
  static const Map<String, Map<String, dynamic>> demoStudents = {
    'G4001': {
      'name': 'أحمد علي حسن',
      'grade': 'Grade 4',
      'phone': '+966501234567',
      'parent_phone': '+966501234568',
      'enrollment_date': '2024-09-01',
      'subjects': ['math', 'science', 'english', 'arabic'],
      'performance': {
        // First Semester (Sep-Dec)
        'first_sem_september_session1_attendance': 1,
        'first_sem_september_session1_q1': 2,
        'first_sem_september_session1_q2': 1,
        'first_sem_september_session1_quiz': 18,
        'first_sem_september_session1_total': 22,
        
        'first_sem_september_session2_attendance': 1,
        'first_sem_september_session2_q1': 2,
        'first_sem_september_session2_q2': 2,
        'first_sem_september_session2_quiz': 19,
        'first_sem_september_session2_total': 24,
        
        'first_sem_october_session1_attendance': 1,
        'first_sem_october_session1_q1': 1,
        'first_sem_october_session1_q2': 2,
        'first_sem_october_session1_quiz': 17,
        'first_sem_october_session1_total': 21,
        
        'first_sem_october_session2_attendance': 1,
        'first_sem_october_session2_q1': 2,
        'first_sem_october_session2_q2': 1,
        'first_sem_october_session2_quiz': 20,
        'first_sem_october_session2_total': 24,
        
        'first_sem_november_session1_attendance': 1,
        'first_sem_november_session1_q1': 2,
        'first_sem_november_session1_q2': 2,
        'first_sem_november_session1_quiz': 19,
        'first_sem_november_session1_total': 24,
        
        'first_sem_november_session2_attendance': 1,
        'first_sem_november_session2_q1': 1,
        'first_sem_november_session2_q2': 2,
        'first_sem_november_session2_quiz': 18,
        'first_sem_november_session2_total': 22,
        
        'first_sem_december_session1_attendance': 1,
        'first_sem_december_session1_q1': 2,
        'first_sem_december_session1_q2': 2,
        'first_sem_december_session1_quiz': 20,
        'first_sem_december_session1_total': 25,
        
        'first_sem_december_session2_attendance': 1,
        'first_sem_december_session2_q1': 2,
        'first_sem_december_session2_q2': 1,
        'first_sem_december_session2_quiz': 19,
        'first_sem_december_session2_total': 23,
        
        // Second Semester (Jan-Apr)
        'second_sem_january_session1_attendance': 1,
        'second_sem_january_session1_q1': 2,
        'second_sem_january_session1_q2': 2,
        'second_sem_january_session1_quiz': 20,
        'second_sem_january_session1_total': 25,
        
        'second_sem_january_session2_attendance': 1,
        'second_sem_january_session2_q1': 1,
        'second_sem_january_session2_q2': 2,
        'second_sem_january_session2_quiz': 19,
        'second_sem_january_session2_total': 23,
        
        'second_sem_february_session1_attendance': 1,
        'second_sem_february_session1_q1': 2,
        'second_sem_february_session1_q2': 1,
        'second_sem_february_session1_quiz': 18,
        'second_sem_february_session1_total': 22,
        
        'second_sem_february_session2_attendance': 1,
        'second_sem_february_session2_q1': 2,
        'second_sem_february_session2_q2': 2,
        'second_sem_february_session2_quiz': 20,
        'second_sem_february_session2_total': 25,
        
        'second_sem_march_session1_attendance': 1,
        'second_sem_march_session1_q1': 1,
        'second_sem_march_session1_q2': 2,
        'second_sem_march_session1_quiz': 19,
        'second_sem_march_session1_total': 23,
        
        'second_sem_march_session2_attendance': 1,
        'second_sem_march_session2_q1': 2,
        'second_sem_march_session2_q2': 1,
        'second_sem_march_session2_quiz': 20,
        'second_sem_march_session2_total': 24,
        
        'second_sem_april_session1_attendance': 1,
        'second_sem_april_session1_q1': 2,
        'second_sem_april_session1_q2': 2,
        'second_sem_april_session1_quiz': 19,
        'second_sem_april_session1_total': 24,
        
        'second_sem_april_session2_attendance': 1,
        'second_sem_april_session2_q1': 1,
        'second_sem_april_session2_q2': 2,
        'second_sem_april_session2_quiz': 20,
        'second_sem_april_session2_total': 24,
      }
    },
    'G4002': {
      'name': 'فاطمة محمد صالح',
      'grade': 'Grade 4',
      'phone': '+966501234569',
      'parent_phone': '+966501234570',
      'enrollment_date': '2024-09-01',
      'subjects': ['math', 'science', 'english', 'arabic'],
      'performance': {
        // First Semester
        'first_sem_september_session1_attendance': 1,
        'first_sem_september_session1_q1': 2,
        'first_sem_september_session1_q2': 2,
        'first_sem_september_session1_quiz': 20,
        'first_sem_september_session1_total': 25,
        
        'first_sem_september_session2_attendance': 1,
        'first_sem_september_session2_q1': 1,
        'first_sem_september_session2_q2': 2,
        'first_sem_september_session2_quiz': 19,
        'first_sem_september_session2_total': 23,
        
        // Add more sessions as needed...
      }
    },
    'G5001': {
      'name': 'ليلى محمد أحمد',
      'grade': 'Grade 5',
      'phone': '+966501234571',
      'parent_phone': '+966501234572',
      'enrollment_date': '2024-09-01',
      'subjects': ['math', 'science', 'english', 'arabic'],
      'performance': {
        // Grade 5 performance data...
      }
    },
    'G7001': {
      'name': 'علي محمد أحمد',
      'grade': 'Prep 1',
      'phone': '+966501234573',
      'parent_phone': '+966501234574',
      'enrollment_date': '2024-09-01',
      'subjects': ['math', 'science', 'english', 'arabic'],
      'performance': {
        // Prep 1 performance data...
      }
    }
  };
}
