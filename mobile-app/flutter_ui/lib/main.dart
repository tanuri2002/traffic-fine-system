import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/home_screen.dart';
import 'screens/fine_details_screen.dart';
import 'screens/payment_screen.dart';
import 'screens/payment_success_screen.dart';
import 'screens/payment_failure_screen.dart';
import 'screens/login_screen.dart';
import 'models/fine_model.dart';
import 'services/auth_service.dart';
import 'services/api_service.dart';
import 'services/config.dart';
import 'controllers/fine_controller.dart';


void main() {
  // Use app config to select backend URLs.
  // For now, defaults point to your local backend (auth:3000/4000 mismatch handled by config).
  final config = AppConfig.defaultLocal;

  final auth = AuthService(baseUrl: config.authBaseUrl);
  final api = ApiService(baseUrl: config.apiBaseUrl, authService: auth);
  final fineController = FineController(apiService: api);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<FineController>.value(value: fineController),
        Provider<AuthService>.value(value: auth),
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
        ),
      ),
      initialRoute: '/',
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/':
            return MaterialPageRoute(builder: (_) => const HomeScreen());
          case '/login':
            return MaterialPageRoute(builder: (_) => const LoginScreen());
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
                return MaterialPageRoute(builder: (_) => PaymentSuccessScreen(fine: fine, transactionId: txn));
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
                return MaterialPageRoute(builder: (_) => PaymentFailureScreen(fine: fine, failureReason: reason, transactionId: txn));
              }
            }
            return _routeError();
          default:
            return MaterialPageRoute(builder: (_) => const HomeScreen());
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