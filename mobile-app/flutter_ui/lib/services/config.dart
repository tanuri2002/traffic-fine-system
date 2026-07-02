import 'package:flutter/foundation.dart';

class AppConfig {
  final String baseUrl;

  const AppConfig({
    required this.baseUrl,
  });

  static AppConfig fromEnv({
    String? baseUrl,
  }) {
    return AppConfig(
      baseUrl: baseUrl ?? 'http://localhost:3000',
    );
  }


  static String? _constFromString(String? v) {
    final s = v?.trim();
    if (s == null || s.isEmpty) return null;
    return s;
  }


  static AppConfig get defaultLocal {
    return const AppConfig(baseUrl: 'http://localhost:3000');
  }


  @visibleForTesting
  static AppConfig fromExplicitStrings({String? baseUrl}) {
    return AppConfig(
      baseUrl: _constFromString(baseUrl) ?? 'http://localhost:3000',
    );
  }
}


