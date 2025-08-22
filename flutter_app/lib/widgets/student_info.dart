import 'package:flutter/material.dart';
import 'package:student_search_app/models/student.dart';
import 'package:student_search_app/utils/constants.dart';

class StudentInfo extends StatelessWidget {
  final Student student;

  const StudentInfo({
    super.key,
    required this.student,
  });

  @override
  Widget build(BuildContext context) {
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
      child: Table(
        border: TableBorder.all(
          color: AppColors.inputBorderColor,
          width: 1,
        ),
        children: [
          TableRow(
            decoration: const BoxDecoration(
              color: AppColors.tableHeaderColor,
            ),
            children: const [
              TableCell(
                child: Padding(
                  padding: EdgeInsets.all(12),
                  child: Text(
                    'Name',
                    style: AppTextStyles.tableHeader,
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
              TableCell(
                child: Padding(
                  padding: EdgeInsets.all(12),
                  child: Text(
                    'Student Code',
                    style: AppTextStyles.tableHeader,
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ],
          ),
          TableRow(
            children: [
              TableCell(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Text(
                    student.name,
                    style: const AppTextStyles.resultText,
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
              TableCell(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Text(
                    student.studentCode,
                    style: const AppTextStyles.resultText,
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
