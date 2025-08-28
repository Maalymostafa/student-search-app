class Student {
  final String id;
  final String name;
  final String studentCode;
  final bool isConfirmed;
  final Map<String, Map<String, dynamic>> performance;

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
        'first_semester': _extractSemesterData(json, 'first_sem'),
        'second_semester': _extractSemesterData(json, 'second_sem'),
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
        'first_semester': _extractSemesterData(data, 'first_sem'),
        'second_semester': _extractSemesterData(data, 'second_sem'),
      },
    );
  }

  static Map<String, dynamic> _extractSemesterData(Map<String, dynamic> data, String semesterPrefix) {
    return {
      'september': _extractMonthData(data, '${semesterPrefix}_september'),
      'october': _extractMonthData(data, '${semesterPrefix}_october'),
      'november': _extractMonthData(data, '${semesterPrefix}_november'),
      'december': _extractMonthData(data, '${semesterPrefix}_december'),
      'january': _extractMonthData(data, '${semesterPrefix}_january'),
      'february': _extractMonthData(data, '${semesterPrefix}_february'),
      'march': _extractMonthData(data, '${semesterPrefix}_march'),
      'april': _extractMonthData(data, '${semesterPrefix}_april'),
    };
  }

  static Map<String, dynamic> _extractMonthData(Map<String, dynamic> data, String monthPrefix) {
    return {
      'session1': {
        'attendance': data['${monthPrefix}_session1_attendance'] ?? 0,
        'question1': data['${monthPrefix}_session1_question1'] ?? 0,
        'question2': data['${monthPrefix}_session1_question2'] ?? 0,
        'quiz': data['${monthPrefix}_session1_quiz'] ?? 0,
      },
      'session2': {
        'attendance': data['${monthPrefix}_session2_attendance'] ?? 0,
        'question1': data['${monthPrefix}_session2_question1'] ?? 0,
        'question2': data['${monthPrefix}_session2_question2'] ?? 0,
        'quiz': data['${monthPrefix}_session2_quiz'] ?? 0,
      },
      'session3': {
        'attendance': data['${monthPrefix}_session3_attendance'] ?? 0,
        'question1': data['${monthPrefix}_session3_question1'] ?? 0,
        'question2': data['${monthPrefix}_session3_question2'] ?? 0,
        'quiz': data['${monthPrefix}_session3_quiz'] ?? 0,
      },
      'session4': {
        'attendance': data['${monthPrefix}_session4_attendance'] ?? 0,
        'question1': data['${monthPrefix}_session4_question1'] ?? 0,
        'question2': data['${monthPrefix}_session4_question2'] ?? 0,
        'quiz': data['${monthPrefix}_session4_quiz'] ?? 0,
      },
      'total_attendance': data['${monthPrefix}_total_attendance'] ?? 0,
      'total_questions': data['${monthPrefix}_total_questions'] ?? 0,
      'total_quiz': data['${monthPrefix}_total_quiz'] ?? 0,
      'total_score': data['${monthPrefix}_total_score'] ?? 0,
    };
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'student_code': studentCode,
      'is_confirmed': isConfirmed,
      'performance': performance,
    };
  }

  // Helper methods to get session data
  Map<String, dynamic> getSessionData(String semester, String month, int session) {
    final semesterData = performance[semester.toLowerCase()];
    if (semesterData == null) return {};
    
    final monthData = semesterData[month.toLowerCase()];
    if (monthData == null) return {};
    
    return monthData['session$session'] ?? {};
  }

  int getSessionAttendance(String semester, String month, int session) {
    final sessionData = getSessionData(semester, month, session);
    return sessionData['attendance'] ?? 0;
  }

  int getSessionQuestion(String semester, String month, int session, int question) {
    final sessionData = getSessionData(semester, month, session);
    return sessionData['question$question'] ?? 0;
  }

  int getSessionQuiz(String semester, String month, int session) {
    final sessionData = getSessionData(semester, month, session);
    return sessionData['quiz'] ?? 0;
  }

  // Monthly totals
  int getMonthTotalAttendance(String semester, String month) {
    final semesterData = performance[semester.toLowerCase()];
    if (semesterData == null) return 0;
    
    final monthData = semesterData[month.toLowerCase()];
    return monthData?['total_attendance'] ?? 0;
  }

  int getMonthTotalQuestions(String semester, String month) {
    final semesterData = performance[semester.toLowerCase()];
    if (semesterData == null) return 0;
    
    final monthData = semesterData[month.toLowerCase()];
    return monthData?['total_questions'] ?? 0;
  }

  int getMonthTotalQuiz(String semester, String month) {
    final semesterData = performance[semester.toLowerCase()];
    if (semesterData == null) return 0;
    
    final monthData = semesterData[month.toLowerCase()];
    return monthData?['total_quiz'] ?? 0;
  }

  int getMonthTotalScore(String semester, String month) {
    final semesterData = performance[semester.toLowerCase()];
    if (semesterData == null) return 0;
    
    final monthData = semesterData[month.toLowerCase()];
    return monthData?['total_score'] ?? 0;
  }

  // Semester totals
  int getSemesterTotalScore(String semester) {
    int total = 0;
    final semesterData = performance[semester.toLowerCase()];
    if (semesterData == null) return 0;
    
    for (final month in semesterData.keys) {
      total += getMonthTotalScore(semester, month);
    }
    return total;
  }

  // Overall totals
  int getTotalScore() {
    return getSemesterTotalScore('first_semester') + getSemesterTotalScore('second_semester');
  }

  // Convert score to grade
  String scoreToGrade(int score) {
    if (score >= 100) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 40) return 'C+';
    if (score >= 20) return 'C';
    return 'D';
  }

  // Get grade for a month
  String getMonthGrade(String semester, String month) {
    final score = getMonthTotalScore(semester, month);
    return scoreToGrade(score);
  }

  // Get grade for a semester
  String getSemesterGrade(String semester) {
    final score = getSemesterTotalScore(semester);
    return scoreToGrade(score);
  }

  // Get overall grade
  String getOverallGrade() {
    final totalScore = getTotalScore();
    return scoreToGrade(totalScore);
  }

  // Get available months for a semester
  List<String> getSemesterMonths(String semester) {
    if (semester.toLowerCase() == 'first_semester') {
      return ['september', 'october', 'november', 'december'];
    } else if (semester.toLowerCase() == 'second_semester') {
      return ['january', 'february', 'march', 'april'];
    }
    return [];
  }

  // Get semester name for display
  String getSemesterDisplayName(String semester) {
    if (semester.toLowerCase() == 'first_semester') {
      return 'First Semester';
    } else if (semester.toLowerCase() == 'second_semester') {
      return 'Second Semester';
    }
    return semester;
  }
}
