import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/student.dart';

class StudentDetailsScreen extends StatefulWidget {
  @override
  _StudentDetailsScreenState createState() => _StudentDetailsScreenState();
}

class _StudentDetailsScreenState extends State<StudentDetailsScreen> {
  final supabase = Supabase.instance.client;
  Student? student;
  List<Map<String, dynamic>> performanceData = [];
  List<Map<String, dynamic>> contactData = [];
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadStudentData();
    });
  }

  Future<void> _loadStudentData() async {
    try {
      final args = ModalRoute.of(context)!.settings.arguments as Student;
      setState(() {
        student = args;
      });

      // Load performance data
      final performanceResponse = await supabase
          .from('student_performance')
          .select('*')
          .eq('student_id', student!.id)
          .order('year', ascending: false)
          .order('month', ascending: false);

      // Load contact data
      final contactResponse = await supabase
          .from('student_contacts')
          .select('*')
          .eq('student_id', student!.id);

      setState(() {
        performanceData = List<Map<String, dynamic>>.from(performanceResponse);
        contactData = List<Map<String, dynamic>>.from(contactResponse);
        isLoading = false;
      });

    } catch (e) {
      setState(() {
        errorMessage = 'Error loading student data: $e';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: Text('Student Details'),
          leading: IconButton(
            icon: Icon(Icons.arrow_back),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Loading student details...'),
            ],
          ),
        ),
      );
    }

    if (errorMessage != null) {
      return Scaffold(
        appBar: AppBar(
          title: Text('Student Details'),
          leading: IconButton(
            icon: Icon(Icons.arrow_back),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error, size: 64, color: Colors.red),
              SizedBox(height: 16),
              Text(
                errorMessage!,
                style: TextStyle(color: Colors.red),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    if (student == null) {
      return Scaffold(
        appBar: AppBar(
          title: Text('Student Details'),
          leading: IconButton(
            icon: Icon(Icons.arrow_back),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: Center(
          child: Text('Student not found'),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Student Details'),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Student Header Card
            _buildStudentHeaderCard(),
            SizedBox(height: 20),

            // Personal Information
            _buildSectionCard(
              'Personal Information',
              Icons.person,
              [
                _buildInfoRow('Student Code', student!.studentCode),
                _buildInfoRow('Full Name', student!.fullNameArabic),
                _buildInfoRow('Grade Level', student!.gradeLevel),
                if (student!.enrollmentDate != null)
                  _buildInfoRow('Enrollment Date', student!.enrollmentDate!),
              ],
            ),
            SizedBox(height: 16),

            // Contact Information
            if (contactData.isNotEmpty)
              _buildSectionCard(
                'Contact Information',
                Icons.contact_phone,
                contactData.map((contact) => _buildInfoRow(
                  contact['contact_type'] ?? 'Contact',
                  '${contact['name'] ?? ''} - ${contact['phone'] ?? ''}',
                )).toList(),
              ),
            SizedBox(height: 16),

            // Subscription Information
            if (student!.subscriptionType != null)
              _buildSectionCard(
                'Subscription Information',
                Icons.payment,
                [
                  _buildInfoRow('Subscription Type', student!.subscriptionType!),
                  if (student!.transferPhone != null)
                    _buildInfoRow('Transfer Phone', student!.transferPhone!),
                  if (student!.transferDate != null)
                    _buildInfoRow('Transfer Date', student!.transferDate!),
                  _buildInfoRow('Status', student!.isConfirmed ? 'Confirmed' : 'Pending'),
                ],
              ),
            SizedBox(height: 16),

            // Performance Data
            if (performanceData.isNotEmpty)
              _buildSectionCard(
                'Performance Records',
                Icons.assessment,
                performanceData.map((perf) => _buildInfoRow(
                  '${perf['month']} ${perf['year']}',
                  'Final: ${perf['final_evaluation'] ?? 'N/A'} | Attendance: ${perf['attendance_percentage'] ?? 'N/A'}%',
                )).toList(),
              ),
            SizedBox(height: 16),

            // Notes
            if (student!.notes != null && student!.notes!.isNotEmpty)
              _buildSectionCard(
                'Notes',
                Icons.note,
                [
                  _buildInfoRow('', student!.notes!),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildStudentHeaderCard() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.blue[600]!, Colors.blue[400]!],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          CircleAvatar(
            radius: 40,
            backgroundColor: Colors.white,
            child: Text(
              student!.studentCode,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.blue[600],
              ),
            ),
          ),
          SizedBox(height: 16),
          Text(
            student!.fullNameArabic,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 8),
          Text(
            student!.gradeLevel,
            style: TextStyle(
              fontSize: 16,
              color: Colors.white70,
            ),
          ),
          SizedBox(height: 12),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: student!.isConfirmed 
                  ? Colors.green.withOpacity(0.2)
                  : Colors.orange.withOpacity(0.2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  student!.isConfirmed ? Icons.check_circle : Icons.pending,
                  color: student!.isConfirmed ? Colors.green[100] : Colors.orange[100],
                  size: 20,
                ),
                SizedBox(width: 8),
                Text(
                  student!.isConfirmed ? 'Payment Confirmed' : 'Payment Pending',
                  style: TextStyle(
                    color: student!.isConfirmed ? Colors.green[100] : Colors.orange[100],
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionCard(String title, IconData icon, List<Widget> children) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: Colors.blue[600]),
              SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[800],
                ),
              ),
            ],
          ),
          SizedBox(height: 12),
          ...children,
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (label.isNotEmpty) ...[
            SizedBox(
              width: 120,
              child: Text(
                label,
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  color: Colors.grey[600],
                ),
              ),
            ),
            SizedBox(width: 8),
            Text(': '),
          ],
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                color: Colors.grey[800],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

