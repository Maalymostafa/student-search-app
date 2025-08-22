class Student {
  final String id;
  final String name;
  final String studentCode;
  final bool isConfirmed;
  final Map<String, List<String>> performance;

  Student({
    required this.id,
    required this.name,
    required this.studentCode,
    required this.isConfirmed,
    required this.performance,
  });

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      studentCode: json['student_code'] ?? '',
      isConfirmed: json['is_confirmed'] == true || json['is_confirmed'] == 'TRUE',
      performance: {
        'september': List<String>.from(json['september'] ?? []),
        'october': List<String>.from(json['october'] ?? []),
        'november': List<String>.from(json['november'] ?? []),
        'december': List<String>.from(json['december'] ?? []),
      },
    );
  }

  factory Student.fromDemoData(String code, Map<String, dynamic> data) {
    return Student(
      id: '1',
      name: data['name'] ?? '',
      studentCode: data['student_code'] ?? code,
      isConfirmed: data['is_confirmed'] ?? false,
      performance: {
        'september': List<String>.from(data['september'] ?? []),
        'october': List<String>.from(data['october'] ?? []),
        'november': List<String>.from(data['november'] ?? []),
        'december': List<String>.from(data['december'] ?? []),
      },
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'student_code': studentCode,
      'is_confirmed': isConfirmed,
      'september': performance['september'] ?? [],
      'october': performance['october'] ?? [],
      'november': performance['november'] ?? [],
      'december': performance['december'] ?? [],
    };
  }

  List<String> getMonthData(String month) {
    return performance[month.toLowerCase()] ?? List.filled(9, '');
  }

  String getSessionPerformance(String month, int session, int type) {
    final monthData = getMonthData(month);
    final index = (session - 1) * 2 + type;
    return index < monthData.length ? monthData[index] : '';
  }

  String getSessionQuiz(String month, int session) {
    return getSessionPerformance(month, session, 1);
  }

  String getSessionPerf(String month, int session) {
    return getSessionPerformance(month, session, 0);
  }

  String getFinalEvaluation(String month) {
    final monthData = getMonthData(month);
    return monthData.length > 8 ? monthData[8] : '';
  }
}
