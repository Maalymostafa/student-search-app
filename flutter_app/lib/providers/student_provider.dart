import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:student_search_app/models/student.dart';
import 'package:student_search_app/utils/constants.dart';

class StudentProvider extends ChangeNotifier {
  Student? _student;
  bool _isLoading = false;
  String? _error;
  bool _useDemoMode = false; // Default to database mode

  Student? get student => _student;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get useDemoMode => _useDemoMode;

  void setUseDemoMode(bool value) {
    _useDemoMode = value;
    notifyListeners();
  }

  Future<void> searchStudent(String code) async {
    if (code.isEmpty || code.length < 2) {
      _error = 'برجاء كتابة الكود';
      _student = null;
      notifyListeners();
      return;
    }

    _isLoading = true;
    _error = null;
    _student = null;
    notifyListeners();

    try {
      if (_useDemoMode) {
        await _searchInDemoData(code);
      } else {
        await _searchInDatabase(code);
      }
    } catch (e) {
      _error = 'حدث خطأ في البحث: $e';
      _student = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> _searchInDemoData(String code) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));

    final normalizedCode = code.toUpperCase().replaceAll(RegExp(r'[^A-Z0-9]'), '');
    
    // Check if code exists in demo data
    if (DemoData.demoStudents.containsKey(normalizedCode)) {
      final studentData = DemoData.demoStudents[normalizedCode]!;
      _student = Student.fromDemoData(normalizedCode, studentData);
    } else {
      // Search by name if code not found
      for (final entry in DemoData.demoStudents.entries) {
        if (entry.key.contains(normalizedCode) || normalizedCode.contains(entry.key)) {
          _student = Student.fromDemoData(entry.key, entry.value);
          return;
        }
      }
      _error = 'الكود غير صحيح تاكد من الكود';
    }
  }

  Future<void> _searchInDatabase(String code) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.searchEndpoint}'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({'code': code}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        
        if (data['success'] == true) {
          _student = Student.fromJson(data['data']);
        } else {
          _error = data['message'] ?? 'حدث خطأ في البحث';
        }
      } else {
        _error = 'حدث خطأ في الاتصال بالخادم';
      }
    } catch (e) {
      _error = 'حدث خطأ في الاتصال: $e';
    }
  }

  void clearSearch() {
    _student = null;
    _error = null;
    notifyListeners();
  }

  Future<bool> checkApiHealth() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.healthEndpoint}'),
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  String? validateCode(String code) {
    if (code.isEmpty) {
      return 'برجاء كتابة الكود';
    }
    
    if (code.length < 2) {
      return 'الكود يجب أن يكون على الأقل حرفين';
    }

    final sheetPrefix = code.substring(0, 2).toUpperCase();
    const allowedSheets = ['G4', 'G5', 'G6', 'P1'];
    
    if (!allowedSheets.contains(sheetPrefix)) {
      return 'الكود غير صالح أو لا ينتمي لأي مستوى معروف';
    }

    return null;
  }
}
