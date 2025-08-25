import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../widgets/feature_card.dart';
import '../utils/constants.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final supabase = Supabase.instance.client;
  Map<String, dynamic>? analytics;

  @override
  void initState() {
    super.initState();
    _loadAnalytics();
  }

  Future<void> _loadAnalytics() async {
    try {
      // Get basic analytics
      final studentsResponse = await supabase
          .from('students')
          .select('*');
      
      final performanceResponse = await supabase
          .from('student_performance')
          .select('*');

      setState(() {
        analytics = {
          'total_students': studentsResponse.length,
          'total_performance_records': performanceResponse.length,
        };
      });
    } catch (e) {
      print('Error loading analytics: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Student Search App'),
        centerTitle: true,
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.blue[600]!,
              Colors.blue[400]!,
              Colors.white,
            ],
            stops: [0.0, 0.3, 0.8],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header Section
              Container(
                padding: EdgeInsets.all(20),
                child: Column(
                  children: [
                    Icon(
                      Icons.school,
                      size: 80,
                      color: Colors.white,
                    ),
                    SizedBox(height: 16),
                    Text(
                      'Student Management System',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Search and manage student information',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white70,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              
              // Analytics Cards
              if (analytics != null)
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: [
                      Expanded(
                        child: _buildAnalyticsCard(
                          'Total Students',
                          '${analytics!['total_students']}',
                          Icons.people,
                          Colors.green,
                        ),
                      ),
                      SizedBox(width: 12),
                      Expanded(
                        child: _buildAnalyticsCard(
                          'Performance Records',
                          '${analytics!['total_performance_records']}',
                          Icons.assessment,
                          Colors.orange,
                        ),
                      ),
                    ],
                  ),
                ),
              
              SizedBox(height: 30),
              
              // Features Section
              Expanded(
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    children: [
                      Text(
                        'Quick Actions',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey[800],
                        ),
                      ),
                      SizedBox(height: 20),
                      
                      // Feature Cards
                      FeatureCard(
                        title: 'Search Students',
                        subtitle: 'Find students by code or name',
                        icon: Icons.search,
                        color: Colors.blue,
                        onTap: () => Navigator.pushNamed(context, '/search'),
                      ),
                      
                      SizedBox(height: 16),
                      
                      FeatureCard(
                        title: 'View Analytics',
                        subtitle: 'Student performance insights',
                        icon: Icons.analytics,
                        color: Colors.green,
                        onTap: () => Navigator.pushNamed(context, '/analytics'),
                      ),
                      
                      SizedBox(height: 16),
                      
                      FeatureCard(
                        title: 'Database Status',
                        subtitle: 'Check connection and tables',
                        icon: Icons.storage,
                        color: Colors.orange,
                        onTap: () => _checkDatabaseStatus(),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAnalyticsCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
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
          Icon(icon, size: 32, color: color),
          SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[600],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  void _checkDatabaseStatus() async {
    try {
      // Test database connection
      final result = await supabase.from('students').select('*').limit(1);
      
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Database Status'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('✅ Connection: Successful'),
              Text('✅ Students table: Accessible'),
              Text('📊 Records found: ${result.length}'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('OK'),
            ),
          ],
        ),
      );
    } catch (e) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Database Error'),
          content: Text('❌ Connection failed: $e'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('OK'),
            ),
          ],
        ),
      );
    }
  }
}
