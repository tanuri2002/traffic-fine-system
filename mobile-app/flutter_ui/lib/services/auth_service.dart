import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class AuthService {
  static const _storageKey = 'jwt_token';
  static const _refreshKey = 'refresh_token';
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  final String baseUrl;

  AuthService({required this.baseUrl});

  Future<void> saveToken(String token) async {
    await _storage.write(key: _storageKey, value: token);
  }

  Future<String?> getToken() async {
    return await _storage.read(key: _storageKey);
  }

  Future<void> clearTokens() async {
    await _storage.delete(key: _storageKey);
    await _storage.delete(key: _refreshKey);
  }

  Future<bool> login(String username, String password) async {
    final resp = await http.post(
      Uri.parse('\$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );

    if (resp.statusCode == 200) {
      final Map<String, dynamic> body = jsonDecode(resp.body);
      final token = body['token'] ?? body['access_token'];
      final refresh = body['refresh_token'];
      if (token != null) {
        await saveToken(token);
        if (refresh != null) await _storage.write(key: _refreshKey, value: refresh);
        return true;
      }
    }
    return false;
  }

  // Optional: try refresh flow if backend supports it
  Future<bool> tryRefresh() async {
    final refresh = await _storage.read(key: _refreshKey);
    if (refresh == null) return false;
    final resp = await http.post(
      Uri.parse('\$baseUrl/auth/refresh'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'refresh_token': refresh}),
    );
    if (resp.statusCode == 200) {
      final Map<String, dynamic> body = jsonDecode(resp.body);
      final token = body['token'] ?? body['access_token'];
      if (token != null) {
        await saveToken(token);
        return true;
      }
    }
    await clearTokens();
    return false;
  }
}
