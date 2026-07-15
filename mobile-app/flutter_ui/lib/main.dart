import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/officer_login_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Traffic Fine Payment',
      theme: ThemeData(
        primaryColor: const Color(0xFF001F5C),
        useMaterial3: true,
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF001F5C),
          elevation: 0,
        ),
      ),
      routes: {
        '/officer-login': (context) => const OfficerLoginScreen(),
      },
      home: const RoleGate(),
      debugShowCheckedModeBanner: false,
    );
  }
}

// Wraps HomeScreen (unchanged, owned by teammate) with a small floating
// entry point for officers, so the driver flow stays completely untouched.
class RoleGate extends StatelessWidget {
  const RoleGate({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: const HomeScreen(),
      floatingActionButton: FloatingActionButton.extended(
        heroTag: 'officer-entry',
        backgroundColor: const Color(0xFF001F5C),
        icon: const Icon(Icons.shield),
        label: const Text('Officer Login'),
        onPressed: () => Navigator.pushNamed(context, '/officer-login'),
      ),
    );
  }
}