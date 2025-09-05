import 'package:flutter/material.dart';
import 'package:student_search_app/models/student.dart';
import 'package:student_search_app/utils/constants.dart';

class PerformanceTable extends StatefulWidget {
  final Student student;

  const PerformanceTable({
    super.key,
    required this.student,
  });

  @override
  State<PerformanceTable> createState() => _PerformanceTableState();
}

class _PerformanceTableState extends State<PerformanceTable> {
  String selectedSemester = 'first_semester';

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Semester selector
        Container(
          margin: const EdgeInsets.only(bottom: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildSemesterButton('first_semester', 'First Semester'),
              const SizedBox(width: 16),
              _buildSemesterButton('second_semester', 'Second Semester'),
            ],
          ),
        ),
        
        // Performance table
        Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSizes.borderRadius),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Table(
          border: TableBorder.all(
            color: AppColors.inputBorderColor,
            width: 1,
          ),
          children: [
                // Header row 1 - Month names
            TableRow(
              decoration: const BoxDecoration(
                color: AppColors.tableHeaderColor,
              ),
              children: [
                const TableCell(
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: Text(
                      'Month',
                      style: AppTextStyles.tableHeader,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
                const TableCell(
                  child: Padding(
                        padding: EdgeInsets.all(8),
                    child: Text(
                      'Session 1',
                          style: AppTextStyles.tableSubHeader,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
                const TableCell(
                  child: Padding(
                        padding: EdgeInsets.all(8),
                    child: Text(
                      'Session 2',
                          style: AppTextStyles.tableSubHeader,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
                const TableCell(
                  child: Padding(
                        padding: EdgeInsets.all(8),
                    child: Text(
                      'Session 3',
                          style: AppTextStyles.tableSubHeader,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
                const TableCell(
                  child: Padding(
                        padding: EdgeInsets.all(8),
                    child: Text(
                      'Session 4',
                          style: AppTextStyles.tableSubHeader,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
                const TableCell(
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: Text(
                          'Monthly Total',
                      style: AppTextStyles.tableHeader,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ],
            ),
                // Header row 2 - Session details
            TableRow(
              decoration: const BoxDecoration(
                color: AppColors.tableHeaderColor,
              ),
              children: const [
                TableCell(child: SizedBox.shrink()),
                TableCell(
                  child: Padding(
                        padding: EdgeInsets.all(4),
                        child: Column(
                          children: const [
                            Text('Att.', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                            Text('Q1', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                            Text('Q2', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                            Text('Quiz', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                          ],
                        ),
                      ),
                    ),
                    TableCell(
                      child: Padding(
                        padding: EdgeInsets.all(4),
                        child: Column(
                          children: const [
                            Text('Att.', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                            Text('Q1', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                            Text('Q2', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                            Text('Quiz', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                          ],
                        ),
                      ),
                    ),
                    TableCell(
                      child: Padding(
                        padding: EdgeInsets.all(4),
                        child: Column(
                          children: const [
                            Text('Att.', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                            Text('Q1', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                            Text('Q2', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                            Text('Quiz', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                          ],
                    ),
                  ),
                ),
                TableCell(
                  child: Padding(
                        padding: EdgeInsets.all(4),
                        child: Column(
                          children: const [
                            Text('Att.', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                            Text('Q1', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                            Text('Q2', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                            Text('Quiz', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                          ],
                        ),
                      ),
                    ),
                    TableCell(
                      child: Padding(
                        padding: EdgeInsets.all(4),
                        child: Column(
                          children: const [
                            Text('Att.', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                            Text('Ques.', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                            Text('Quiz', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                            Text('Total', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                // Data rows
                ...widget.student.getSemesterMonths(selectedSemester).map((month) => 
                  _buildMonthRow(month, selectedSemester)
                ),
                // Semester totals row
                _buildSemesterRow(),
              ],
            ),
          ),
        ),
        
        // Overall summary
        const SizedBox(height: 16),
        _buildOverallSummary(),
        
        // Detailed Session Results Section
        const SizedBox(height: 24),
        _buildDetailedSessionResults(),
      ],
    );
  }

  Widget _buildDetailedSessionResults() {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSizes.borderRadius),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section Header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(AppSizes.borderRadius),
                topRight: Radius.circular(AppSizes.borderRadius),
              ),
            ),
            child: const Text(
              'Detailed Session Results',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          
          // Detailed Results Content
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: widget.student.getSemesterMonths(selectedSemester).map((month) => 
                _buildDetailedMonthSection(month, selectedSemester)
              ).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailedMonthSection(String month, String semester) {
    final monthName = _getMonthDisplayName(month);
    final monthScore = widget.student.getMonthTotalScore(semester, month);
    final monthGrade = widget.student.getMonthGrade(semester, month);
    
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.inputBorderColor),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Month Header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.accent.withOpacity(0.1),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(8),
                topRight: Radius.circular(8),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  monthName,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: AppColors.primary,
                  ),
                ),
                Row(
                      children: [
                        Text(
                      'Score: $monthScore',
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: _getGradeColor(monthGrade),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        'Grade: $monthGrade',
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                        ),
                      ],
                    ),
                  ),
          
          // Sessions Details
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: List.generate(4, (sessionIndex) {
                final session = sessionIndex + 1;
                final attendance = widget.student.getSessionAttendance(semester, month, session);
                final question1 = widget.student.getSessionQuestion(semester, month, session, 1);
                final question2 = widget.student.getSessionQuestion(semester, month, session, 2);
                final quiz = widget.student.getSessionQuiz(semester, month, session);
                final sessionTotal = attendance + question1 + question2 + (quiz / 10); // Convert quiz score to 0-2 scale for display
                
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey[300]!),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Session Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                            'Session $session',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: AppColors.secondary,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: _getScoreColor(sessionTotal.toInt()),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              'Total: $sessionTotal/7',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      
                      // Session Details Grid
                      Row(
                        children: [
                          Expanded(
                            child: _buildDetailItem('Attendance', attendance, 1),
                          ),
                          Expanded(
                            child: _buildDetailItem('Question 1', question1, 2),
                          ),
                          Expanded(
                            child: _buildDetailItem('Question 2', question2, 2),
                          ),
                                                     Expanded(
                             child: _buildDetailItem('Quiz', quiz, 20),
                        ),
                      ],
                    ),
                    ],
                  ),
                );
              }),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailItem(String label, int score, int maxScore) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 4),
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w500,
              color: Colors.grey,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            '$score/$maxScore',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: _getScoreColor(score),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Color _getScoreColor(int score) {
    if (score >= 2) return Colors.green;
    if (score >= 1) return Colors.orange;
    return Colors.red;
  }

  Color _getGradeColor(String grade) {
    switch (grade) {
      case 'A': return Colors.green;
      case 'B+': return Colors.lightGreen;
      case 'B': return Colors.blue;
      case 'C+': return Colors.orange;
      case 'C': return Colors.deepOrange;
      default: return Colors.red;
    }
  }

  Widget _buildSemesterButton(String semester, String label) {
    final isSelected = selectedSemester == semester;
    return ElevatedButton(
      onPressed: () {
        setState(() {
          selectedSemester = semester;
        });
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: isSelected ? AppColors.accent : Colors.grey[300],
        foregroundColor: isSelected ? Colors.white : Colors.black87,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }

  TableRow _buildMonthRow(String month, String semester) {
    final monthName = _getMonthDisplayName(month);
    
    return TableRow(
      children: [
        // Month name
        TableCell(
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Text(
              monthName,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ),
        // Session 1
        TableCell(
          child: Padding(
            padding: const EdgeInsets.all(4),
            child: Column(
              children: [
                _buildScoreCell(widget.student.getSessionAttendance(semester, month, 1)),
                _buildScoreCell(widget.student.getSessionQuestion(semester, month, 1, 1)),
                _buildScoreCell(widget.student.getSessionQuestion(semester, month, 1, 2)),
                _buildScoreCell(widget.student.getSessionQuiz(semester, month, 1)),
              ],
            ),
          ),
        ),
        // Session 2
        TableCell(
          child: Padding(
            padding: const EdgeInsets.all(4),
            child: Column(
              children: [
                _buildScoreCell(widget.student.getSessionAttendance(semester, month, 2)),
                _buildScoreCell(widget.student.getSessionQuestion(semester, month, 2, 1)),
                _buildScoreCell(widget.student.getSessionQuestion(semester, month, 2, 2)),
                _buildScoreCell(widget.student.getSessionQuiz(semester, month, 2)),
              ],
            ),
          ),
        ),
        // Session 3
        TableCell(
          child: Padding(
            padding: const EdgeInsets.all(4),
            child: Column(
              children: [
                _buildScoreCell(widget.student.getSessionAttendance(semester, month, 3)),
                _buildScoreCell(widget.student.getSessionQuestion(semester, month, 3, 1)),
                _buildScoreCell(widget.student.getSessionQuestion(semester, month, 3, 2)),
                _buildScoreCell(widget.student.getSessionQuiz(semester, month, 3)),
              ],
            ),
          ),
        ),
        // Session 4
        TableCell(
          child: Padding(
            padding: const EdgeInsets.all(4),
            child: Column(
              children: [
                _buildScoreCell(widget.student.getSessionAttendance(semester, month, 4)),
                _buildScoreCell(widget.student.getSessionQuestion(semester, month, 4, 1)),
                _buildScoreCell(widget.student.getSessionQuestion(semester, month, 4, 2)),
                _buildScoreCell(widget.student.getSessionQuiz(semester, month, 4)),
              ],
            ),
          ),
        ),
        // Monthly totals
        TableCell(
          child: Padding(
            padding: const EdgeInsets.all(4),
            child: Column(
              children: [
                _buildScoreCell(widget.student.getMonthTotalAttendance(semester, month), isTotal: true),
                _buildScoreCell(widget.student.getMonthTotalQuestions(semester, month), isTotal: true),
                _buildScoreCell(widget.student.getMonthTotalQuiz(semester, month), isTotal: true),
                _buildScoreCell(widget.student.getMonthTotalScore(semester, month), isTotal: true),
              ],
            ),
          ),
        ),
      ],
    );
  }

  TableRow _buildSemesterRow() {
    final semesterTotal = widget.student.getSemesterTotalScore(selectedSemester);
    final semesterGrade = widget.student.getSemesterGrade(selectedSemester);
    
    return TableRow(
      decoration: const BoxDecoration(
        color: Color(0xFFE3F2FD),
      ),
      children: [
        // Semester label
        TableCell(
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Text(
              '${widget.student.getSemesterDisplayName(selectedSemester)} TOTAL',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: AppColors.primary,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ),
        // Empty cells for sessions
        const TableCell(child: SizedBox.shrink()),
        const TableCell(child: SizedBox.shrink()),
        const TableCell(child: SizedBox.shrink()),
        const TableCell(child: SizedBox.shrink()),
        // Semester total
        TableCell(
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Column(
              children: [
                Text(
                  'Total Score: $semesterTotal',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: AppColors.primary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 4),
                Text(
                  'Grade: $semesterGrade',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: AppColors.accent,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildOverallSummary() {
    final totalScore = widget.student.getTotalScore();
    final overallGrade = widget.student.getOverallGrade();
    final firstSemesterScore = widget.student.getSemesterTotalScore('first_semester');
    final secondSemesterScore = widget.student.getSemesterTotalScore('second_semester');
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppSizes.borderRadius),
        border: Border.all(color: AppColors.primary),
      ),
      child: Column(
        children: [
          const Text(
            'OVERALL ACADEMIC YEAR SUMMARY',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
              color: AppColors.primary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildSummaryItem('First Semester', firstSemesterScore, widget.student.getSemesterGrade('first_semester')),
              _buildSummaryItem('Second Semester', secondSemesterScore, widget.student.getSemesterGrade('second_semester')),
              _buildSummaryItem('Total Score', totalScore, overallGrade),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryItem(String label, int score, String grade) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 14,
            color: AppColors.secondary,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 4),
        Text(
          score.toString(),
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 20,
            color: AppColors.primary,
          ),
        ),
        Text(
          'Grade: $grade',
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 16,
            color: AppColors.accent,
          ),
        ),
      ],
    );
  }

  Widget _buildScoreCell(int score, {bool isTotal = false}) {
    Color textColor = Colors.black87;
    FontWeight fontWeight = FontWeight.w500;
    
    if (isTotal) {
      textColor = AppColors.primary;
      fontWeight = FontWeight.bold;
    } else if (score == 2) {
      textColor = Colors.green;
    } else if (score == 1) {
      textColor = Colors.orange;
    } else if (score == 0) {
      textColor = Colors.red;
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 2, horizontal: 4),
      child: Text(
        score.toString(),
        style: TextStyle(
          fontWeight: fontWeight,
          fontSize: 12,
          color: textColor,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }

  String _getMonthDisplayName(String month) {
    switch (month.toLowerCase()) {
      case 'september': return 'September';
      case 'october': return 'October';
      case 'november': return 'November';
      case 'december': return 'December';
      case 'january': return 'January';
      case 'february': return 'February';
      case 'march': return 'March';
      case 'april': return 'April';
      default: return month;
    }
  }
}
