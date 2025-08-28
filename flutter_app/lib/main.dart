import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:student_search_app/providers/student_provider.dart';
import 'package:student_search_app/screens/home_screen.dart';
import 'package:student_search_app/screens/registration_screen.dart';
import 'package:student_search_app/utils/constants.dart';

void main() {
  runApp(const StudentSearchApp());
}

class StudentSearchApp extends StatelessWidget {
  const StudentSearchApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => StudentProvider(),
      child: MaterialApp(
        title: 'Student Search App - Mrs. Hoda Ismail',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primarySwatch: Colors.blue,
          fontFamily: 'Poppins',
          scaffoldBackgroundColor: Colors.transparent,
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.transparent,
            elevation: 0,
            centerTitle: true,
            titleTextStyle: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        initialRoute: '/',
        routes: {
          '/': (context) => const HomeScreen(),
          '/register': (context) => const RegistrationScreen(),
        },
      ),
    );
  }
}
