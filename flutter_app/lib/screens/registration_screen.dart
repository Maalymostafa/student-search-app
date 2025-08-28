import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:student_search_app/utils/constants.dart';

class RegistrationScreen extends StatefulWidget {
  const RegistrationScreen({Key? key}) : super(key: key);

  @override
  _RegistrationScreenState createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _studentNumberController = TextEditingController();
  final _parentNumberController = TextEditingController();
  final _transferPhoneController = TextEditingController();
  final _whatsappPhoneController = TextEditingController();
  final _notesController = TextEditingController();
  
  String _selectedGrade = '';
  String _selectedSubscription = '';
  DateTime _selectedDate = DateTime.now();
  TimeOfDay _selectedTime = TimeOfDay.now();
  
  bool _isLoading = false;
  String? _successMessage;
  String? _errorMessage;

  final List<String> _grades = ['Grade 4', 'Grade 5', 'Grade 6', 'Prep 1'];
  final List<String> _subscriptions = [
    'اشتراك شهري 120ج',
    'اشتراك الترم 600ج'
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _studentNumberController.dispose();
    _parentNumberController.dispose();
    _transferPhoneController.dispose();
    _whatsappPhoneController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _selectTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: _selectedTime,
    );
    if (picked != null && picked != _selectedTime) {
      setState(() {
        _selectedTime = picked;
      });
    }
  }

  Future<void> _registerStudent() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedGrade.isEmpty || _selectedSubscription.isEmpty) {
      setState(() {
        _errorMessage = 'يرجى اختيار المرحلة الدراسية ونوع الاشتراك';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _successMessage = null;
    });

    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/api/register-student'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'full_name_arabic': _nameController.text,
          'grade_level': _selectedGrade,
          'student_number': _studentNumberController.text,
          'parent_number': _parentNumberController.text,
          'subscription_type': _selectedSubscription,
          'transfer_phone': _transferPhoneController.text,
          'whatsapp_phone': _whatsappPhoneController.text,
          'transfer_date': '${_selectedDate.year}-${_selectedDate.month.toString().padLeft(2, '0')}-${_selectedDate.day.toString().padLeft(2, '0')}',
          'transfer_time': '${_selectedTime.hour.toString().padLeft(2, '0')}:${_selectedTime.minute.toString().padLeft(2, '0')}',
          'notes': _notesController.text,
        }),
      );

      final data = json.decode(response.body);

      if (data['success']) {
        setState(() {
          _successMessage = 'تم تسجيل الطالب بنجاح!\nكود الطالب: ${data['student_code']}';
        });
        _formKey.currentState!.reset();
        _nameController.clear();
        _studentNumberController.clear();
        _parentNumberController.clear();
        _transferPhoneController.clear();
        _whatsappPhoneController.clear();
        _notesController.clear();
        setState(() {
          _selectedGrade = '';
          _selectedSubscription = '';
          _selectedDate = DateTime.now();
          _selectedTime = TimeOfDay.now();
        });
      } else {
        setState(() {
          _errorMessage = data['message'] ?? 'حدث خطأ في التسجيل';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'حدث خطأ في الاتصال بالخادم';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('تسجيل طالب جديد'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSizes.padding),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Success Message
              if (_successMessage != null)
                Container(
                  padding: const EdgeInsets.all(AppSizes.smallPadding),
                  margin: const EdgeInsets.only(bottom: AppSizes.padding),
                  decoration: BoxDecoration(
                    color: Colors.green.shade50,
                    border: Border.all(color: Colors.green),
                    borderRadius: BorderRadius.circular(AppSizes.borderRadius),
                  ),
                  child: Text(
                    _successMessage!,
                    style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center,
                  ),
                ),

              // Error Message
              if (_errorMessage != null)
                Container(
                  padding: const EdgeInsets.all(AppSizes.smallPadding),
                  margin: const EdgeInsets.only(bottom: AppSizes.padding),
                  decoration: BoxDecoration(
                    color: Colors.red.shade50,
                    border: Border.all(color: Colors.red),
                    borderRadius: BorderRadius.circular(AppSizes.borderRadius),
                  ),
                  child: Text(
                    _errorMessage!,
                    style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center,
                  ),
                ),

              // Student Name
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'الاسم الرباعي *',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'يرجى إدخال الاسم الرباعي';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppSizes.smallPadding),

              // Grade Level
              DropdownButtonFormField<String>(
                value: _selectedGrade.isEmpty ? null : _selectedGrade,
                decoration: const InputDecoration(
                  labelText: 'المرحلة الدراسية *',
                  border: OutlineInputBorder(),
                ),
                items: _grades.map((String grade) {
                  return DropdownMenuItem<String>(
                    value: grade,
                    child: Text(grade),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedGrade = newValue ?? '';
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'يرجى اختيار المرحلة الدراسية';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppSizes.smallPadding),

              // Student Number
              TextFormField(
                controller: _studentNumberController,
                decoration: const InputDecoration(
                  labelText: 'رقم الطالب *',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'يرجى إدخال رقم الطالب';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppSizes.smallPadding),

              // Parent Number
              TextFormField(
                controller: _parentNumberController,
                decoration: const InputDecoration(
                  labelText: 'رقم ولي الأمر *',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.phone,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'يرجى إدخال رقم ولي الأمر';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppSizes.smallPadding),

              // Subscription Type
              DropdownButtonFormField<String>(
                value: _selectedSubscription.isEmpty ? null : _selectedSubscription,
                decoration: const InputDecoration(
                  labelText: 'نوع الاشتراك *',
                  border: OutlineInputBorder(),
                ),
                items: _subscriptions.map((String subscription) {
                  return DropdownMenuItem<String>(
                    value: subscription,
                    child: Text(subscription),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedSubscription = newValue ?? '';
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'يرجى اختيار نوع الاشتراك';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppSizes.smallPadding),

              // Transfer Phone
              TextFormField(
                controller: _transferPhoneController,
                decoration: const InputDecoration(
                  labelText: 'رقم الموبيل (التحويل) *',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.phone,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'يرجى إدخال رقم الموبيل';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppSizes.smallPadding),

              // WhatsApp Phone
              TextFormField(
                controller: _whatsappPhoneController,
                decoration: const InputDecoration(
                  labelText: 'رقم الواتساب *',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.phone,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'يرجى إدخال رقم الواتساب';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppSizes.smallPadding),

              // Transfer Date
              InkWell(
                onTap: () => _selectDate(context),
                child: InputDecorator(
                  decoration: const InputDecoration(
                    labelText: 'تاريخ التحويل *',
                    border: OutlineInputBorder(),
                  ),
                  child: Text(
                    '${_selectedDate.year}-${_selectedDate.month.toString().padLeft(2, '0')}-${_selectedDate.day.toString().padLeft(2, '0')}',
                  ),
                ),
              ),
              const SizedBox(height: AppSizes.smallPadding),

              // Transfer Time
              InkWell(
                onTap: () => _selectTime(context),
                child: InputDecorator(
                  decoration: const InputDecoration(
                    labelText: 'وقت التحويل *',
                    border: OutlineInputBorder(),
                  ),
                  child: Text(
                    '${_selectedTime.hour.toString().padLeft(2, '0')}:${_selectedTime.minute.toString().padLeft(2, '0')}',
                  ),
                ),
              ),
              const SizedBox(height: AppSizes.smallPadding),

              // Notes
              TextFormField(
                controller: _notesController,
                decoration: const InputDecoration(
                  labelText: 'ملاحظات إضافية',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
              ),
              const SizedBox(height: AppSizes.largePadding),

              // Submit Button
              ElevatedButton(
                onPressed: _isLoading ? null : _registerStudent,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: AppSizes.buttonHeight / 2),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppSizes.borderRadius),
                  ),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                        'تسجيل الطالب',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
