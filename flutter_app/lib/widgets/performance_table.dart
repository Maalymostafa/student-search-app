import 'package:flutter/material.dart';
import 'package:student_search_app/models/student.dart';
import 'package:student_search_app/utils/constants.dart';

class PerformanceTable extends StatelessWidget {
  final Student student;

  const PerformanceTable({
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
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Table(
          border: TableBorder.all(
            color: AppColors.inputBorderColor,
            width: 1,
          ),
          children: [
            // Header row 1
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
                    padding: EdgeInsets.all(12),
                    child: Text(
                      'Session 1',
                      style: AppTextStyles.tableHeader,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
                const TableCell(
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: Text(
                      'Session 2',
                      style: AppTextStyles.tableHeader,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
                const TableCell(
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: Text(
                      'Session 3',
                      style: AppTextStyles.tableHeader,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
                const TableCell(
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: Text(
                      'Session 4',
                      style: AppTextStyles.tableHeader,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
                const TableCell(
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: Text(
                      'Final Evaluation',
                      style: AppTextStyles.tableHeader,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ],
            ),
            // Header row 2
            TableRow(
              decoration: const BoxDecoration(
                color: AppColors.tableHeaderColor,
              ),
              children: const [
                TableCell(child: SizedBox.shrink()),
                TableCell(
                  child: Padding(
                    padding: EdgeInsets.all(8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Text(
                          'Perf.',
                          style: AppTextStyles.tableSubHeader,
                        ),
                        Text(
                          'Quiz',
                          style: AppTextStyles.tableSubHeader,
                        ),
                      ],
                    ),
                  ),
                ),
                TableCell(
                  child: Padding(
                    padding: EdgeInsets.all(8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Text(
                          'Perf.',
                          style: AppTextStyles.tableSubHeader,
                        ),
                        Text(
                          'Quiz',
                          style: AppTextStyles.tableSubHeader,
                        ),
                      ],
                    ),
                  ),
                ),
                TableCell(
                  child: Padding(
                    padding: EdgeInsets.all(8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Text(
                          'Perf.',
                          style: AppTextStyles.tableSubHeader,
                        ),
                        Text(
                          'Quiz',
                          style: AppTextStyles.tableSubHeader,
                        ),
                      ],
                    ),
                  ),
                ),
                TableCell(
                  child: Padding(
                    padding: EdgeInsets.all(8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Text(
                          'Perf.',
                          style: AppTextStyles.tableSubHeader,
                        ),
                        Text(
                          'Quiz',
                          style: AppTextStyles.tableSubHeader,
                        ),
                      ],
                    ),
                  ),
                ),
                TableCell(child: SizedBox.shrink()),
              ],
            ),
            // Data rows
            _buildMonthRow('September', student.getMonthData('september')),
            _buildMonthRow('October', student.getMonthData('october')),
            _buildMonthRow('November', student.getMonthData('november')),
            _buildMonthRow('December', student.getMonthData('december')),
          ],
        ),
      ),
    );
  }

  TableRow _buildMonthRow(String month, List<String> monthData) {
    return TableRow(
      children: [
        TableCell(
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Text(
              month,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ),
        TableCell(
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Text(
                  monthData.isNotEmpty ? monthData[0] : '',
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
                Text(
                  monthData.length > 1 ? monthData[1] : '',
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
        ),
        TableCell(
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Text(
                  monthData.length > 2 ? monthData[2] : '',
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
                Text(
                  monthData.length > 3 ? monthData[3] : '',
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
        ),
        TableCell(
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Text(
                  monthData.length > 4 ? monthData[4] : '',
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
                Text(
                  monthData.length > 5 ? monthData[5] : '',
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
        ),
        TableCell(
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Text(
                  monthData.length > 6 ? monthData[6] : '',
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
                Text(
                  monthData.length > 7 ? monthData[7] : '',
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
        ),
        TableCell(
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Text(
              monthData.length > 8 ? monthData[8] : '',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ),
      ],
    );
  }
}
