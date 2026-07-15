import 'package:flutter/foundation.dart';

class AppConfig {
  final String baseUrl;
  final String paymentBaseUrl;

  const AppConfig({
    required this.baseUrl,
    required this.paymentBaseUrl,
  });

  static AppConfig fromEnv({
    String? baseUrl,
    String? paymentBaseUrl,
  }) {
    return AppConfig(
      baseUrl: baseUrl ?? 'http://localhost:5001/api',
      paymentBaseUrl: paymentBaseUrl ?? 'http://localhost:3001',
    );
  }


  static String? _constFromString(String? v) {
    final s = v?.trim();
    if (s == null || s.isEmpty) return null;
    return s;
  }


  static AppConfig get defaultLocal {
    return const AppConfig(
      baseUrl: 'http://localhost:5001/api',
      paymentBaseUrl: 'http://localhost:3001',
    );
  }


  @visibleForTesting
  static AppConfig fromExplicitStrings({String? baseUrl, String? paymentBaseUrl}) {
    return AppConfig(
      baseUrl: _constFromString(baseUrl) ?? 'http://localhost:5001/api',
      paymentBaseUrl: _constFromString(paymentBaseUrl) ?? 'http://localhost:3001',
    );
  }
}


