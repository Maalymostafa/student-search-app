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
                          children: [
                            Text('Att.', style: AppTextStyles.tableSubHeader, fontSize: 12),
                            Text('Q1', style: AppTextStyles.tableSubHeader, fontSize: 12),
                            Text('Q2', style: AppTextStyles.tableSubHeader, fontSize: 12),
                            Text('Quiz', style: AppTextStyles.tableSubHeader, fontSize: 12),
                          ],
                        ),
                      ),
                    ),
                    TableCell(
                      child: Padding(
                        padding: EdgeInsets.all(4),
                        child: Column(
                          children: [
                            Text('Att.', style: AppTextStyles.tableSubHeader, fontSize: 12),
                            Text('Q1', style: AppTextStyles.tableSubHeader, fontSize: 12),
                            Text('Q2', style: AppTextStyles.tableSubHeader, fontSize: 12),
                            Text('Quiz', style: AppTextStyles.tableSubHeader, fontSize: 12),
                          ],
                        ),
                      ),
                    ),
                    TableCell(
                      child: Padding(
                        padding: EdgeInsets.all(4),
                        child: Column(
                          children: [
                            Text('Att.', style: AppTextStyles.tableSubHeader, fontSize: 12),
                            Text('Q1', style: AppTextStyles.tableSubHeader, fontSize: 12),
                            Text('Q2', style: AppTextStyles.tableSubHeader, fontSize: 12),
                            Text('Quiz', style: AppTextStyles.tableSubHeader, fontSize: 12),
                          ],
                        ),
                      ),
                    ),
                    TableCell(
                      child: Padding(
                        padding: EdgeInsets.all(4),
                        child: Column(
                          children: [
                            Text('Att.', style: AppTextStyles.tableSubHeader, fontSize: 12),
                            Text('Q1', style: AppTextStyles.tableSubHeader, fontSize: 12),
                            Text('Q2', style: AppTextStyles.tableSubHeader, fontSize: 12),
                            Text('Quiz', style: AppTextStyles.tableSubHeader, fontSize: 12),
                          ],
                        ),
                      ),
                    ),
                    TableCell(
                      child: Padding(
                        padding: EdgeInsets.all(4),
                        child: Column(
                          children: [
                            Text('Att.', style: AppTextStyles.tableSubHeader, fontSize: 12),
                            Text('Ques.', style: AppTextStyles.tableSubHeader, fontSize: 12),
                            Text('Quiz', style: AppTextStyles.tableSubHeader, fontSize: 12),
                            Text('Total', style: AppTextStyles.tableSubHeader, fontSize: 12),
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
      ],
    );
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
