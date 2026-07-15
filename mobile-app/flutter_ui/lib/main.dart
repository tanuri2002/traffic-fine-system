import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/home_screen.dart';
import 'screens/fine_details_screen.dart';
import 'screens/payment_screen.dart';
import 'screens/payment_success_screen.dart';
import 'screens/payment_failure_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/officer_login_screen.dart';
import 'models/fine_model.dart';
import 'services/api_service.dart';
import 'services/config.dart';
import 'controllers/fine_controller.dart';

void main() {
  // Use app config to select backend URLs.
  final config = AppConfig.defaultLocal;
  final api = ApiService(
    baseUrl: config.baseUrl,
    paymentBaseUrl: 'http://10.0.2.2:3001', // backend-payment
  );
  final fineController = FineController(apiService: api);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<FineController>.value(value: fineController),
        Provider<ApiService>.value(value: api),
      ],
      child: const MyApp(),
    ),
  );
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
          titleTextStyle: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
      ),
      initialRoute: '/',
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/':
            return MaterialPageRoute(builder: (_) => const RoleGate());
          case '/officer-login':
            return MaterialPageRoute(builder: (_) => const OfficerLoginScreen());
          case '/login':
            return MaterialPageRoute(builder: (_) => const LoginScreen());
          case '/register':
            return MaterialPageRoute(builder: (_) => const RegisterScreen());
          case '/fineDetails':
            final args = settings.arguments;
            if (args is Fine) {
              return MaterialPageRoute(builder: (_) => FineDetailsScreen(fine: args));
            }
            return _routeError();
          case '/payment':
            final args = settings.arguments;
            if (args is Fine) {
              return MaterialPageRoute(builder: (_) => PaymentScreen(fine: args));
            }
            return _routeError();
          case '/success':
            final args = settings.arguments;
            if (args is Map<String, dynamic>) {
              final fine = args['fine'] as Fine?;
              final txn = args['transactionId'] as String?;
              if (fine != null && txn != null) {
                return MaterialPageRoute(
                  builder: (_) => PaymentSuccessScreen(fine: fine, transactionId: txn),
                );
              }
            }
            return _routeError();
          case '/failure':
            final args = settings.arguments;
            if (args is Map<String, dynamic>) {
              final fine = args['fine'] as Fine?;
              final reason = args['reason'] as String?;
              final txn = args['transactionId'] as String?;
              if (fine != null && reason != null && txn != null) {
                return MaterialPageRoute(
                  builder: (_) => PaymentFailureScreen(
                    fine: fine,
                    failureReason: reason,
                    transactionId: txn,
                  ),
                );
              }
            }
            return _routeError();
          default:
            return MaterialPageRoute(builder: (_) => const RoleGate());
        }
      },
      debugShowCheckedModeBanner: false,
    );
  }

  MaterialPageRoute<dynamic> _routeError() {
    return MaterialPageRoute(
      builder: (_) => const Scaffold(
        body: Center(child: Text('Route error')),
      ),
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