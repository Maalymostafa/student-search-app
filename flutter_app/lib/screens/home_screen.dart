import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:student_search_app/providers/student_provider.dart';
import 'package:student_search_app/utils/constants.dart';
import 'package:student_search_app/widgets/performance_table.dart';
import 'package:student_search_app/widgets/search_form.dart';
import 'package:student_search_app/widgets/student_info.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _codeController = TextEditingController();

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: NetworkImage('https://i.imgur.com/ulaJxcO.jpg'),
            fit: BoxFit.cover,
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppSizes.padding),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 800),
                child: Container(
                  padding: const EdgeInsets.all(AppSizes.largePadding),
                  decoration: BoxDecoration(
                    color: AppColors.backgroundOverlay,
                    borderRadius: BorderRadius.circular(AppSizes.borderRadius),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.08),
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      // Demo mode notice
                      Consumer<StudentProvider>(
                        builder: (context, provider, child) {
                          if (provider.useDemoMode) {
                            return Container(
                              padding: const EdgeInsets.all(AppSizes.smallPadding),
                              margin: const EdgeInsets.only(bottom: AppSizes.padding),
                              decoration: BoxDecoration(
                                color: AppColors.warningColor.withOpacity(0.9),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.info_outline, color: Colors.white),
                                  const SizedBox(width: 8),
                                  const Expanded(
                                    child: Text(
                                      '🚀 Demo Mode - Testing with sample data',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  Switch(
                                    value: provider.useDemoMode,
                                    onChanged: provider.setUseDemoMode,
                                    activeColor: Colors.white,
                                  ),
                                ],
                              ),
                            );
                          }
                          return const SizedBox.shrink();
                        },
                      ),

                      // Headers
                      const Text(
                        'Mrs. Hoda Ismail wishes you the best of luck!',
                        style: AppTextStyles.heading1,
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: AppSizes.smallPadding),
                      const Text(
                        'Fun Search for Student Code Or Arabic Names!',
                        style: AppTextStyles.heading2,
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: AppSizes.smallPadding),
                      const Text(
                        'البحث بالكود',
                        style: AppTextStyles.heading3,
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: AppSizes.padding),

                      // Search Form
                      SearchForm(
                        controller: _codeController,
                        onSearch: (code) {
                          context.read<StudentProvider>().searchStudent(code);
                        },
                      ),

                      const SizedBox(height: AppSizes.padding),

                      // Results
                      Consumer<StudentProvider>(
                        builder: (context, provider, child) {
                          if (provider.isLoading) {
                            return const Center(
                              child: Column(
                                children: [
                                  CircularProgressIndicator(
                                    color: AppColors.accent,
                                  ),
                                  SizedBox(height: 16),
                                  Text(
                                    '...جاري التحميل',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }

                          if (provider.error != null) {
                            return Container(
                              padding: const EdgeInsets.all(AppSizes.padding),
                              decoration: BoxDecoration(
                                color: AppColors.errorColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(AppSizes.borderRadius),
                                border: Border.all(color: AppColors.errorColor),
                              ),
                              child: Text(
                                provider.error!,
                                style: const TextStyle(
                                  color: AppColors.errorColor,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            );
                          }

                          if (provider.student != null) {
                            return Column(
                              children: [
                                // Student Info
                                StudentInfo(student: provider.student!),
                                const SizedBox(height: AppSizes.padding),
                                
                                // Performance Table
                                PerformanceTable(student: provider.student!),
                                const SizedBox(height: AppSizes.padding),
                                
                                // Status
                                Container(
                                  padding: const EdgeInsets.all(AppSizes.padding),
                                  decoration: BoxDecoration(
                                    color: provider.student!.isConfirmed
                                        ? AppColors.successColor.withOpacity(0.1)
                                        : AppColors.errorColor.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(AppSizes.borderRadius),
                                    border: Border.all(
                                      color: provider.student!.isConfirmed
                                          ? AppColors.successColor
                                          : AppColors.errorColor,
                                    ),
                                  ),
                                  child: Text(
                                    provider.student!.isConfirmed
                                        ? 'تم تأكيد الحجز'
                                        : 'لم يتم تأكيد الحجز بعد',
                                    style: TextStyle(
                                      color: provider.student!.isConfirmed
                                          ? AppColors.successColor
                                          : AppColors.errorColor,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 50,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ),
                              ],
                            );
                          }

                          return const SizedBox.shrink();
                        },
                      ),

                      const SizedBox(height: AppSizes.padding),

                      // Footer message
                      const Text(
                        'برجاء الاحتفاظ بصورة التحويل',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
