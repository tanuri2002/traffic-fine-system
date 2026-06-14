import 'package:flutter/foundation.dart';

class AppConfig {
  final String authBaseUrl;
  final String apiBaseUrl;

  const AppConfig({
    required this.authBaseUrl,
    required this.apiBaseUrl,
  });

  static AppConfig fromEnv({
    String? authBaseUrl,
    String? apiBaseUrl,
  }) {
    // For now we keep it simple and fall back to your local backend defaults.
    // If you later add dotenv/flutter_dotenv, map those values here.
    return AppConfig(
      authBaseUrl: authBaseUrl ?? 'http://localhost:4000',
      apiBaseUrl: apiBaseUrl ?? 'http://localhost:3000',
    );
  }

  static String? _constFromString(String? v) {
    final s = v?.trim();
    if (s == null || s.isEmpty) return null;
    return s;
  }

  static AppConfig get defaultLocal {
    return const AppConfig(authBaseUrl: 'http://localhost:4000', apiBaseUrl: 'http://localhost:3000');
  }

  @visibleForTesting
  static AppConfig fromExplicitStrings({String? authUrl, String? apiUrl}) {
    return AppConfig(
      authBaseUrl: _constFromString(authUrl) ?? 'http://localhost:4000',
      apiBaseUrl: _constFromString(apiUrl) ?? 'http://localhost:3000',
    );
  }
}

