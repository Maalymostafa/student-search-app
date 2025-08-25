class Student {
  final int id;
  final String studentCode;
  final String fullNameArabic;
  final String gradeLevel;
  final String? subscriptionType;
  final String? transferPhone;
  final String? whatsappPhone;
  final String? transferTime;
  final String? transferDate;
  final String? transferImageUrl;
  final bool isConfirmed;
  final String? enrollmentDate;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  Student({
    required this.id,
    required this.studentCode,
    required this.fullNameArabic,
    required this.gradeLevel,
    this.subscriptionType,
    this.transferPhone,
    this.whatsappPhone,
    this.transferTime,
    this.transferDate,
    this.transferImageUrl,
    required this.isConfirmed,
    this.enrollmentDate,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      id: json['id'],
      studentCode: json['student_code'] ?? '',
      fullNameArabic: json['full_name_arabic'] ?? '',
      gradeLevel: json['grade_level'] ?? '',
      subscriptionType: json['subscription_type'],
      transferPhone: json['transfer_phone'],
      whatsappPhone: json['whatsapp_phone'],
      transferTime: json['transfer_time'],
      transferDate: json['transfer_date'],
      transferImageUrl: json['transfer_image_url'],
      isConfirmed: json['is_confirmed'] ?? false,
      enrollmentDate: json['enrollment_date'],
      notes: json['notes'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'student_code': studentCode,
      'full_name_arabic': fullNameArabic,
      'grade_level': gradeLevel,
      'subscription_type': subscriptionType,
      'transfer_phone': transferPhone,
      'whatsapp_phone': whatsappPhone,
      'transfer_time': transferTime,
      'transfer_date': transferDate,
      'transfer_image_url': transferImageUrl,
      'is_confirmed': isConfirmed,
      'enrollment_date': enrollmentDate,
      'notes': notes,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  @override
  String toString() {
    return 'Student(id: $id, studentCode: $studentCode, fullNameArabic: $fullNameArabic, gradeLevel: $gradeLevel)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Student && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;
}
